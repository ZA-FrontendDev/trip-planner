import { v } from "convex/values";

import { mutation } from "./_generated/server";

const vehicleDefinitions = [
  {
    name: "Honda BRV",
    type: "suv",
    capacity: 5,
    pricePerDay: 14500,
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    ],
    features: ["AC", "Family seating", "Mountain-ready suspension"],
    isAvailable: true,
  },
  {
    name: "Hiace",
    type: "van",
    capacity: 10,
    pricePerDay: 22000,
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80",
    ],
    features: ["Group transfer", "Luggage space", "Comfort seats"],
    isAvailable: true,
  },
  {
    name: "Coaster",
    type: "bus",
    capacity: 18,
    pricePerDay: 28500,
    images: [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    ],
    features: ["Tour coach", "Overhead storage", "Wide cabin"],
    isAvailable: true,
  },
  {
    name: "Land Cruiser",
    type: "suv",
    capacity: 6,
    pricePerDay: 32000,
    images: [
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80",
    ],
    features: ["Premium cabin", "4x4 drive", "Remote terrain support"],
    isAvailable: true,
  },
] as const;

const hotelDefinitions = [
  {
    name: "Naran Retreat",
    location: "Naran",
    stars: 5,
    pricePerNight: 9200,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    ],
    amenities: ["Breakfast", "Parking", "Mountain view"],
    roomTypes: [
      { type: "Standard", pricePerNight: 8200, capacity: 2 },
      { type: "Deluxe", pricePerNight: 9200, capacity: 3 },
      { type: "Deluxe Double", pricePerNight: 10800, capacity: 4 },
    ],
  },
  {
    name: "Kamran Hotel",
    location: "Astore",
    stars: 4,
    pricePerNight: 5600,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
    ],
    amenities: ["Restaurant", "Hot water", "Valley view"],
    roomTypes: [
      { type: "Standard", pricePerNight: 5600, capacity: 2 },
      { type: "Deluxe", pricePerNight: 7600, capacity: 3 },
      { type: "Deluxe Double", pricePerNight: 9100, capacity: 4 },
    ],
  },
  {
    name: "Minimarg Scenic Camp",
    location: "Minimarg",
    stars: 4,
    pricePerNight: 11800,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    ],
    amenities: ["Bonfire zone", "Private guide", "Heated camp"],
    roomTypes: [
      { type: "Standard", pricePerNight: 11800, capacity: 2 },
      { type: "Deluxe", pricePerNight: 13800, capacity: 3 },
      { type: "Deluxe Double", pricePerNight: 15600, capacity: 4 },
    ],
  },
  {
    name: "Deosai Eco Lodge",
    location: "Deosai",
    stars: 4,
    pricePerNight: 12500,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    ],
    amenities: ["Park access", "Hot meals", "Sunrise deck"],
    roomTypes: [
      { type: "Standard", pricePerNight: 12500, capacity: 2 },
      { type: "Deluxe", pricePerNight: 14600, capacity: 3 },
      { type: "Deluxe Double", pricePerNight: 16500, capacity: 4 },
    ],
  },
  {
    name: "Hunza Panorama Resort",
    location: "Hunza",
    stars: 5,
    pricePerNight: 11000,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
    ],
    amenities: ["Fort view", "Breakfast", "Terrace lounge"],
    roomTypes: [
      { type: "Standard", pricePerNight: 11000, capacity: 2 },
      { type: "Deluxe", pricePerNight: 13200, capacity: 3 },
      { type: "Deluxe Double", pricePerNight: 14900, capacity: 4 },
    ],
  },
  {
    name: "Skardu Serene Residence",
    location: "Skardu",
    stars: 5,
    pricePerNight: 11400,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80",
    ],
    amenities: ["Airport transfer", "Garden deck", "Buffet breakfast"],
    roomTypes: [
      { type: "Standard", pricePerNight: 11400, capacity: 2 },
      { type: "Deluxe", pricePerNight: 13700, capacity: 3 },
      { type: "Deluxe Double", pricePerNight: 15200, capacity: 4 },
    ],
  },
  {
    name: "Shigar Signature Lodge",
    location: "Shigar",
    stars: 5,
    pricePerNight: 12600,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80",
    ],
    amenities: ["Riverfront lawn", "Tea lounge", "Heritage interiors"],
    roomTypes: [
      { type: "Standard", pricePerNight: 12600, capacity: 2 },
      { type: "Deluxe", pricePerNight: 14900, capacity: 3 },
      { type: "Deluxe Double", pricePerNight: 16800, capacity: 4 },
    ],
  },
  {
    name: "Khaplu Mountain Palace",
    location: "Khaplu",
    stars: 5,
    pricePerNight: 13200,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    ],
    amenities: ["Palace-style stay", "Guided walks", "Premium dining"],
    roomTypes: [
      { type: "Standard", pricePerNight: 13200, capacity: 2 },
      { type: "Deluxe", pricePerNight: 15400, capacity: 3 },
      { type: "Deluxe Double", pricePerNight: 17300, capacity: 4 },
    ],
  },
  {
    name: "Islamabad Transit Suites",
    location: "Islamabad",
    stars: 4,
    pricePerNight: 7800,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=900&q=80",
    ],
    amenities: ["Airport route", "Late check-in", "Breakfast"],
    roomTypes: [
      { type: "Standard", pricePerNight: 7800, capacity: 2 },
      { type: "Deluxe", pricePerNight: 9300, capacity: 3 },
      { type: "Deluxe Double", pricePerNight: 10800, capacity: 4 },
    ],
  },
  {
    name: "Lahore Garden Stay",
    location: "Lahore",
    stars: 4,
    pricePerNight: 7600,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=900&q=80",
    ],
    amenities: ["City access", "Breakfast", "Secure parking"],
    roomTypes: [
      { type: "Standard", pricePerNight: 7600, capacity: 2 },
      { type: "Deluxe", pricePerNight: 9100, capacity: 3 },
      { type: "Deluxe Double", pricePerNight: 10500, capacity: 4 },
    ],
  },
  {
    name: "Karachi Harbor Hotel",
    location: "Karachi",
    stars: 4,
    pricePerNight: 8300,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80",
    ],
    amenities: ["Airport transfer", "24/7 reception", "Business lounge"],
    roomTypes: [
      { type: "Standard", pricePerNight: 8300, capacity: 2 },
      { type: "Deluxe", pricePerNight: 9800, capacity: 3 },
      { type: "Deluxe Double", pricePerNight: 11400, capacity: 4 },
    ],
  },
  {
    name: "Peshawar Heritage Inn",
    location: "Peshawar",
    stars: 4,
    pricePerNight: 7400,
    isVerified: true,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
    ],
    amenities: ["Traditional interiors", "Secure parking", "Family dining"],
    roomTypes: [
      { type: "Standard", pricePerNight: 7400, capacity: 2 },
      { type: "Deluxe", pricePerNight: 8900, capacity: 3 },
      { type: "Deluxe Double", pricePerNight: 10200, capacity: 4 },
    ],
  },
] as const;

const packageDefinitions = [
  {
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
    defaultVehicleName: "Honda BRV",
    preferredRoomType: "Deluxe Double",
    routeStops: ["Naran", "Astore", "Minimarg", "Deosai"],
    overnightPlan: ["Naran", "Astore", "Minimarg", "Deosai", "Astore", "Naran", "Islamabad"],
  },
  {
    title: "Astore | Rama Meadows | Tarishing",
    slug: "astore-rama-tarishing",
    destination: "Astore",
    departureCity: "Peshawar",
    durationDays: 5,
    basePrice: 58200,
    maxPersons: 8,
    travelClass: "economy" as const,
    coverImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    defaultVehicleName: "Honda BRV",
    preferredRoomType: "Deluxe",
    routeStops: ["Besham", "Naran", "Astore", "Rama Meadows", "Tarishing"],
    overnightPlan: ["Naran", "Astore", "Astore", "Naran", "Peshawar"],
  },
  {
    title: "Astore | Deosai | Rama Lake",
    slug: "astore-deosai-rama-lake",
    destination: "Astore",
    departureCity: "Lahore",
    durationDays: 6,
    basePrice: 84400,
    maxPersons: 10,
    travelClass: "business" as const,
    coverImage:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    defaultVehicleName: "Land Cruiser",
    preferredRoomType: "Deluxe Double",
    routeStops: ["Islamabad", "Naran", "Astore", "Deosai", "Rama Lake"],
    overnightPlan: ["Islamabad", "Naran", "Astore", "Deosai", "Astore", "Lahore"],
  },
  {
    title: "Hunza | Attabad | Passu",
    slug: "hunza-attabad-passu",
    destination: "Hunza",
    departureCity: "Islamabad",
    durationDays: 6,
    basePrice: 63200,
    maxPersons: 12,
    travelClass: "economy" as const,
    coverImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    defaultVehicleName: "Hiace",
    preferredRoomType: "Deluxe",
    routeStops: ["Naran", "Hunza", "Attabad", "Passu"],
    overnightPlan: ["Naran", "Hunza", "Hunza", "Hunza", "Naran", "Islamabad"],
  },
  {
    title: "Hunza | Eagle's Nest | Khunjerab",
    slug: "hunza-eagles-nest-khunjerab",
    destination: "Hunza",
    departureCity: "Karachi",
    durationDays: 8,
    basePrice: 96800,
    maxPersons: 16,
    travelClass: "business" as const,
    coverImage:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80",
    defaultVehicleName: "Coaster",
    preferredRoomType: "Deluxe Double",
    routeStops: ["Islamabad", "Naran", "Hunza", "Eagle's Nest", "Khunjerab"],
    overnightPlan: ["Islamabad", "Naran", "Hunza", "Hunza", "Hunza", "Hunza", "Islamabad", "Karachi"],
  },
  {
    title: "Hunza | Hopper | Nagar",
    slug: "hunza-hopper-nagar",
    destination: "Hunza",
    departureCity: "Lahore",
    durationDays: 7,
    basePrice: 69800,
    maxPersons: 10,
    travelClass: "economy" as const,
    coverImage:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    defaultVehicleName: "Hiace",
    preferredRoomType: "Standard",
    routeStops: ["Islamabad", "Naran", "Hunza", "Hopper Glacier", "Nagar"],
    overnightPlan: ["Islamabad", "Naran", "Hunza", "Hunza", "Hunza", "Islamabad", "Lahore"],
  },
  {
    title: "Skardu | Shangrila | Shigar",
    slug: "skardu-shangrila-shigar",
    destination: "Skardu",
    departureCity: "Islamabad",
    durationDays: 5,
    basePrice: 67400,
    maxPersons: 8,
    travelClass: "economy" as const,
    coverImage:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
    defaultVehicleName: "Honda BRV",
    preferredRoomType: "Deluxe",
    routeStops: ["Naran", "Skardu", "Shangrila", "Shigar"],
    overnightPlan: ["Naran", "Skardu", "Shigar", "Skardu", "Islamabad"],
  },
  {
    title: "Skardu | Basho | Khaplu",
    slug: "skardu-basho-khaplu",
    destination: "Skardu",
    departureCity: "Lahore",
    durationDays: 7,
    basePrice: 89200,
    maxPersons: 12,
    travelClass: "business" as const,
    coverImage:
      "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?auto=format&fit=crop&w=1200&q=80",
    defaultVehicleName: "Land Cruiser",
    preferredRoomType: "Deluxe Double",
    routeStops: ["Islamabad", "Naran", "Skardu", "Basho Valley", "Khaplu"],
    overnightPlan: ["Islamabad", "Naran", "Skardu", "Khaplu", "Skardu", "Islamabad", "Lahore"],
  },
  {
    title: "Skardu | Deosai | Satpara",
    slug: "skardu-deosai-satpara",
    destination: "Skardu",
    departureCity: "Karachi",
    durationDays: 9,
    basePrice: 112500,
    maxPersons: 16,
    travelClass: "business" as const,
    coverImage:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    defaultVehicleName: "Coaster",
    preferredRoomType: "Deluxe Double",
    routeStops: ["Islamabad", "Naran", "Skardu", "Deosai", "Satpara Lake"],
    overnightPlan: ["Islamabad", "Naran", "Skardu", "Deosai", "Skardu", "Skardu", "Naran", "Islamabad", "Karachi"],
  },
  {
    title: "Naran | Saif ul Malook | Babusar",
    slug: "naran-saif-ul-malook-babusar",
    destination: "Naran",
    departureCity: "Lahore",
    durationDays: 4,
    basePrice: 41800,
    maxPersons: 8,
    travelClass: "economy" as const,
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    defaultVehicleName: "Honda BRV",
    preferredRoomType: "Standard",
    routeStops: ["Islamabad", "Naran", "Saif ul Malook", "Babusar"],
    overnightPlan: ["Islamabad", "Naran", "Naran", "Lahore"],
  },
  {
    title: "Naran | Kaghan | Lulusar",
    slug: "naran-kaghan-lulusar",
    destination: "Naran",
    departureCity: "Peshawar",
    durationDays: 5,
    basePrice: 53600,
    maxPersons: 10,
    travelClass: "business" as const,
    coverImage:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
    defaultVehicleName: "Hiace",
    preferredRoomType: "Deluxe",
    routeStops: ["Islamabad", "Naran", "Kaghan", "Lulusar"],
    overnightPlan: ["Islamabad", "Naran", "Naran", "Islamabad", "Peshawar"],
  },
  {
    title: "Minimarg | Domel | Rainbow Lake",
    slug: "minimarg-domel-rainbow-lake",
    destination: "Minimarg",
    departureCity: "Islamabad",
    durationDays: 6,
    basePrice: 75800,
    maxPersons: 8,
    travelClass: "economy" as const,
    coverImage:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    defaultVehicleName: "Land Cruiser",
    preferredRoomType: "Deluxe",
    routeStops: ["Naran", "Astore", "Minimarg", "Domel", "Rainbow Lake"],
    overnightPlan: ["Naran", "Astore", "Minimarg", "Minimarg", "Astore", "Islamabad"],
  },
  {
    title: "Minimarg | Burzil | Meadow Camp",
    slug: "minimarg-burzil-meadow-camp",
    destination: "Minimarg",
    departureCity: "Karachi",
    durationDays: 7,
    basePrice: 99800,
    maxPersons: 12,
    travelClass: "business" as const,
    coverImage:
      "https://images.unsplash.com/photo-1455218873509-8097305ee378?auto=format&fit=crop&w=1200&q=80",
    defaultVehicleName: "Coaster",
    preferredRoomType: "Deluxe Double",
    routeStops: ["Islamabad", "Naran", "Astore", "Minimarg", "Burzil"],
    overnightPlan: ["Islamabad", "Naran", "Astore", "Minimarg", "Minimarg", "Islamabad", "Karachi"],
  },
  {
    title: "Deosai | Sheosar | Bara Pani",
    slug: "deosai-sheosar-bara-pani",
    destination: "Deosai",
    departureCity: "Islamabad",
    durationDays: 5,
    basePrice: 64600,
    maxPersons: 8,
    travelClass: "economy" as const,
    coverImage:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    defaultVehicleName: "Land Cruiser",
    preferredRoomType: "Deluxe",
    routeStops: ["Naran", "Astore", "Deosai", "Sheosar", "Bara Pani"],
    overnightPlan: ["Naran", "Astore", "Deosai", "Astore", "Islamabad"],
  },
  {
    title: "Deosai | Chillam | Sheosar",
    slug: "deosai-chillam-sheosar",
    destination: "Deosai",
    departureCity: "Lahore",
    durationDays: 6,
    basePrice: 83600,
    maxPersons: 10,
    travelClass: "business" as const,
    coverImage:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
    defaultVehicleName: "Land Cruiser",
    preferredRoomType: "Deluxe Double",
    routeStops: ["Islamabad", "Naran", "Astore", "Deosai", "Sheosar Lake"],
    overnightPlan: ["Islamabad", "Naran", "Astore", "Deosai", "Astore", "Lahore"],
  },
] as const;

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function buildDate(dayNumber: number) {
  const baseDate = new Date("2026-07-01T00:00:00.000Z");
  baseDate.setUTCDate(baseDate.getUTCDate() + dayNumber - 1);
  return baseDate.toISOString().slice(0, 10);
}

function uniqueStops(stops: readonly string[]) {
  return Array.from(new Set(stops.filter(Boolean)));
}

function createPlacesCovered(
  coverImage: string,
  previousStop: string,
  overnightLocation: string,
  routeStop: string,
) {
  return uniqueStops([previousStop, routeStop, overnightLocation]).map((name) => ({
    name,
    image: coverImage,
  }));
}

function createDayTitle(
  departureCity: string,
  durationDays: number,
  dayNumber: number,
  previousStop: string,
  overnightLocation: string,
) {
  if (dayNumber === durationDays) {
    return `${previousStop} to ${departureCity}`;
  }

  if (dayNumber === 1) {
    return `${departureCity} to ${overnightLocation}`;
  }

  if (previousStop === overnightLocation) {
    return `${overnightLocation} exploration day`;
  }

  return `${previousStop} to ${overnightLocation}`;
}

function createDayDescription(
  routeStops: readonly string[],
  durationDays: number,
  dayNumber: number,
  overnightLocation: string,
  previousStop: string,
  departureCity: string,
) {
  if (dayNumber === durationDays) {
    return `Return transfer from ${previousStop} to ${departureCity} with scheduled rest stops, meal breaks, and trip closeout on arrival.`;
  }

  if (previousStop === overnightLocation) {
    const scenicPoint = routeStops[(dayNumber - 1) % routeStops.length] ?? overnightLocation;
    return `A relaxed exploration day around ${overnightLocation} with guided sightseeing, scenic pauses near ${scenicPoint}, and flexible free time for the group.`;
  }

  const scenicPoint = routeStops[dayNumber % routeStops.length] ?? overnightLocation;
  return `Road journey from ${previousStop} to ${overnightLocation} with curated stops around ${scenicPoint}, photography breaks, and managed check-in on arrival.`;
}

function createItineraryDays(definition: (typeof packageDefinitions)[number]) {
  return Array.from({ length: definition.durationDays }, (_, index) => {
    const dayNumber = index + 1;
    const previousStop =
      dayNumber === 1
        ? definition.departureCity
        : definition.overnightPlan[dayNumber - 2] ?? definition.destination;
    const overnightLocation =
      definition.overnightPlan[index] ??
      (dayNumber === definition.durationDays ? definition.departureCity : definition.destination);
    const routeStop =
      definition.routeStops[Math.min(index, definition.routeStops.length - 1)] ?? definition.destination;

    return {
      dayNumber,
      date: buildDate(dayNumber),
      title: createDayTitle(
        definition.departureCity,
        definition.durationDays,
        dayNumber,
        previousStop,
        overnightLocation,
      ),
      description: createDayDescription(
        definition.routeStops,
        definition.durationDays,
        dayNumber,
        overnightLocation,
        previousStop,
        definition.departureCity,
      ),
      overnightLocation,
      placesCovered: createPlacesCovered(
        definition.coverImage,
        previousStop,
        overnightLocation,
        routeStop,
      ),
    };
  });
}

function createVehicleRecord(definition: (typeof vehicleDefinitions)[number]) {
  return {
    name: definition.name,
    type: definition.type,
    capacity: definition.capacity,
    pricePerDay: definition.pricePerDay,
    images: [...definition.images],
    features: [...definition.features],
    isAvailable: definition.isAvailable,
  };
}

function createHotelRecord(definition: (typeof hotelDefinitions)[number]) {
  return {
    name: definition.name,
    location: definition.location,
    stars: definition.stars,
    pricePerNight: definition.pricePerNight,
    isVerified: definition.isVerified,
    images: [...definition.images],
    amenities: [...definition.amenities],
    roomTypes: definition.roomTypes.map((roomType) => ({
      type: roomType.type,
      pricePerNight: roomType.pricePerNight,
      capacity: roomType.capacity,
    })),
  };
}

export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const existingVehicles = await ctx.db.query("vehicles").collect();
    const existingHotels = await ctx.db.query("hotels").collect();
    const existingPackages = await ctx.db.query("packages").collect();
    const existingDays = await ctx.db.query("itineraryDays").collect();
    const existingAssignments = await ctx.db.query("itineraryHotels").collect();
    const existingAdmins = await ctx.db.query("admins").collect();

    const vehicleIdByName = new Map<string, any>();
    for (const definition of vehicleDefinitions) {
      const vehicleRecord = createVehicleRecord(definition);
      const existing = existingVehicles.find((item: any) => item.name === definition.name);
      if (existing) {
        await ctx.db.patch(existing._id, vehicleRecord);
        vehicleIdByName.set(definition.name, existing._id);
      } else {
        const vehicleId = await ctx.db.insert("vehicles", vehicleRecord);
        vehicleIdByName.set(definition.name, vehicleId);
      }
    }

    const hotelIdByLocation = new Map<string, any>();
    for (const definition of hotelDefinitions) {
      const hotelRecord = createHotelRecord(definition);
      const existing = existingHotels.find((item: any) => item.name === definition.name);
      if (existing) {
        await ctx.db.patch(existing._id, hotelRecord);
        if (!hotelIdByLocation.has(normalizeKey(definition.location))) {
          hotelIdByLocation.set(normalizeKey(definition.location), existing._id);
        }
      } else {
        const hotelId = await ctx.db.insert("hotels", hotelRecord);
        if (!hotelIdByLocation.has(normalizeKey(definition.location))) {
          hotelIdByLocation.set(normalizeKey(definition.location), hotelId);
        }
      }
    }

    for (const definition of packageDefinitions) {
      const existing = existingPackages.find((item: any) => item.slug === definition.slug);
      const packageRecord = {
        title: definition.title,
        slug: definition.slug,
        destination: definition.destination,
        departureCity: definition.departureCity,
        durationDays: definition.durationDays,
        basePrice: definition.basePrice,
        maxPersons: definition.maxPersons,
        travelClass: definition.travelClass,
        coverImage: definition.coverImage,
        isActive: true,
        createdAt: existing?.createdAt ?? Date.now(),
        defaultVehicleId: vehicleIdByName.get(definition.defaultVehicleName),
      };

      const packageId = existing
        ? (await ctx.db.patch(existing._id, packageRecord), existing._id)
        : await ctx.db.insert("packages", packageRecord);

      const generatedDays = createItineraryDays(definition);
      for (const day of generatedDays) {
        const existingDay = existingDays.find(
          (item: any) => item.packageId === packageId && item.dayNumber === day.dayNumber,
        );
        const itineraryDayId = existingDay
          ? (await ctx.db.patch(existingDay._id, {
              packageId,
              dayNumber: day.dayNumber,
              date: day.date,
              title: day.title,
              description: day.description,
              overnightLocation: day.overnightLocation,
              placesCovered: day.placesCovered,
            }),
            existingDay._id)
          : await ctx.db.insert("itineraryDays", {
              packageId,
              dayNumber: day.dayNumber,
              date: day.date,
              title: day.title,
              description: day.description,
              overnightLocation: day.overnightLocation,
              placesCovered: day.placesCovered,
            });

        const hotelId =
          hotelIdByLocation.get(normalizeKey(day.overnightLocation)) ??
          hotelIdByLocation.get(normalizeKey(definition.destination)) ??
          hotelIdByLocation.get(normalizeKey("Islamabad"));
        const hotelDefinition = hotelDefinitions.find(
          (item) => normalizeKey(item.location) === normalizeKey(day.overnightLocation),
        );
        const roomType =
          hotelDefinition?.roomTypes.find((item) => item.type === definition.preferredRoomType)?.type ??
          hotelDefinition?.roomTypes[0]?.type ??
          "Standard";
        const quantity = definition.maxPersons > 10 ? 2 : 1;
        const existingAssignment = existingAssignments.find(
          (item: any) => item.itineraryDayId === itineraryDayId,
        );

        if (hotelId) {
          if (existingAssignment) {
            await ctx.db.patch(existingAssignment._id, {
              itineraryDayId,
              hotelId,
              roomType,
              quantity,
            });
          } else {
            await ctx.db.insert("itineraryHotels", {
              itineraryDayId,
              hotelId,
              roomType,
              quantity,
            });
          }
        }
      }
    }

    const adminDefinition = {
      username: "admin",
      passwordHash:
        "a9df5480488bcd2ab0041eb1d0bbb88354ecd44a674e6b4ccfd6f8816f3befcf",
      email: "admin@tripplanner.pk",
      name: "Zain Admin",
      role: "superadmin" as const,
      isActive: true,
      createdAt: Date.now(),
    };
    const existingAdmin = existingAdmins.find(
      (item: any) =>
        item.username === adminDefinition.username || item.email === adminDefinition.email,
    );

    if (existingAdmin) {
      await ctx.db.patch(existingAdmin._id, {
        ...adminDefinition,
        createdAt: existingAdmin.createdAt ?? adminDefinition.createdAt,
      });
    } else {
      await ctx.db.insert("admins", adminDefinition);
    }

    const finalPackages = await ctx.db.query("packages").collect();
    return {
      seeded: true,
      packageCount: finalPackages.length,
    };
  },
});

export const resetData = mutation({
  args: {
    confirm: v.boolean(),
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
      "contactMessages",
    ] as const) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }

    return { cleared: true };
  },
});
