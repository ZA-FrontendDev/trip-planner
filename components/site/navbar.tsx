"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/90 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-350 items-center justify-between px-[5%]">
        <Link
          href="/"
          className="display-font text-[22px] font-bold tracking-[-0.5px] text-primary"
        >
          Pak<span className="text-amber-500">Trips</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          <NavLink href="/" active={pathname === "/"}>
            Home
          </NavLink>
          <NavLink href="/about" active={pathname === "/about"}>
            About
          </NavLink>
          <NavLink href="/contact" active={pathname === "/contact"}>
            Contact
          </NavLink>
        </nav>

        <Link
          href="/design-trip"
          className="display-font rounded-lg bg-primary px-5.5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#085041]"
        >
          Design My Trip →
        </Link>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition ${
        active ? "text-primary" : "text-slate-500 hover:text-primary"
      }`}
    >
      {children}
    </Link>
  );
}
