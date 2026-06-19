import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type AppLogoProps = {
  href?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

export function AppLogo({
  href,
  alt = "PakTrips logo",
  className,
  imageClassName,
  priority = false,
  width = 160,
  height = 44
}: AppLogoProps) {
  const logo = (
    <>
      <Image
        src="/images/logo.png"
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn("h-auto w-auto object-contain dark:hidden", imageClassName)}
      />
      <Image
        src="/images/white-logo.png"
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn("hidden h-auto w-auto object-contain dark:block", imageClassName)}
      />
    </>
  );

  if (!href) {
    return <div className={className}>{logo}</div>;
  }

  return (
    <Link href={href} className={className} aria-label="PakTrips home">
      {logo}
    </Link>
  );
}
