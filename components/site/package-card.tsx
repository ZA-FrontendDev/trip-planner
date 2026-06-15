import Link from "next/link";
import Image from "next/image";

type PackageCardProps = {
  slug: string;
  title: string;
  duration: string;
  price: string;
  summary: string;
  image: string;
};

export function PackageCard({ slug, title, duration, price, summary, image }: PackageCardProps) {
  return (
    <Link href={`/design-trip?package=${slug}`} className="group card-surface overflow-hidden">
      <div className="relative h-56">
        <Image src={image} alt={title} fill className="object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-4 text-sm text-slate-500">
          <span>{duration}</span>
          <span className="font-semibold text-primary">{price}</span>
        </div>
        <div>
          <h3 className="display-font text-2xl font-semibold text-ink">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{summary}</p>
        </div>
      </div>
    </Link>
  );
}
