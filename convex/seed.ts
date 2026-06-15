import { mutation } from "./_generated/server";
import { v } from "convex/values";

const packageSeed = {
  title: "Astore | Minimarg | Deosai",
  slug: "astore-minimarg-deosai",
  destination: "Astore",
  departureCity: "Islamabad",
  durationDays: 7,
  basePrice: 71500,
  maxPersons: 12,
  travelClass: "economy" as const,
  coverImage:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  isActive: true
};

export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("packages").take(1);
    if (existing.length > 0) {
      return { seeded: false };
    }

    const vehicleId = await ctx.db.insert("vehicles", {
      name: "Honda BRV",
      type: "suv",
      capacity: 5,
      pricePerDay: 14500,
      images: [
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
      ],
      features: ["AC", "Family seating", "Mountain-ready suspension"],
      isAvailable: true
    });

    await ctx.db.insert("vehicles", {
      name: "Hiace",
      type: "van",
      capacity: 10,
      pricePerDay: 22000,
      images: [
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
      ],
      features: ["Group transfer", "Luggage space", "Comfort seats"],
      isAvailable: true
    });

    await ctx.db.insert("vehicles", {
      name: "Land Cruiser",
      type: "suv",
      capacity: 6,
      pricePerDay: 32000,
      images: [
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80"
      ],
      features: ["Premium cabin", "4x4 drive", "Remote terrain support"],
      isAvailable: true
    });

    const naranRetreatId = await ctx.db.insert("hotels", {
      name: "Naran Retreat",
      location: "Naran",
      stars: 5,
      pricePerNight: 9200,
      isVerified: true,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
      ],
      amenities: ["Breakfast", "Parking", "Mountain view"],
      roomTypes: [
        { type: "Deluxe Double", pricePerNight: 9200, capacity: 2 },
        { type: "Suite", pricePerNight: 13200, capacity: 4 }
      ]
    });

    const kamranHotelId = await ctx.db.insert("hotels", {
      name: "Kamran Hotel",
      location: "Astore",
      stars: 4,
      pricePerNight: 5000,
      isVerified: true,
      images: [
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80"
      ],
      amenities: ["Restaurant", "Hot water", "Valley view"],
      roomTypes: [
        { type: "Standard Room", pricePerNight: 5000, capacity: 2 },
        { type: "Deluxe", pricePerNight: 7600, capacity: 3 }
      ]
    });

    const scenicCampId = await ctx.db.insert("hotels", {
      name: "Minimarg Scenic Camp",
      location: "Minimarg",
      stars: 4,
      pricePerNight: 12800,
      isVerified: true,
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
      ],
      amenities: ["Bonfire zone", "Private guide", "Heated tents"],
      roomTypes: [
        { type: "Executive Tent", pricePerNight: 12800, capacity: 2 },
        { type: "Family Tent", pricePerNight: 16400, capacity: 4 }
      ]
    });

    const packageId = await ctx.db.insert("packages", {
      ...packageSeed,
      defaultVehicleId: vehicleId,
      createdAt: Date.now()
    });

    const day1Id = await ctx.db.insert("itineraryDays", {
      packageId,
      dayNumber: 1,
      date: "2026-06-11",
      title: "Islamabad to Naran",
      description:
        "Departure for Naran through Hazara motorway. Stopovers at Kiwai waterfall and Kaghan valley. Arrival at Naran.",
      overnightLocation: "Naran",
      placesCovered: [
        {
          name: "Kaghan",
          image:
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Naran",
          image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Hazara Motorway",
          image:
            "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Kiwai Waterfall",
          image:
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80"
        }
      ]
    });

    const day2Id = await ctx.db.insert("itineraryDays", {
      packageId,
      dayNumber: 2,
      date: "2026-06-12",
      title: "Naran to Astore",
      description:
        "Departure for Astore. Stopovers at Jhalkad, Besal, Lulusar lake. Arrival at Astore.",
      overnightLocation: "Astore",
      placesCovered: [
        {
          name: "Jhalkad",
          image:
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Besal",
          image:
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Lulusar",
          image:
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Astore",
          image:
            "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80"
        }
      ]
    });

    const day3Id = await ctx.db.insert("itineraryDays", {
      packageId,
      dayNumber: 3,
      date: "2026-06-13",
      title: "Minimarg excursion",
      description:
        "Leisure day in Minimarg with a sunrise transfer, valley walk, and private photo stops before returning to camp.",
      overnightLocation: "Minimarg",
      placesCovered: [
        {
          name: "Rainbow Lake",
          image:
            "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Minimarg Meadows",
          image:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80"
        }
      ]
    });

    const day4Id = await ctx.db.insert("itineraryDays", {
      packageId,
      dayNumber: 4,
      date: "2026-06-14",
      title: "Astore to Deosai plains",
      description:
        "Drive into Deosai National Park for a full high-altitude day with scenic pauses, wildlife lookouts, and lakeside time.",
      overnightLocation: "Deosai",
      placesCovered: [
        {
          name: "Deosai Plains",
          image:
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Sheosar Lake",
          image:
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80"
        }
      ]
    });

    const day5Id = await ctx.db.insert("itineraryDays", {
      packageId,
      dayNumber: 5,
      date: "2026-06-15",
      title: "Deosai exploration day",
      description:
        "Sunrise viewpoints, photography stops, and a relaxed day across the plateau before descending toward Astore in the evening.",
      overnightLocation: "Astore",
      placesCovered: [
        {
          name: "Bara Pani",
          image:
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Kala Pani",
          image:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80"
        }
      ]
    });

    const day6Id = await ctx.db.insert("itineraryDays", {
      packageId,
      dayNumber: 6,
      date: "2026-06-16",
      title: "Astore to Naran",
      description:
        "Return drive toward Naran with valley breaks, tea stops, and a final mountain evening before the city transfer.",
      overnightLocation: "Naran",
      placesCovered: [
        {
          name: "Lulusar Lake",
          image:
            "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Kaghan Valley",
          image:
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
        }
      ]
    });

    const day7Id = await ctx.db.insert("itineraryDays", {
      packageId,
      dayNumber: 7,
      date: "2026-06-17",
      title: "Naran to Islamabad",
      description:
        "Breakfast and departure for Islamabad with comfort stops on the way and trip closeout on arrival.",
      overnightLocation: "Islamabad",
      placesCovered: [
        {
          name: "Balakot",
          image:
            "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Islamabad",
          image:
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80"
        }
      ]
    });

    await ctx.db.insert("itineraryHotels", {
      itineraryDayId: day1Id,
      hotelId: naranRetreatId,
      roomType: "Deluxe Double",
      quantity: 1
    });

    await ctx.db.insert("itineraryHotels", {
      itineraryDayId: day2Id,
      hotelId: kamranHotelId,
      roomType: "Standard Room",
      quantity: 1
    });

    await ctx.db.insert("itineraryHotels", {
      itineraryDayId: day3Id,
      hotelId: scenicCampId,
      roomType: "Executive Tent",
      quantity: 2
    });

    await ctx.db.insert("itineraryHotels", {
      itineraryDayId: day4Id,
      hotelId: scenicCampId,
      roomType: "Executive Tent",
      quantity: 2
    });

    await ctx.db.insert("itineraryHotels", {
      itineraryDayId: day5Id,
      hotelId: kamranHotelId,
      roomType: "Standard Room",
      quantity: 1
    });

    await ctx.db.insert("itineraryHotels", {
      itineraryDayId: day6Id,
      hotelId: naranRetreatId,
      roomType: "Deluxe Double",
      quantity: 1
    });

    await ctx.db.insert("itineraryHotels", {
      itineraryDayId: day7Id,
      hotelId: naranRetreatId,
      roomType: "Deluxe Double",
      quantity: 1
    });

    await ctx.db.insert("admins", {
      username: "admin",
      passwordHash: "a9df5480488bcd2ab0041eb1d0bbb88354ecd44a674e6b4ccfd6f8816f3befcf",
      email: "admin@tripplanner.pk",
      name: "Zain Admin",
      role: "superadmin",
      isActive: true,
      createdAt: Date.now()
    });

    return { seeded: true, packageId };
  }
});

export const resetData = mutation({
  args: {
    confirm: v.boolean()
  },
  handler: async (ctx, args) => {
    if (!args.confirm) {
      return { cleared: false };
    }

    for (const table of [
      "bookings",
      "itineraryHotels",
      "itineraryDays",
      "packages",
      "hotels",
      "vehicles",
      "admins",
      "contactMessages"
    ] as const) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }

    return { cleared: true };
  }
});
