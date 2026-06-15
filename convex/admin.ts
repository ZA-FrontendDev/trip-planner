import { query } from "./_generated/server";

export const getDashboardData = query({
  args: {},
  handler: async (ctx) => {
    const bookings = await ctx.db.query("bookings").collect();
    const packages = await ctx.db.query("packages").collect();

    const recentBookings = bookings
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map((booking: any) => {
        const pkg = packages.find((item: any) => item._id === booking.packageId);
        return {
          _id: booking._id,
          customerName: booking.customerName,
          destination: pkg?.destination ?? "",
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalPrice: booking.totalPrice,
          status: booking.status
        };
      });

    return {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((sum: number, booking: any) => sum + booking.totalPrice, 0),
      activePackages: packages.filter((item: any) => item.isActive).length,
      recentBookings
    };
  }
});
