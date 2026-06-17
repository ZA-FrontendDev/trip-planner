"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { BootstrapData } from "@/components/shared/bootstrap-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format-price";

export function AdminDashboardClient() {
  const dashboard = useQuery(api.admin.getDashboardData);
  const resetData = useMutation(api.seed.resetData);

  return (
    <div className="space-y-6">
      <BootstrapData compact />
      <section className="rounded-4xl border border-border/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(13,124,110,0.92))] px-6 py-8 text-white shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <Badge className="bg-white/12 text-white hover:bg-white/12">
              Admin dashboard
            </Badge>
            <h1 className="display-font mt-4 text-4xl font-semibold tracking-tight">
              Route operations, booking intake, and inventory status in one
              place.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
              Convex-backed analytics and quick actions tied directly to
              packages, itinerary days, vehicles, hotels, and booking status
              updates.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/admin/packages/new">Create package</Link>
            </Button>
            <Button
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white"
              onClick={async () => {
                await resetData({ confirm: true });
                window.location.reload();
              }}
            >
              Reset demo data
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Total bookings"
          value={dashboard ? String(dashboard.totalBookings) : "..."}
        />
        <MetricCard
          label="Revenue tracked"
          value={dashboard ? formatPrice(dashboard.totalRevenue) : "..."}
        />
        <MetricCard
          label="Active packages"
          value={dashboard ? String(dashboard.activePackages) : "..."}
        />
      </div>

      <Card className="border-border/70 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="display-font text-xl">
              Recent bookings
            </CardTitle>
            <CardDescription>
              Latest customer requests and current statuses.
            </CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/bookings">Open bookings</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Traveler</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboard?.recentBookings?.map((booking: any) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>{booking.destination}</TableCell>
                  <TableCell>
                    {booking.startDate} - {booking.endDate}
                  </TableCell>
                  <TableCell className="capitalize">{booking.status}</TableCell>
                  <TableCell className="text-right">
                    {formatPrice(booking.totalPrice)}
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

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-border/70 bg-white shadow-sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="display-font text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
