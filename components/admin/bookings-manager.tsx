"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { formatPrice } from "@/lib/format-price";
import { BOOKING_STATUSES } from "@/lib/trip-options";
import { AdminField } from "@/components/admin/admin-field";
import { AdminImageUploader } from "@/components/admin/admin-image-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function BookingsManager() {
  const [status, setStatus] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const bookings = useQuery(api.bookings.listAdmin, {
    status: status || undefined,
    destination: destination || undefined
  });
  const updateStatus = useMutation(api.bookings.updateStatus);
  const updateAssets = useMutation(api.bookings.updateAssets);

  const selectedBooking = useMemo(
    () => bookings?.find((booking: any) => booking._id === selectedBookingId) ?? null,
    [bookings, selectedBookingId]
  );

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="display-font text-2xl">Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 md:grid-cols-3">
            <AdminField label="Booking status filter" hint="Filter the bookings list by current booking status.">
              <select className="select-base" value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="">All statuses</option>
                {BOOKING_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </AdminField>

            <AdminField label="Destination filter" hint="Filter bookings by destination or package location.">
              <input className="input-base" placeholder="e.g. Hunza" value={destination} onChange={(event) => setDestination(event.target.value)} />
            </AdminField>

            <AdminField label="Booking image target" hint="Choose a booking record before uploading booking-related images.">
              <select className="select-base" value={selectedBookingId} onChange={(event) => setSelectedBookingId(event.target.value)}>
                <option value="">Select a booking</option>
                {bookings?.map((booking: any) => (
                  <option key={booking._id} value={booking._id}>
                    {booking.customerName} | {booking.packageTitle}
                  </option>
                ))}
              </select>
            </AdminField>
          </div>

          <div className="mt-5">
            <AdminImageUploader
              label="Booking-related images"
              hint="Upload booking-specific reference images. These are stored and can be shown in both admin and frontend booking views."
              category="booking"
              images={selectedBooking?.images ?? []}
              onChange={async (images) => {
                if (!selectedBookingId) {
                  return;
                }
                await updateAssets({
                  bookingId: selectedBookingId as never,
                  images
                });
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-white shadow-sm">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Traveler</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Media</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings?.map((booking: any) => (
                <TableRow key={booking._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-xs text-muted-foreground">{booking.customerEmail}</p>
                      <p className="text-xs text-muted-foreground">{booking.customerPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{booking.packageTitle}</p>
                      <p className="text-xs text-muted-foreground">{booking.destination}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.startDate} - {booking.endDate}
                  </TableCell>
                  <TableCell>
                    {booking.images?.[0] ? (
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-20 overflow-hidden rounded-xl border border-slate-200">
                          <Image src={booking.images[0]} alt={`${booking.customerName} booking media`} fill className="object-cover" unoptimized />
                        </div>
                        <span className="text-xs text-slate-500">{booking.images.length} image(s)</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">No media uploaded</span>
                    )}
                  </TableCell>
                  <TableCell className="capitalize">{booking.status}</TableCell>
                  <TableCell className="text-right">{formatPrice(booking.totalPrice)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {BOOKING_STATUSES.map((item) => (
                        <Button
                          key={item}
                          size="sm"
                          variant={booking.status === item ? "default" : "outline"}
                          onClick={async () => updateStatus({ bookingId: booking._id as never, status: item })}
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
