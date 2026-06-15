import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("vehicles").collect();
  }
});

export const save = mutation({
  args: {
    vehicleId: v.optional(v.id("vehicles")),
    name: v.string(),
    type: v.string(),
    capacity: v.number(),
    pricePerDay: v.number(),
    images: v.array(v.string()),
    features: v.array(v.string()),
    isAvailable: v.boolean()
  },
  handler: async (ctx, { vehicleId, ...fields }) => {
    if (vehicleId) {
      await ctx.db.patch(vehicleId, fields);
      return vehicleId;
    }
    return await ctx.db.insert("vehicles", fields);
  }
});
