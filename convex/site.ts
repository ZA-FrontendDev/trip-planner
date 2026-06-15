import { query } from "./_generated/server";

export const getBootstrapStatus = query({
  args: {},
  handler: async (ctx) => {
    const packages = await ctx.db.query("packages").take(1);
    return {
      hasData: packages.length > 0
    };
  }
});

export const getHomeData = query({
  args: {},
  handler: async (ctx) => {
    const packages = await ctx.db.query("packages").collect();
    const bookings = await ctx.db.query("bookings").collect();

    const featuredPackages = packages
      .filter((item: any) => item.isActive)
      .slice(0, 3)
      .map((item: any) => ({
        ...item,
        summary: `${item.durationDays} days from ${item.departureCity} to ${item.destination}.`,
        priceLabel: `From PKR ${item.basePrice.toLocaleString("en-PK")}`
      }));

    return {
      featuredPackages,
      stats: {
        tripsPlanned: bookings.length,
        activePackages: packages.filter((item: any) => item.isActive).length,
        destinationsCovered: new Set(packages.map((item: any) => item.destination)).size
      }
    };
  }
});
