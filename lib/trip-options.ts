export const DESTINATIONS = ["Astore", "Naran", "Skardu", "Hunza", "Minimarg", "Deosai"];
export const DEPARTURE_CITIES = ["Islamabad", "Lahore", "Karachi", "Peshawar"];
export const ROOM_TYPES = ["Standard", "Deluxe", "Suite", "Deluxe Double", "Executive Tent"];
export const TRAVEL_CLASSES = ["economy", "business"] as const;
export const VEHICLE_TYPES = ["Honda BRV", "Hiace", "Coaster", "Land Cruiser"];
export const BOOKING_STATUSES = ["pending", "confirmed", "cancelled"] as const;

export type TravelClass = (typeof TRAVEL_CLASSES)[number];
export type BookingStatus = (typeof BOOKING_STATUSES)[number];
