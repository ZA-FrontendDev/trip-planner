"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { formatPrice } from "@/lib/format-price";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function PackagesManager() {
  const packages = useQuery(api.packages.listAdmin);
  const toggleActive = useMutation(api.packages.toggleActive);
  const remove = useMutation(api.packages.remove);

  return (
    <Card className="border-border/70 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="display-font text-2xl">Manage packages</CardTitle>
          <CardDescription>Create, edit, deactivate, and connect itinerary builders.</CardDescription>
        </div>
        <Button asChild>
          <Link href="/admin/packages/new">New package</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages?.map((item: any) => (
              <TableRow key={item._id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.departureCity}</p>
                  </div>
                </TableCell>
                <TableCell>{item.destination}</TableCell>
                <TableCell>{item.durationDays} days</TableCell>
                <TableCell>{formatPrice(item.basePrice)}</TableCell>
                <TableCell>
                  <Badge variant={item.isActive ? "default" : "outline"}>{item.isActive ? "Active" : "Inactive"}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/packages/${item._id as string}/edit`}>Edit</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/packages/${item._id as string}/itinerary`}>Itinerary</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => toggleActive({ packageId: item._id as never, isActive: !item.isActive })}
                    >
                      {item.isActive ? "Disable" : "Enable"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={async () => remove({ packageId: item._id as never })}>
                      Delete
                    </Button>
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
