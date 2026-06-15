import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("hotels").collect();
  }
});

export const getById = query({
  args: {
    hotelId: v.id("hotels")
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.hotelId);
  }
});

export const save = mutation({
  args: {
    hotelId: v.optional(v.id("hotels")),
    name: v.string(),
    location: v.string(),
    stars: v.number(),
    pricePerNight: v.number(),
    isVerified: v.boolean(),
    images: v.array(v.string()),
    amenities: v.array(v.string()),
    roomTypes: v.array(
      v.object({
        type: v.string(),
        pricePerNight: v.number(),
        capacity: v.number()
      })
    )
  },
  handler: async (ctx, { hotelId, ...fields }) => {
    if (hotelId) {
      await ctx.db.patch(hotelId, fields);
      return hotelId;
    }
    return await ctx.db.insert("hotels", fields);
  }
});
