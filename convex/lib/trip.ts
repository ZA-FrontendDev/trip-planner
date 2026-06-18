import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import { resolvePlaceImage } from "./place_images";

type ReaderCtx = QueryCtx | MutationCtx;

export type TripRequestArgs = {
  packageId?: Id<"packages"> | string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  departureCity: string;
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  roomType: string;
  travelClass: string;
  vehicleType: string;
  specialRequests: string;
};

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
  startDestination?: string;
  endDestination?: string;
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
  const titleStops = pkg.title.includes("|")
    ? pkg.title
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

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
        image: resolvePlaceImage(destinationStop, pkg.coverImage)
      },
      {
        name: nextStop,
        image: resolvePlaceImage(nextStop, pkg.coverImage)
      }
    ],
    startDestination: previousDay?.overnightLocation ?? pkg.departureCity,
    endDestination: overnightLocation
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
        pkg.durationDays === args.durationDays &&
        pkg.travelClass === args.travelClass &&
        pkg.maxPersons >= args.totalPersons
    )
    .sort((a, b) => a.basePrice - b.basePrice);

  return (candidates[0] as PackageRecord | undefined) ?? null;
}

export async function getAvailabilityHints(
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
  const eligiblePackages = packages.filter(
    (pkg: any) =>
      pkg.isActive &&
      pkg.travelClass === args.travelClass &&
      pkg.maxPersons >= args.totalPersons
  );

  const exactRouteAlternatives = eligiblePackages
    .filter(
      (pkg: any) =>
        pkg.destination === args.destination &&
        pkg.departureCity === args.departureCity
    )
    .sort((a, b) => a.durationDays - b.durationDays)
    .map((pkg: any) => ({
      packageId: pkg._id,
      destination: pkg.destination,
      departureCity: pkg.departureCity,
      durationDays: pkg.durationDays,
      title: pkg.title,
      coverImage: pkg.coverImage,
      basePrice: pkg.basePrice,
      travelClass: pkg.travelClass
    }));

  const sameDestinationAlternatives = eligiblePackages
    .filter(
      (pkg: any) =>
        pkg.destination === args.destination
    )
    .sort((a, b) => {
      const durationGap = Math.abs(a.durationDays - args.durationDays) - Math.abs(b.durationDays - args.durationDays);
      if (durationGap !== 0) {
        return durationGap;
      }
      const departureGap = a.departureCity.localeCompare(b.departureCity);
      if (departureGap !== 0) {
        return departureGap;
      }
      return a.basePrice - b.basePrice;
    })
    .slice(0, 6)
    .map((pkg: any) => ({
      packageId: pkg._id,
      destination: pkg.destination,
      departureCity: pkg.departureCity,
      durationDays: pkg.durationDays,
      title: pkg.title,
      coverImage: pkg.coverImage,
      basePrice: pkg.basePrice,
      travelClass: pkg.travelClass
    }));

  const sameDepartureAlternatives = eligiblePackages
    .filter(
      (pkg: any) =>
        pkg.departureCity === args.departureCity
    )
    .sort((a, b) => {
      const durationGap = Math.abs(a.durationDays - args.durationDays) - Math.abs(b.durationDays - args.durationDays);
      if (durationGap !== 0) {
        return durationGap;
      }
      return a.destination.localeCompare(b.destination);
    })
    .slice(0, 6)
    .map((pkg: any) => ({
      packageId: pkg._id,
      destination: pkg.destination,
      departureCity: pkg.departureCity,
      durationDays: pkg.durationDays,
      title: pkg.title,
      coverImage: pkg.coverImage,
      basePrice: pkg.basePrice,
      travelClass: pkg.travelClass
    }));

  const fallbackAlternatives = eligiblePackages
    .sort((a, b) => {
      const durationGap = Math.abs(a.durationDays - args.durationDays) - Math.abs(b.durationDays - args.durationDays);
      if (durationGap !== 0) {
        return durationGap;
      }
      return a.destination.localeCompare(b.destination);
    })
    .slice(0, 6)
    .map((pkg: any) => ({
      packageId: pkg._id,
      destination: pkg.destination,
      departureCity: pkg.departureCity,
      durationDays: pkg.durationDays,
      title: pkg.title,
      coverImage: pkg.coverImage,
      basePrice: pkg.basePrice,
      travelClass: pkg.travelClass
    }));

  return {
    exactRouteAlternatives,
    sameDestinationAlternatives,
    sameDepartureAlternatives,
    fallbackAlternatives
  };
}

export async function getVehicleChoices(ctx: ReaderCtx, totalPersons: number) {
  const vehicles = await ctx.db.query("vehicles").collect();
  return vehicles.filter((vehicle: any) => vehicle.capacity >= totalPersons);
}

export async function resolveSelectedVehicle(
  ctx: ReaderCtx,
  pkg: PackageRecord,
  totalPersons: number,
  vehicleType: string,
  preferPackageDefault = false
) {
  const availableVehicles = await getVehicleChoices(ctx, totalPersons);
  const packageDefaultVehicle = availableVehicles.find(
    (vehicle: any) => vehicle._id === pkg.defaultVehicleId
  );
  const requestedVehicle = availableVehicles.find((vehicle: any) => vehicle.name === vehicleType);
  const selectedVehicle = preferPackageDefault
    ? packageDefaultVehicle ?? requestedVehicle ?? availableVehicles[0] ?? null
    : requestedVehicle ?? packageDefaultVehicle ?? availableVehicles[0] ?? null;

  return {
    availableVehicles,
    selectedVehicle
  };
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
      startDestination: day.startDestination ?? (day.dayNumber === 1 ? pkg.departureCity : completedDays[completedDays.length - 1]?.overnightLocation ?? pkg.destination),
      endDestination: day.endDestination ?? day.overnightLocation,
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
  const baseCost = activePackage.basePrice;

  let defaultVehicleCost = 0;
  if (activePackage.defaultVehicleId) {
    const defaultVehicle = await ctx.db.get(activePackage.defaultVehicleId);
    defaultVehicleCost = (defaultVehicle?.pricePerDay ?? 0) * durationDays;
  }

  let selectedVehicleCost = defaultVehicleCost;
  if (booking.vehicleId) {
    const vehicle = await ctx.db.get(booking.vehicleId);
    selectedVehicleCost = (vehicle?.pricePerDay ?? 0) * durationDays;
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
  let hotelDelta = 0;

  const completedDays = ensureCompleteItineraryDays(activePackage, booking, itineraryDays as ItineraryDayRecord[]);

  for (const day of completedDays) {
    if (!day._id) {
      continue;
    }
    const assignment = hotelAssignments.find((item: any) => item.itineraryDayId === day._id);
    if (!assignment) {
      continue;
    }

    const defaultSelection = await getHotelByRoomSelection(ctx, assignment.hotelId, assignment.roomType);
    const defaultDayCost = (defaultSelection?.roomRate ?? 0) * (assignment.quantity ?? 1);

    const override = overrides.find((item: any) => item.dayId === day._id);
    if (!override) {
      continue;
    }

    const selected = await getHotelByRoomSelection(ctx, override.hotelId, override.roomType);
    const selectedDayCost = (selected?.roomRate ?? 0) * (assignment.quantity ?? 1);
    hotelDelta += selectedDayCost - defaultDayCost;
  }

  const vehicleDelta = selectedVehicleCost - defaultVehicleCost;

  return Math.max(baseCost + vehicleDelta + hotelDelta, 0);
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
        startDestination: day.startDestination ?? (day.dayNumber === 1 ? booking.departureCity : undefined),
        endDestination: day.endDestination ?? day.overnightLocation,
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

export async function buildPreviewItinerary(
  ctx: ReaderCtx,
  request: TripRequestArgs
) {
  const durationDays = calculateDurationDays(request.startDate, request.endDate);
  const totalPersons = request.adults + request.children;
  const matchedPackage = request.packageId
    ? ((await ctx.db.get(request.packageId as Id<"packages">)) as PackageRecord | null)
    : await resolveMatchingPackage(ctx, {
        destination: request.destination,
        departureCity: request.departureCity,
        durationDays,
        travelClass: request.travelClass,
        totalPersons
      });

  if (!matchedPackage || !matchedPackage.isActive) {
    return null;
  }

  const itineraryDays = (await ctx.db.query("itineraryDays").collect())
    .filter((day: any) => day.packageId === matchedPackage._id)
    .sort((a, b) => a.dayNumber - b.dayNumber) as ItineraryDayRecord[];
  const completedDays = ensureCompleteItineraryDays(
    matchedPackage,
    {
      _id: "preview-booking" as Id<"bookings">,
      packageId: matchedPackage._id,
      startDate: request.startDate,
      endDate: request.endDate,
      adults: request.adults,
      children: request.children,
      roomType: request.roomType,
      hotelOverrides: []
    },
    itineraryDays
  );

  const itineraryHotels = await ctx.db.query("itineraryHotels").collect();
  const hotelOptions = await ctx.db.query("hotels").collect();
  const { availableVehicles, selectedVehicle } = await resolveSelectedVehicle(
    ctx,
    matchedPackage,
    totalPersons,
    request.vehicleType,
    Boolean(request.packageId)
  );

  const estimatedTotal = await calculateBookingTotal(
    ctx,
    {
      _id: "preview-booking" as Id<"bookings">,
      packageId: matchedPackage._id,
      vehicleId: selectedVehicle?._id,
      adults: request.adults,
      children: request.children,
      roomType: request.roomType,
      startDate: request.startDate,
      endDate: request.endDate,
      hotelOverrides: []
    },
    matchedPackage
  );

  const days = await Promise.all(
    completedDays.map(async (day) => {
      const assignment = day._id
        ? itineraryHotels.find((item: any) => item.itineraryDayId === day._id)
        : null;
      const hotel = assignment?.hotelId ? await ctx.db.get(assignment.hotelId) : null;

      return {
        _id: day._id ?? `preview-day-${day.dayNumber}`,
        dayNumber: day.dayNumber,
        date: buildDateForDay(request.startDate, day.dayNumber),
        title: day.title,
        description: day.description,
        startDestination: day.startDestination ?? (day.dayNumber === 1 ? request.departureCity : undefined),
        endDestination: day.endDestination ?? day.overnightLocation,
        overnightLocation: day.overnightLocation,
        placesCovered: day.placesCovered,
        hotelAssignmentId: assignment?._id,
        hotel,
        roomType: assignment?.roomType ?? request.roomType,
        roomQuantity: assignment?.quantity ?? 1,
        isGenerated: !day._id
      };
    })
  );

  return {
    _id: "preview",
    status: "pending" as const,
    isPreview: true,
    customerName: request.customerName,
    customerEmail: request.customerEmail,
    customerPhone: request.customerPhone,
    specialRequests: request.specialRequests,
    adults: request.adults,
    children: request.children,
    roomType: request.roomType,
    travelClass: matchedPackage.travelClass,
    departureCity: matchedPackage.departureCity,
    startDate: request.startDate,
    endDate: request.endDate,
    totalPrice: estimatedTotal,
    images: [],
    package: matchedPackage,
    vehicle: selectedVehicle,
    vehicleOptions: availableVehicles,
    hotelOptions,
    days
  };
}
