import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("packages").collect();
  }
});

export const listFeatured = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("packages").collect();
  }
});

export const getById = query({
  args: {
    packageId: v.id("packages")
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.packageId);
  }
});

export const getBySlug = query({
  args: {
    slug: v.string()
  },
  handler: async (ctx, args) => {
    const matches = (await ctx.db.query("packages").collect()).filter(
      (item: any) => item.slug === args.slug
    );
    return matches[0] ?? null;
  }
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    destination: v.string(),
    departureCity: v.string(),
    durationDays: v.number(),
    basePrice: v.number(),
    maxPersons: v.number(),
    travelClass: v.union(v.literal("economy"), v.literal("business")),
    coverImage: v.string(),
    isActive: v.boolean(),
    defaultVehicleId: v.optional(v.id("vehicles"))
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("packages", {
      ...args,
      createdAt: Date.now()
    });
  }
});

export const update = mutation({
  args: {
    packageId: v.id("packages"),
    title: v.string(),
    slug: v.string(),
    destination: v.string(),
    departureCity: v.string(),
    durationDays: v.number(),
    basePrice: v.number(),
    maxPersons: v.number(),
    travelClass: v.union(v.literal("economy"), v.literal("business")),
    coverImage: v.string(),
    isActive: v.boolean(),
    defaultVehicleId: v.optional(v.id("vehicles"))
  },
  handler: async (ctx, { packageId, ...patch }) => {
    await ctx.db.patch(packageId, patch);
    return packageId;
  }
});

export const toggleActive = mutation({
  args: {
    packageId: v.id("packages"),
    isActive: v.boolean()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.packageId, { isActive: args.isActive });
    return args.packageId;
  }
});

export const remove = mutation({
  args: {
    packageId: v.id("packages")
  },
  handler: async (ctx, args) => {
    const days = (await ctx.db.query("itineraryDays").collect()).filter(
      (day: any) => day.packageId === args.packageId
    );
    for (const day of days) {
      const dayHotels = (await ctx.db.query("itineraryHotels").collect()).filter(
        (assignment: any) => assignment.itineraryDayId === day._id
      );
      for (const assignment of dayHotels) {
        await ctx.db.delete(assignment._id);
      }
      await ctx.db.delete(day._id);
    }
    await ctx.db.delete(args.packageId);
    return args.packageId;
  }
});
