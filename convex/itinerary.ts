import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { resolvePlaceImage } from "./lib/place_images";

export const getForPackage = query({
  args: {
    packageId: v.id("packages")
  },
  handler: async (ctx, args) => {
    const packageRecord = await ctx.db.get(args.packageId);
    if (!packageRecord) {
      return [];
    }

    const days = (await ctx.db.query("itineraryDays").collect()).filter(
      (day: any) => day.packageId === args.packageId
    );
    const hotels = await ctx.db.query("hotels").collect();
    const assignments = await ctx.db.query("itineraryHotels").collect();

    const sortedDays = [...days].sort((a, b) => a.dayNumber - b.dayNumber);
    const dayByNumber = new Map(sortedDays.map((day: any) => [day.dayNumber, day]));
    const standardDays = Array.from({ length: packageRecord.durationDays }, (_, index) => {
      const dayNumber = index + 1;
      const storedDay = dayByNumber.get(dayNumber);
      const assignment = storedDay
        ? assignments.find((item: any) => item.itineraryDayId === storedDay._id) ?? null
        : null;

      return {
        _id: storedDay?._id ?? null,
        packageId: args.packageId,
        dayNumber,
        date: storedDay?.date ?? "",
        title: storedDay?.title ?? "",
        description: storedDay?.description ?? "",
        startDestination: storedDay?.startDestination ?? "",
        endDestination: storedDay?.endDestination ?? "",
        overnightLocation: storedDay?.overnightLocation ?? "",
        placesCovered: storedDay?.placesCovered ?? [],
        assignment: assignment
          ? {
              _id: assignment._id,
              hotelId: assignment.hotelId,
              roomType: assignment.roomType,
              quantity: assignment.quantity
            }
          : null,
        hotelChoices: hotels.filter(
          (hotel: any) =>
            hotel.location.toLowerCase() === storedDay?.overnightLocation?.toLowerCase() ||
            hotel.location.toLowerCase() === packageRecord.destination.toLowerCase()
        ),
        isExtra: false
      };
    });

    const extraDays = sortedDays
      .filter((day: any) => day.dayNumber > packageRecord.durationDays)
      .map((day: any) => {
        const assignment = assignments.find((item: any) => item.itineraryDayId === day._id) ?? null;
        return {
          ...day,
          assignment: assignment
            ? {
                _id: assignment._id,
                hotelId: assignment.hotelId,
                roomType: assignment.roomType,
                quantity: assignment.quantity
              }
            : null,
          hotelChoices: hotels.filter(
            (hotel: any) =>
              hotel.location.toLowerCase() === day.overnightLocation.toLowerCase() ||
              hotel.location.toLowerCase() === packageRecord.destination.toLowerCase()
          ),
          isExtra: true
        };
      });

    return [...standardDays, ...extraDays];
  }
});

export const saveDay = mutation({
  args: {
    dayId: v.optional(v.id("itineraryDays")),
    packageId: v.id("packages"),
    dayNumber: v.number(),
    date: v.string(),
    title: v.string(),
    description: v.string(),
    startDestination: v.string(),
    endDestination: v.string(),
    overnightLocation: v.string(),
    placesCovered: v.array(
      v.object({
        name: v.string(),
        image: v.string()
      })
    ),
    hotelId: v.optional(v.id("hotels")),
    roomType: v.optional(v.string()),
    quantity: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const {
      dayId,
      hotelId,
      roomType,
      quantity,
      ...dayFields
    } = args;
    const packageRecord = await ctx.db.get(dayFields.packageId);
    const normalizedPlaces = dayFields.placesCovered.map((place) => ({
      name: place.name,
      image: place.image || resolvePlaceImage(place.name, packageRecord?.coverImage)
    }));
    const nextDayFields = {
      ...dayFields,
      placesCovered: normalizedPlaces
    };

    const savedDayId =
      dayId ??
      (await ctx.db.insert("itineraryDays", {
        ...nextDayFields
      }));

    if (dayId) {
      await ctx.db.patch(dayId, nextDayFields);
    }

    const existingAssignment = (await ctx.db.query("itineraryHotels").collect()).find(
      (assignment: any) => assignment.itineraryDayId === savedDayId
    );

    if (hotelId && roomType) {
      if (existingAssignment) {
        await ctx.db.patch(existingAssignment._id, {
          hotelId,
          roomType,
          quantity: quantity ?? 1
        });
      } else {
        await ctx.db.insert("itineraryHotels", {
          itineraryDayId: savedDayId,
          hotelId,
          roomType,
          quantity: quantity ?? 1
        });
      }
    } else if (existingAssignment) {
      await ctx.db.delete(existingAssignment._id);
    }

    return savedDayId;
  }
});

export const removeDay = mutation({
  args: {
    dayId: v.id("itineraryDays")
  },
  handler: async (ctx, args) => {
    const assignments = (await ctx.db.query("itineraryHotels").collect()).filter(
      (assignment: any) => assignment.itineraryDayId === args.dayId
    );
    for (const assignment of assignments) {
      await ctx.db.delete(assignment._id);
    }
    await ctx.db.delete(args.dayId);
    return args.dayId;
  }
});
