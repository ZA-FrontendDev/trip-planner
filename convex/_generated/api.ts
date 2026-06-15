/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as adminAuth from "../adminAuth.js";
import type * as bookings from "../bookings.js";
import type * as contacts from "../contacts.js";
import type * as hotels from "../hotels.js";
import type * as itinerary from "../itinerary.js";
import type * as lib_trip from "../lib/trip.js";
import type * as packages from "../packages.js";
import type * as seed from "../seed.js";
import type * as site from "../site.js";
import type * as vehicles from "../vehicles.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import { anyApi, componentsGeneric } from "convex/server";

const fullApi: ApiFromModules<{
  admin: typeof admin;
  adminAuth: typeof adminAuth;
  bookings: typeof bookings;
  contacts: typeof contacts;
  hotels: typeof hotels;
  itinerary: typeof itinerary;
  "lib/trip": typeof lib_trip;
  packages: typeof packages;
  seed: typeof seed;
  site: typeof site;
  vehicles: typeof vehicles;
}> = anyApi as any;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
> = anyApi as any;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
> = anyApi as any;

export const components = componentsGeneric() as unknown as {};
