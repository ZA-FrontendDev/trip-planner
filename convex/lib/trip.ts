import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

type ReaderCtx = QueryCtx | MutationCtx;

type PackageRecord = {
  _id: Id<"packages">;
  title: string;
  slug: string;
  destination: string;
  departureCity: string;
  durationDays: number;
  basePrice: number;
  maxPersons: number;
  travelClass: "economy" | "business";
  coverImage: string;
  isActive: boolean;
  createdAt: number;
  defaultVehicleId?: Id<"vehicles">;
};

type HotelOverride = {
  dayId: Id<"itineraryDays">;
  hotelId: Id<"hotels">;
  roomType: string;
};

type BookingRecord = {
  _id: Id<"bookings">;
  packageId: Id<"packages">;
  vehicleId?: Id<"vehicles">;
  adults: number;
  children: number;
  roomType: string;
  startDate: string;
  endDate: string;
  hotelOverrides?: HotelOverride[];
};

type ItineraryDayRecord = {
  _id?: Id<"itineraryDays">;
  packageId?: Id<"packages">;
  dayNumber: number;
  date?: string;
  title: string;
  description: string;
  overnightLocation: string;
  placesCovered: {
    name: string;
    image: string;
  }[];
};

export function calculateDurationDays(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(days, 1);
}

export function formatDateForDisplay(isoDate: string) {
  return new Intl.DateTimeFormat("en-PK", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(isoDate));
}

export function buildDateForDay(startDate: string, dayNumber: number) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + dayNumber - 1);
  return date.toISOString().slice(0, 10);
}

function getRouteStops(pkg: PackageRecord) {
  const titleStops = pkg.title
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

  return Array.from(new Set([pkg.departureCity, ...titleStops, pkg.destination]));
}

function generateFallbackDay(
  pkg: PackageRecord,
  startDate: string,
  dayNumber: number,
  previousDay?: ItineraryDayRecord
): ItineraryDayRecord {
  const routeStops = getRouteStops(pkg);
  const destinationStop = routeStops[Math.min(dayNumber - 1, routeStops.length - 1)] ?? pkg.destination;
  const nextStop =
    dayNumber === pkg.durationDays
      ? pkg.departureCity
      : routeStops[Math.min(dayNumber, routeStops.length - 1)] ?? pkg.destination;
  const overnightLocation = dayNumber === pkg.durationDays ? pkg.departureCity : destinationStop;
  const title =
    dayNumber === pkg.durationDays
      ? `${previousDay?.overnightLocation ?? pkg.destination} to ${pkg.departureCity}`
      : dayNumber === 1
        ? `${pkg.departureCity} to ${destinationStop}`
        : destinationStop === nextStop
          ? `${destinationStop} exploration day`
          : `${destinationStop} to ${nextStop}`;

  return {
    dayNumber,
    title,
    description:
      dayNumber === pkg.durationDays
        ? `Return transfer to ${pkg.departureCity} with scheduled rest stops and trip closeout on arrival.`
        : destinationStop === nextStop
          ? `Leisure day around ${destinationStop} with scenic stops, guided activities, and flexible pacing based on your package.`
          : `Travel through ${destinationStop} with curated stopovers before continuing onward toward ${nextStop}.`,
    overnightLocation,
    placesCovered: [
      {
        name: destinationStop,
        image: pkg.coverImage
      },
      {
        name: nextStop,
        image: pkg.coverImage
      }
    ]
  };
}

function ensureCompleteItineraryDays(
  pkg: PackageRecord,
  booking: BookingRecord,
  storedDays: ItineraryDayRecord[]
) {
  const storedByDay = new Map(storedDays.map((day) => [day.dayNumber, day]));
  const completedDays: ItineraryDayRecord[] = [];

  for (let dayNumber = 1; dayNumber <= pkg.durationDays; dayNumber += 1) {
    const existingDay = storedByDay.get(dayNumber);
    if (existingDay) {
      completedDays.push(existingDay);
      continue;
    }

    completedDays.push(
      generateFallbackDay(pkg, booking.startDate, dayNumber, completedDays[completedDays.length - 1])
    );
  }

  return completedDays;
}

export async function resolveMatchingPackage(
  ctx: ReaderCtx,
  args: {
    destination: string;
    departureCity: string;
    durationDays: number;
    travelClass: string;
    totalPersons: number;
  }
) {
  const packages = await ctx.db.query("packages").collect();

  const candidates = packages
    .filter(
      (pkg: any) =>
        pkg.destination === args.destination &&
        pkg.departureCity === args.departureCity &&
        pkg.isActive &&
        pkg.travelClass === args.travelClass &&
        pkg.maxPersons >= args.totalPersons
    )
    .sort((a, b) => {
      const aScore = Math.abs(a.durationDays - args.durationDays);
      const bScore = Math.abs(b.durationDays - args.durationDays);
      if (aScore !== bScore) {
        return aScore - bScore;
      }
      return a.basePrice - b.basePrice;
    });

  return (candidates[0] as PackageRecord | undefined) ?? null;
}

export async function getVehicleChoices(ctx: ReaderCtx, totalPersons: number) {
  const vehicles = await ctx.db.query("vehicles").collect();
  return vehicles.filter((vehicle: any) => vehicle.capacity >= totalPersons);
}

export async function ensureStoredPackageItinerary(
  ctx: MutationCtx,
  pkg: PackageRecord,
  startDate: string
) {
  const storedDays = (await ctx.db.query("itineraryDays").collect())
    .filter((day: any) => day.packageId === pkg._id)
    .sort((a, b) => a.dayNumber - b.dayNumber) as ItineraryDayRecord[];

  if (storedDays.length >= pkg.durationDays) {
    return;
  }

  const completedDays = ensureCompleteItineraryDays(
    pkg,
    {
      _id: `bootstrap-booking-${pkg._id}` as Id<"bookings">,
      packageId: pkg._id,
      startDate,
      endDate: buildDateForDay(startDate, pkg.durationDays),
      adults: 0,
      children: 0,
      roomType: "Standard",
      hotelOverrides: []
    },
    storedDays
  );

  const hotels = await ctx.db.query("hotels").collect();

  for (const day of completedDays) {
    if (day._id) {
      continue;
    }

    const itineraryDayId = await ctx.db.insert("itineraryDays", {
      packageId: pkg._id,
      dayNumber: day.dayNumber,
      date: buildDateForDay(startDate, day.dayNumber),
      title: day.title,
      description: day.description,
      overnightLocation: day.overnightLocation,
      placesCovered: day.placesCovered
    });

    const matchingHotel =
      hotels.find((hotel: any) => hotel.location.toLowerCase() === day.overnightLocation.toLowerCase()) ??
      hotels[0];

    if (matchingHotel) {
      await ctx.db.insert("itineraryHotels", {
        itineraryDayId,
        hotelId: matchingHotel._id,
        roomType: matchingHotel.roomTypes[0]?.type ?? "Standard",
        quantity: 1
      });
    }
  }
}

export async function getHotelByRoomSelection(
  ctx: ReaderCtx,
  hotelId: Id<"hotels">,
  roomType: string
) {
  const hotel = await ctx.db.get(hotelId);
  if (!hotel) {
    return null;
  }
  const selectedRoom = hotel.roomTypes.find((item: any) => item.type === roomType);
  return {
    hotel,
    roomRate: selectedRoom?.pricePerNight ?? hotel.pricePerNight
  };
}

export async function calculateBookingTotal(
  ctx: ReaderCtx,
  booking: BookingRecord,
  pkg?: PackageRecord | null
) {
  const activePackage = pkg ?? ((await ctx.db.get(booking.packageId)) as PackageRecord | null);
  if (!activePackage) {
    return 0;
  }

  const durationDays = calculateDurationDays(booking.startDate, booking.endDate);
  const baseCost = activePackage.basePrice * booking.adults;

  let vehicleCost = 0;
  if (booking.vehicleId) {
    const vehicle = await ctx.db.get(booking.vehicleId);
    vehicleCost = (vehicle?.pricePerDay ?? 0) * durationDays;
  }

  const itineraryDays = (await ctx.db.query("itineraryDays").collect()).filter(
    (day: any) => day.packageId === booking.packageId
  );

  const itineraryHotels = await ctx.db
    .query("itineraryHotels")
    .collect();

  const hotelAssignments = itineraryHotels.filter((assignment: any) =>
    itineraryDays.some((day: any) => day._id === assignment.itineraryDayId)
  );

  const overrides = booking.hotelOverrides ?? [];
  let hotelCost = 0;

  const completedDays = ensureCompleteItineraryDays(activePackage, booking, itineraryDays as ItineraryDayRecord[]);

  for (const day of completedDays) {
    if (!day._id) {
      continue;
    }
    const override = overrides.find((item: any) => item.dayId === day._id);
    if (override) {
      const selected = await getHotelByRoomSelection(ctx, override.hotelId, override.roomType);
      hotelCost += selected?.roomRate ?? 0;
      continue;
    }

    const assignment = hotelAssignments.find((item: any) => item.itineraryDayId === day._id);
    if (!assignment) {
      continue;
    }
    const selected = await getHotelByRoomSelection(ctx, assignment.hotelId, assignment.roomType);
    hotelCost += (selected?.roomRate ?? 0) * (assignment.quantity ?? 1);
  }

  return baseCost + vehicleCost + hotelCost;
}

export async function buildBookingItinerary(ctx: ReaderCtx, bookingId: Id<"bookings">) {
  const booking = await ctx.db.get(bookingId);
  if (!booking) {
    return null;
  }

  const pkg = await ctx.db.get(booking.packageId);
  if (!pkg) {
    return null;
  }

  const itineraryDays = (await ctx.db.query("itineraryDays").collect()).filter(
    (day: any) => day.packageId === booking.packageId
  );

  itineraryDays.sort((a, b) => a.dayNumber - b.dayNumber);
  const completedDays = ensureCompleteItineraryDays(pkg as PackageRecord, booking as BookingRecord, itineraryDays as ItineraryDayRecord[]);

  const itineraryHotels = await ctx.db.query("itineraryHotels").collect();
  const hotelOptions = await ctx.db.query("hotels").collect();
  const vehicleOptions = await getVehicleChoices(ctx, booking.adults + booking.children);
  const selectedVehicle = booking.vehicleId ? await ctx.db.get(booking.vehicleId) : null;
  const overrides = booking.hotelOverrides ?? [];

  const days = await Promise.all(
    completedDays.map(async (day) => {
      const assignment = day._id
        ? itineraryHotels.find((item: any) => item.itineraryDayId === day._id)
        : null;
      const override = day._id
        ? overrides.find((item: any) => item.dayId === day._id)
        : null;
      const chosenHotelId = override?.hotelId ?? assignment?.hotelId;
      const chosenRoomType = override?.roomType ?? assignment?.roomType ?? booking.roomType;
      const roomQuantity = assignment?.quantity ?? 1;
      const hotel = chosenHotelId ? await ctx.db.get(chosenHotelId) : null;

      return {
        _id: day._id ?? `generated-day-${day.dayNumber}`,
        dayNumber: day.dayNumber,
        date: buildDateForDay(booking.startDate, day.dayNumber),
        title: day.title,
        description: day.description,
        overnightLocation: day.overnightLocation,
        placesCovered: day.placesCovered,
        hotelAssignmentId: assignment?._id,
        hotel,
        roomType: chosenRoomType,
        roomQuantity,
        isGenerated: !day._id
      };
    })
  );

  return {
    ...booking,
    package: pkg,
    vehicle: selectedVehicle,
    vehicleOptions,
    hotelOptions,
    days
  };
}
