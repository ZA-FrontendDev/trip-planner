import { ItineraryBuilder } from "@/components/admin/itinerary-builder";

export default async function PackageItineraryPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ItineraryBuilder packageId={id} />;
}
