import { mutation } from "./_generated/server";
import { v } from "convex/values";

const DEFAULT_ADMIN = {
  username: "admin",
  passwordHash: "a9df5480488bcd2ab0041eb1d0bbb88354ecd44a674e6b4ccfd6f8816f3befcf",
  email: "admin@tripplanner.pk",
  name: "Zain Admin",
  role: "superadmin" as const,
  isActive: true
};

async function ensureDefaultAdmin(ctx: any) {
  const existingAdmin = (await ctx.db.query("admins").collect()).find(
    (admin: any) => admin.username === DEFAULT_ADMIN.username
  );

  if (existingAdmin) {
    return existingAdmin;
  }

  const adminId = await ctx.db.insert("admins", {
    ...DEFAULT_ADMIN,
    createdAt: Date.now()
  });

  return await ctx.db.get(adminId);
}

export const login = mutation({
  args: {
    username: v.string(),
    passwordHash: v.string()
  },
  handler: async (ctx, args) => {
    await ensureDefaultAdmin(ctx);

    const admins = await ctx.db.query("admins").collect();
    const admin = admins.find(
      (item: any) =>
        item.username === args.username &&
        item.passwordHash === args.passwordHash &&
        item.isActive
    );

    if (!admin) {
      return null;
    }

    return {
      _id: admin._id,
      username: admin.username,
      name: admin.name,
      role: admin.role
    };
  }
});
