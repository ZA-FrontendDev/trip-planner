import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getForPackage = query({
  args: {
    packageId: v.id("packages")
  },
  handler: async (ctx, args) => {
    const days = (await ctx.db.query("itineraryDays").collect()).filter(
      (day: any) => day.packageId === args.packageId
    );
    const hotels = await ctx.db.query("hotels").collect();
    const assignments = await ctx.db.query("itineraryHotels").collect();
    return days
      .sort((a, b) => a.dayNumber - b.dayNumber)
      .map((day: any) => ({
        ...day,
        assignment: assignments.find((assignment: any) => assignment.itineraryDayId === day._id) ?? null,
        hotelChoices: hotels.filter(
          (hotel: any) =>
            hotel.location.toLowerCase() === day.overnightLocation.toLowerCase() ||
            hotel.location.toLowerCase() === day.title.toLowerCase()
        )
      }));
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

    const savedDayId =
      dayId ??
      (await ctx.db.insert("itineraryDays", {
        ...dayFields
      }));

    if (dayId) {
      await ctx.db.patch(dayId, dayFields);
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
