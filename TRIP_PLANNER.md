# 🏔️ Pakistan Trip Planner — Project Documentation

> A full-stack, AI-assisted trip planning platform for northern Pakistan travel packages, built with Next.js and Convex.

---

## 📌 Project Overview

**Project Name:** Pakistan Trip Planner  
**Tech Stack:** Next.js 14 (App Router) + Convex (Backend/DB) + Tailwind CSS  
**Target Users:** Travelers booking curated trips to northern Pakistan  
**Admin Panel:** Separate dashboard for admins to create/manage packages, hotels, cars, and itineraries  

---

## 🗂️ Pages Structure

### 1. `/` — Home Page
- Hero section with full-bleed banner (mountains/northern Pakistan imagery)
- Featured trip packages (cards with images, duration, price, highlights)
- "Why Choose Us" section
- Testimonials
- CTA → "Design My Trip" button

### 2. `/about` — About Page
- Company story / mission
- Team section
- Stats (trips planned, happy customers, destinations covered)
- Photo gallery of destinations

### 3. `/contact` — Contact Us Page
- Contact form (name, email, phone, message)
- WhatsApp / phone CTA
- Office address with map embed
- Social media links

### 4. `/design-trip` — Design My Trip (Main Feature Page)
- Multi-step trip configuration form
- Real-time itinerary preview (like the screenshot)
- Hotel/room/car change options
- Final booking summary with total price

---

## 🎯 Core Feature: Design My Trip

### User Input Form Fields

| Field | Type | Description |
|---|---|---|
| Full Name | Text Input | Traveler's full name |
| Email | Email Input | Contact email |
| Phone | Phone Input | WhatsApp/mobile number |
| Departure City | Dropdown | Islamabad, Lahore, Karachi, etc. |
| Destination | Dropdown | Astore, Naran, Skardu, Hunza, etc. |
| Start Date | Date Picker | Trip start date |
| End Date / Duration | Date Picker / Select | Auto-calculate days |
| Number of Adults | Number Input | 1–20 |
| Number of Children | Number Input | 0–10 |
| Room Type | Dropdown | Standard, Deluxe, Suite |
| Travel Class | Dropdown | Economy, Business |
| Vehicle Type | Dropdown | Honda BRV, Hiace, Coaster, Land Cruiser |
| Special Requests | Textarea | Dietary, accessibility, etc. |

### Itinerary Display (After Form Submission)

When admin has configured a package matching the user's selection, the system renders:

- **Trip Header:** Title, dates, duration, persons, vehicle, class, total price
- **Day-by-Day Itinerary:**
  - Date + Day number
  - Route description (departure, stopovers, arrival)
  - **Places Covered** → image cards (Kaghan, Naran, etc.)
  - Overnight location pin
  - **Hotel Card:** Name, star rating, verified badge, price/night, room type
    - "Change Hotel" button
    - "Change Rooms" button
  - **Vehicle Card:** Car image, model, capacity
    - "Change Car" button

---

## 🏗️ Database Schema (Convex)

### Tables

#### `packages`
```ts
{
  _id: Id<"packages">,
  title: string,                    // "Astore | Minimarg | Deosai"
  slug: string,
  destination: string,
  departureCity: string,
  durationDays: number,
  basePrice: number,                // per person
  maxPersons: number,
  travelClass: "economy" | "business",
  coverImage: string,               // Convex storage ID
  isActive: boolean,
  createdAt: number,
}
```

#### `itineraryDays`
```ts
{
  _id: Id<"itineraryDays">,
  packageId: Id<"packages">,
  dayNumber: number,
  date: string,                     // ISO date
  title: string,
  description: string,              // "Departure for Naran through Hazara motorway..."
  overnightLocation: string,
  placesCoovered: Array<{
    name: string,
    image: string,                  // Convex storage ID
  }>,
}
```

#### `hotels`
```ts
{
  _id: Id<"hotels">,
  name: string,
  location: string,
  stars: number,
  pricePerNight: number,
  isVerified: boolean,
  images: string[],                 // Convex storage IDs
  amenities: string[],
  roomTypes: Array<{
    type: string,                   // "Deluxe Double", "Standard", "Suite"
    pricePerNight: number,
    capacity: number,
  }>,
}
```

#### `itineraryHotels`  *(junction — which hotel is assigned to which day)*
```ts
{
  _id: Id<"itineraryHotels">,
  itineraryDayId: Id<"itineraryDays">,
  hotelId: Id<"hotels">,
  roomType: string,
  quantity: number,
}
```

#### `vehicles`
```ts
{
  _id: Id<"vehicles">,
  name: string,                     // "Honda BRV"
  type: string,                     // "sedan", "suv", "van", "coaster"
  capacity: number,
  pricePerDay: number,
  images: string[],                 // Convex storage IDs
  features: string[],
  isAvailable: boolean,
}
```

#### `bookings`
```ts
{
  _id: Id<"bookings">,
  packageId: Id<"packages">,
  vehicleId: Id<"vehicles">,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  departureCity: string,
  startDate: string,
  endDate: string,
  adults: number,
  children: number,
  roomType: string,
  travelClass: string,
  specialRequests: string,
  totalPrice: number,
  status: "pending" | "confirmed" | "cancelled",
  createdAt: number,

  // Customizations (hotel/room/car changes)
  hotelOverrides: Array<{
    dayId: Id<"itineraryDays">,
    hotelId: Id<"hotels">,
    roomType: string,
  }>,
}
```

#### `admins`
```ts
{
  _id: Id<"admins">,
  email: string,
  name: string,
  role: "superadmin" | "editor",
}
```

---

## 🖥️ Admin Panel Pages

### `/admin` — Dashboard
- Total bookings, revenue, active packages
- Recent bookings table
- Quick-action buttons

### `/admin/packages` — Manage Packages
- List all packages
- Create / Edit / Delete packages
- Toggle active/inactive

### `/admin/packages/[id]/itinerary` — Build Itinerary
- Day-by-day builder
- Add places covered (with image upload)
- Assign hotel per day
- Set overnight location

### `/admin/hotels` — Manage Hotels
- Add/edit hotels
- Upload multiple images
- Set room types and pricing

### `/admin/vehicles` — Manage Vehicles
- Add/edit vehicles
- Upload vehicle images
- Set capacity and daily price

### `/admin/bookings` — Manage Bookings
- View all bookings
- Filter by status, date, destination
- Update booking status
- View user's customizations (hotel/room/car changes)

---

## 📁 Folder Structure

```
trip-planner/
├── app/
│   ├── (site)/
│   │   ├── page.tsx                  # Home
│   │   ├── about/page.tsx            # About
│   │   ├── contact/page.tsx          # Contact
│   │   └── design-trip/
│   │       ├── page.tsx              # Form page
│   │       └── [bookingId]/page.tsx  # Itinerary display
│   ├── admin/
│   │   ├── page.tsx                  # Dashboard
│   │   ├── packages/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── edit/page.tsx
│   │   │       └── itinerary/page.tsx
│   │   ├── hotels/page.tsx
│   │   ├── vehicles/page.tsx
│   │   └── bookings/page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── site/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── PackageCard.tsx
│   │   ├── TripForm.tsx
│   │   ├── ItineraryView.tsx
│   │   ├── DayCard.tsx
│   │   ├── HotelCard.tsx
│   │   ├── VehicleCard.tsx
│   │   └── PlaceChip.tsx
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── BookingsTable.tsx
│       ├── ItineraryBuilder.tsx
│       ├── HotelForm.tsx
│       └── VehicleForm.tsx
│
├── convex/
│   ├── schema.ts                     # All table definitions
│   ├── packages.ts                   # Package queries & mutations
│   ├── itinerary.ts                  # Itinerary queries & mutations
│   ├── hotels.ts
│   ├── vehicles.ts
│   ├── bookings.ts
│   └── _generated/
│
├── lib/
│   ├── utils.ts
│   └── formatPrice.ts
│
├── public/
│   └── images/
│
├── convex.json
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🔄 User Flow

```
Home Page
    ↓
"Design My Trip" CTA
    ↓
/design-trip → Fill Form (name, dates, destination, persons, room, vehicle)
    ↓
Form Submit → Convex: createBooking mutation (status: "pending")
    ↓
Booking ID returned → redirect to /design-trip/[bookingId]
    ↓
Itinerary displayed (admin-configured package matched to user's selection)
    ↓
User can: Change Hotel | Change Room | Change Vehicle
    ↓
All changes saved via Convex mutations (hotelOverrides array updated)
    ↓
"Book Now" → Final confirmation + payment (future scope)
```

---

## 🔐 Admin Flow

```
Admin logs in (/admin)
    ↓
Creates Package (title, destination, price, duration)
    ↓
Builds day-by-day itinerary
    → Adds places covered per day (with images)
    → Assigns hotel + room type per day
    → Sets overnight location
    ↓
Assigns default vehicle to package
    ↓
Package goes live (isActive: true)
    ↓
User bookings appear in /admin/bookings
    → Admin can view which hotel/car user changed to
    → Admin can update booking status
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Color | `#0D7C6E` (Teal — mountains/nature) |
| Accent Color | `#F59E0B` (Amber — warmth/adventure) |
| Background | `#F8FAFC` |
| Dark Surface | `#0F172A` |
| Font Display | `Sora` or `Clash Display` |
| Font Body | `Plus Jakarta Sans` |
| Border Radius | `12px` (cards), `8px` (inputs) |
| Shadow | Soft, layered `box-shadow` |

---

## 📦 Key NPM Packages

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "convex": "latest",
    "tailwindcss": "3.x",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-select": "latest",
    "@radix-ui/react-tabs": "latest",
    "react-datepicker": "latest",
    "react-hook-form": "latest",
    "zod": "latest",
    "lucide-react": "latest",
    "framer-motion": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  }
}
```

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-org/trip-planner.git
cd trip-planner

# 2. Install dependencies
npm install

# 3. Setup Convex
npx convex dev

# 4. Add environment variables
cp .env.example .env.local
# Fill in: NEXT_PUBLIC_CONVEX_URL

# 5. Run development server
npm run dev
```

---

## 🔮 Future Scope

- [ ] Online payment integration (Stripe / JazzCash / EasyPaisa)
- [ ] WhatsApp booking confirmation via Twilio
- [ ] AI-powered trip recommendation engine
- [ ] Multi-language support (Urdu / English)
- [ ] Mobile app (React Native + Convex)
- [ ] Real-time availability calendar for hotels
- [ ] Customer reviews and ratings per destination

---

*Built with ❤️ for Pakistan's breathtaking northern landscapes.*
