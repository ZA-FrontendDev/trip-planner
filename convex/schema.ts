import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  packages: defineTable({
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
    createdAt: v.number(),
    defaultVehicleId: v.optional(v.id("vehicles"))
  })
    .index("by_slug", ["slug"])
    .index("by_destination_departure", ["destination", "departureCity"]),

  itineraryDays: defineTable({
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
    )
  }).index("by_package_day", ["packageId", "dayNumber"]),

  hotels: defineTable({
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
  }).index("by_location", ["location"]),

  itineraryHotels: defineTable({
    itineraryDayId: v.id("itineraryDays"),
    hotelId: v.id("hotels"),
    roomType: v.string(),
    quantity: v.number()
  }).index("by_day", ["itineraryDayId"]),

  vehicles: defineTable({
    name: v.string(),
    type: v.string(),
    capacity: v.number(),
    pricePerDay: v.number(),
    images: v.array(v.string()),
    features: v.array(v.string()),
    isAvailable: v.boolean()
  }).index("by_availability", ["isAvailable"]),

  bookings: defineTable({
    packageId: v.id("packages"),
    vehicleId: v.optional(v.id("vehicles")),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    departureCity: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    adults: v.number(),
    children: v.number(),
    roomType: v.string(),
    travelClass: v.string(),
    specialRequests: v.string(),
    totalPrice: v.number(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("cancelled")),
    createdAt: v.number(),
    images: v.optional(v.array(v.string())),
    hotelOverrides: v.array(
      v.object({
        dayId: v.id("itineraryDays"),
        hotelId: v.id("hotels"),
        roomType: v.string()
      })
    )
  })
    .index("by_status", ["status"])
    .index("by_package", ["packageId"])
    .index("by_created", ["createdAt"]),

  admins: defineTable({
    username: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("superadmin"), v.literal("editor")),
    isActive: v.optional(v.boolean()),
    createdAt: v.optional(v.number())
  })
    .index("by_email", ["email"])
    .index("by_username", ["username"]),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    message: v.string(),
    createdAt: v.number()
  }).index("by_created", ["createdAt"])
});
