import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

import {
  buildBookingItinerary,
  buildPreviewItinerary,
  calculateBookingTotal,
  calculateDurationDays,
  ensureStoredPackageItinerary,
  getAvailabilityHints as getTripAvailabilityHints,
  resolveMatchingPackage,
  resolveSelectedVehicle
} from "./lib/trip";

export const create = mutation({
  args: {
    packageId: v.optional(v.id("packages")),
    vehicleId: v.optional(v.id("vehicles")),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    departureCity: v.string(),
    destination: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    adults: v.number(),
    children: v.number(),
    roomType: v.string(),
    travelClass: v.string(),
    vehicleType: v.string(),
    specialRequests: v.string(),
    hotelOverrides: v.optional(
      v.array(
        v.object({
          dayId: v.id("itineraryDays"),
          hotelId: v.id("hotels"),
          roomType: v.string()
        })
      )
    )
  },
  handler: async (ctx, args) => {
    const durationDays = calculateDurationDays(args.startDate, args.endDate);
    const totalPersons = args.adults + args.children;
    const matchedPackage = args.packageId
      ? await ctx.db.get(args.packageId)
      : await resolveMatchingPackage(ctx, {
          destination: args.destination,
          departureCity: args.departureCity,
          durationDays,
          travelClass: args.travelClass,
          totalPersons
        });

    if (!matchedPackage || !matchedPackage.isActive) {
      throw new Error("No active package matches the selected trip criteria yet.");
    }

    await ensureStoredPackageItinerary(ctx, matchedPackage, args.startDate);

    const { selectedVehicle } = await resolveSelectedVehicle(
      ctx,
      matchedPackage,
      totalPersons,
      args.vehicleType
    );
    const finalVehicleId = args.vehicleId ?? selectedVehicle?._id;
    const initialOverrides = args.hotelOverrides ?? [];

    const bookingId = await ctx.db.insert("bookings", {
      packageId: matchedPackage._id,
      vehicleId: finalVehicleId,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      departureCity: args.departureCity,
      startDate: args.startDate,
      endDate: args.endDate,
      adults: args.adults,
      children: args.children,
      roomType: args.roomType,
      travelClass: args.travelClass,
      specialRequests: args.specialRequests,
      totalPrice: 0,
      status: "pending",
      createdAt: Date.now(),
      images: [],
      hotelOverrides: initialOverrides
    });

    const booking = await ctx.db.get(bookingId);
    const totalPrice = booking ? await calculateBookingTotal(ctx, booking, matchedPackage) : 0;
    await ctx.db.patch(bookingId, {
      totalPrice
    });

    return bookingId;
  }
});

export const previewItinerary = query({
  args: {
    packageId: v.optional(v.id("packages")),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    departureCity: v.string(),
    destination: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    adults: v.number(),
    children: v.number(),
    roomType: v.string(),
    travelClass: v.string(),
    vehicleType: v.string(),
    specialRequests: v.string()
  },
  handler: async (ctx, args) => {
    return await buildPreviewItinerary(ctx, args);
  }
});

export const getAvailabilityHints = query({
  args: {
    destination: v.string(),
    departureCity: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    adults: v.number(),
    children: v.number(),
    travelClass: v.string()
  },
  handler: async (ctx, args) => {
    return await getTripAvailabilityHints(ctx, {
      destination: args.destination,
      departureCity: args.departureCity,
      durationDays: calculateDurationDays(args.startDate, args.endDate),
      travelClass: args.travelClass,
      totalPersons: args.adults + args.children
    });
  }
});

export const getItinerary = query({
  args: {
    bookingId: v.id("bookings")
  },
  handler: async (ctx, args) => {
    return await buildBookingItinerary(ctx, args.bookingId);
  }
});

export const listAdmin = query({
  args: {
    status: v.optional(v.string()),
    destination: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const bookings = await ctx.db.query("bookings").collect();
    const packages = await ctx.db.query("packages").collect();

    return bookings
      .map((booking: any) => {
        const pkg = packages.find((item: any) => item._id === booking.packageId);
        return {
          ...booking,
          destination: pkg?.destination ?? "",
          packageTitle: pkg?.title ?? ""
        };
      })
      .filter((booking: any) => (args.status ? booking.status === args.status : true))
      .filter((booking: any) =>
        args.destination ? booking.destination.toLowerCase().includes(args.destination.toLowerCase()) : true
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  }
});

export const updateStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("cancelled"))
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookingId, {
      status: args.status
    });
    return args.bookingId;
  }
});

export const updateAssets = mutation({
  args: {
    bookingId: v.id("bookings"),
    images: v.array(v.string())
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookingId, {
      images: args.images
    });
    return args.bookingId;
  }
});

export const changeHotel = mutation({
  args: {
    bookingId: v.id("bookings"),
    dayId: v.id("itineraryDays"),
    hotelId: v.id("hotels"),
    roomType: v.string()
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Booking not found.");
    }

    const overrides = [...booking.hotelOverrides];
    const existingIndex = overrides.findIndex((item: any) => item.dayId === args.dayId);
    const nextOverride = {
      dayId: args.dayId,
      hotelId: args.hotelId,
      roomType: args.roomType
    };

    if (existingIndex >= 0) {
      overrides[existingIndex] = nextOverride;
    } else {
      overrides.push(nextOverride);
    }

    const nextBooking = {
      ...booking,
      hotelOverrides: overrides
    };
    const totalPrice = await calculateBookingTotal(ctx, nextBooking);
    await ctx.db.patch(args.bookingId, {
      hotelOverrides: overrides,
      totalPrice
    });
    return args.bookingId;
  }
});

export const changeRoom = mutation({
  args: {
    bookingId: v.id("bookings"),
    dayId: v.id("itineraryDays"),
    roomType: v.string()
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Booking not found.");
    }

    const itineraryAssignment = (await ctx.db.query("itineraryHotels").collect()).find(
      (assignment: any) => assignment.itineraryDayId === args.dayId
    );

    if (!itineraryAssignment) {
      throw new Error("No itinerary hotel assignment exists for this day.");
    }

    const overrides = [...booking.hotelOverrides];
    const existingIndex = overrides.findIndex((item: any) => item.dayId === args.dayId);
    const nextOverride = {
      dayId: args.dayId,
      hotelId: overrides[existingIndex]?.hotelId ?? itineraryAssignment.hotelId,
      roomType: args.roomType
    };

    if (existingIndex >= 0) {
      overrides[existingIndex] = nextOverride;
    } else {
      overrides.push(nextOverride);
    }

    const nextBooking = {
      ...booking,
      hotelOverrides: overrides
    };
    const totalPrice = await calculateBookingTotal(ctx, nextBooking);
    await ctx.db.patch(args.bookingId, {
      hotelOverrides: overrides,
      totalPrice
    });
    return args.bookingId;
  }
});

export const changeVehicle = mutation({
  args: {
    bookingId: v.id("bookings"),
    vehicleId: v.id("vehicles")
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Booking not found.");
    }

    const nextBooking = {
      ...booking,
      vehicleId: args.vehicleId
    };
    const totalPrice = await calculateBookingTotal(ctx, nextBooking);
    await ctx.db.patch(args.bookingId, {
      vehicleId: args.vehicleId,
      totalPrice
    });
    return args.bookingId;
  }
});
