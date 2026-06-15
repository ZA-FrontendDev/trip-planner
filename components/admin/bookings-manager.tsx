"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { formatPrice } from "@/lib/format-price";
import { BOOKING_STATUSES } from "@/lib/trip-options";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function BookingsManager() {
  const [status, setStatus] = useState("");
  const [destination, setDestination] = useState("");
  const bookings = useQuery(api.bookings.listAdmin, {
    status: status || undefined,
    destination: destination || undefined
  });
  const updateStatus = useMutation(api.bookings.updateStatus);

  return (
    <Card className="border-border/70 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="display-font text-2xl">Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-5 grid gap-4 md:grid-cols-3">
          <select className="input-base" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            {BOOKING_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input className="input-base" placeholder="Filter by destination" value={destination} onChange={(event) => setDestination(event.target.value)} />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Traveler</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Dates</TableHead>
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
  );
}
