import { PackageEditor } from "@/components/admin/package-editor";

export default async function EditPackagePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PackageEditor packageId={id} />;
}
