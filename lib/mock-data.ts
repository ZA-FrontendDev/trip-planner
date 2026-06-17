export type TripStop = {
  name: string;
  image: string;
};

export type HotelStay = {
  name: string;
  verified: boolean;
  stars: number;
  roomLabel: string;
  pricePerNight: number;
};

export type DayPlan = {
  dayNumber: number;
  date: string;
  route: string;
  overnightLocation: string;
  placesCovered: TripStop[];
  hotel: HotelStay;
};

export type TripBooking = {
  id: string;
  title: string;
  departureCity: string;
  dateRange: string;
  durationLabel: string;
  travelersLabel: string;
  travelClass: string;
  vehicle: string;
  totalPrice: number;
  days: DayPlan[];
};

export const featuredPackages = [
  {
    slug: "astore-minimarg-deosai",
    title: "Astore | Minimarg | Deosai",
    duration: "7 Days",
    price: "From PKR 71,500",
    summary: "Highland drives, alpine valleys, and curated stays across northern Pakistan.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "hunza-khunjrab-eagle-nest",
    title: "Hunza | Khunjerab | Eagle's Nest",
    duration: "6 Days",
    price: "From PKR 63,200",
    summary: "A tighter northern circuit with glacier viewpoints and premium lodging options.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
  }
];

export const sampleBooking: TripBooking = {
  id: "astore-minimarg-001",
  title: "Astore | Minimarg | Deosai",
  departureCity: "Islamabad",
  dateRange: "11/06 - 17/06",
  durationLabel: "7 Days",
  travelersLabel: "4 Adults",
  travelClass: "Economy",
  vehicle: "Honda BRV",
  totalPrice: 287485,
  days: [
    {
      dayNumber: 1,
      date: "Thu, 11 Jun 2026",
      route:
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
      ],
      hotel: {
        name: "Naran Retreat",
        verified: true,
        stars: 5,
        roomLabel: "Deluxe Double x 1",
        pricePerNight: 9200
      }
    },
    {
      dayNumber: 2,
      date: "Fri, 12 Jun 2026",
      route:
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
      ],
      hotel: {
        name: "Kamran Hotel",
        verified: true,
        stars: 4,
        roomLabel: "Standard Room x 1",
        pricePerNight: 5000
      }
    },
    {
      dayNumber: 3,
      date: "Sat, 13 Jun 2026",
      route:
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
      ],
      hotel: {
        name: "Minimarg Scenic Camp",
        verified: true,
        stars: 4,
        roomLabel: "Deluxe Double x 2",
        pricePerNight: 12800
      }
    }
  ]
};
