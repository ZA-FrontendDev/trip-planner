import {
  BarChart3,
  BookImage,
  Building2,
  CarFront,
  ClipboardList,
  LayoutDashboard,
  Map,
  Wallet
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: string;
};

export type AdminMetric = {
  label: string;
  value: string;
  delta: string;
  icon: typeof LayoutDashboard;
  tone: "teal" | "amber" | "slate";
};

export type RecentBooking = {
  id: string;
  traveler: string;
  route: string;
  dates: string;
  total: string;
  status: "Pending" | "Confirmed" | "Needs Review";
};

export type QuickAction = {
  title: string;
  description: string;
  href: string;
};

export const adminNavigation: { label: string; items: AdminNavItem[] }[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard
      },
      {
        title: "Packages",
        href: "/admin/packages",
        icon: Map,
        badge: "12"
      },
      {
        title: "Bookings",
        href: "/admin/bookings",
        icon: ClipboardList,
        badge: "9"
      }
    ]
  },
  {
    label: "Inventory",
    items: [
      {
        title: "Hotels",
        href: "/admin/hotels",
        icon: Building2,
        badge: "26"
      },
      {
        title: "Vehicles",
        href: "/admin/vehicles",
        icon: CarFront,
        badge: "14"
      }
    ]
  }
];

export const adminMetrics: AdminMetric[] = [
  {
    label: "Total bookings",
    value: "128",
    delta: "+18% this month",
    icon: ClipboardList,
    tone: "teal"
  },
  {
    label: "Revenue tracked",
    value: "PKR 8.4M",
    delta: "+PKR 1.1M vs May",
    icon: Wallet,
    tone: "amber"
  },
  {
    label: "Active packages",
    value: "12",
    delta: "3 awaiting publish",
    icon: BookImage,
    tone: "slate"
  },
  {
    label: "Fulfillment health",
    value: "94%",
    delta: "Vehicles and stays assigned",
    icon: BarChart3,
    tone: "teal"
  }
];

export const recentBookings: RecentBooking[] = [
  {
    id: "BK-1024",
    traveler: "Areeba Khan",
    route: "Astore | Minimarg | Deosai",
    dates: "11 Jun - 17 Jun 2026",
    total: "PKR 287,485",
    status: "Pending"
  },
  {
    id: "BK-1023",
    traveler: "Hamza Tariq",
    route: "Hunza | Khunjerab | Eagle's Nest",
    dates: "14 Jun - 20 Jun 2026",
    total: "PKR 251,900",
    status: "Confirmed"
  },
  {
    id: "BK-1022",
    traveler: "Sana Ahmed",
    route: "Skardu | Basho | Shigar",
    dates: "19 Jun - 24 Jun 2026",
    total: "PKR 198,400",
    status: "Needs Review"
  },
  {
    id: "BK-1021",
    traveler: "Usman Javed",
    route: "Naran | Kaghan | Saif ul Malook",
    dates: "21 Jun - 25 Jun 2026",
    total: "PKR 146,200",
    status: "Confirmed"
  }
];

export const quickActions: QuickAction[] = [
  {
    title: "Create a new package",
    description: "Add pricing, route coverage, and availability for a new northern circuit.",
    href: "/admin/packages/new"
  },
  {
    title: "Build itinerary days",
    description: "Attach route notes, places covered, overnight stops, and default hotels.",
    href: "/admin/packages"
  },
  {
    title: "Review pending bookings",
    description: "Check customer customizations before confirming hotels and vehicle assignments.",
    href: "/admin/bookings"
  }
];

export const adminTasks = [
  {
    title: "Publish Skardu summer package",
    detail: "2 day cards still need place images and hotel room mapping."
  },
  {
    title: "Verify 3 hotel rate changes",
    detail: "Naran Retreat, Kamran Hotel, and Hunza View Lodge updated June pricing."
  },
  {
    title: "Reassign one vehicle",
    detail: "Land Cruiser inventory dips below threshold on 19 Jun 2026."
  }
];
