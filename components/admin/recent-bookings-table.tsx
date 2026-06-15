import { recentBookings } from "@/lib/admin-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const statusVariant: Record<(typeof recentBookings)[number]["status"], "outline" | "secondary" | "default"> = {
  Pending: "outline",
  Confirmed: "default",
  "Needs Review": "secondary"
};

export function RecentBookingsTable() {
  return (
    <Card className="border-border/70 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="display-font text-xl">Recent bookings</CardTitle>
          <CardDescription>Latest customer requests and admin-review states.</CardDescription>
        </div>
        <Button variant="outline">View all bookings</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Traveler</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>{booking.traveler}</TableCell>
                <TableCell>{booking.route}</TableCell>
                <TableCell>{booking.dates}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[booking.status]}>{booking.status}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{booking.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
