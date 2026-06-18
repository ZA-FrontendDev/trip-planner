export type SitePackage = {
  _id: string;
  title: string;
  slug: string;
  destination: string;
  departureCity: string;
  durationDays: number;
  basePrice: number;
  maxPersons: number;
  travelClass: "economy" | "business";
  coverImage: string;
  isActive: boolean;
  defaultVehicleId?: string;
};

export type SiteHotel = {
  _id: string;
  name: string;
  location: string;
  stars: number;
  pricePerNight: number;
  isVerified: boolean;
  images: string[];
  amenities: string[];
  roomTypes: {
    type: string;
    pricePerNight: number;
    capacity: number;
  }[];
};

export type SiteVehicle = {
  _id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerDay: number;
  images: string[];
  features: string[];
  isAvailable: boolean;
};

export type ItineraryDayView = {
  _id: string;
  dayNumber: number;
  date: string;
  title: string;
  description: string;
  startDestination?: string | null;
  endDestination?: string | null;
  overnightLocation: string;
  placesCovered: {
    name: string;
    image: string;
  }[];
  hotelAssignmentId?: string;
  hotel: SiteHotel | null;
  roomType: string | null;
  roomQuantity: number;
  isGenerated?: boolean;
};

export type BookingItineraryView = {
  _id: string;
  status: "pending" | "confirmed" | "cancelled";
  isPreview?: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
  adults: number;
  children: number;
  roomType: string;
  travelClass: string;
  departureCity: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  images?: string[];
  package: SitePackage;
  vehicle: SiteVehicle | null;
  vehicleOptions: SiteVehicle[];
  hotelOptions: SiteHotel[];
  days: ItineraryDayView[];
};

export type DashboardData = {
  totalBookings: number;
  totalRevenue: number;
  activePackages: number;
  recentBookings: {
    _id: string;
    customerName: string;
    destination: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    images?: string[];
  }[];
};
