import { Compass, ShieldCheck } from "lucide-react";

import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(13,124,110,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.16),transparent_20%),linear-gradient(180deg,#fbfcfd_0%,#eef4f2_100%)] px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(9,73,67,0.96),rgba(16,115,102,0.88))] p-8 text-white shadow-2xl shadow-slate-900/10 sm:p-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm">
            <Compass className="size-4" />
            Protected operations panel
          </div>
          <h1 className="display-font mt-8 max-w-xl text-4xl font-semibold leading-tight">
            Secure access for package operations, itinerary control, and booking review.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/78">
            The admin dashboard is now restricted. Sign in with the configured admin account before viewing packages, hotels, vehicles, or bookings.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "Package and itinerary management",
              "Hotel and vehicle inventory control",
              "Booking review and status handling",
              "Credential-gated admin access"
            ].map((item) => (
              <div key={item} className="rounded-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur">
                <ShieldCheck className="mb-3 size-5 text-amber-300" />
                <p className="text-sm font-medium text-white/92">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-slate-200/70 bg-white/88 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Admin Login</p>
          <h2 className="display-font mt-3 text-3xl font-semibold text-slate-900">Access dashboard</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter the admin username and password to continue.
          </p>

          <div className="mt-8">
            <AdminLoginForm initialError={params.error} />
          </div>
        </section>
      </div>
    </main>
  );
}
