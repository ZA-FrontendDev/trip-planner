"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

type UploadCategory = "hotel" | "vehicle" | "booking" | "package" | "place";

export function AdminImageUploader({
  label,
  hint,
  category,
  images,
  onChange
}: {
  label: string;
  hint?: string;
  category: UploadCategory;
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const finalizeUpload = useMutation(api.files.finalizeUpload);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const categoryLabel = category.replace(/^\w/, (character) => character.toUpperCase());

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {hint ? <p className="text-xs leading-5 text-slate-500">{hint}</p> : null}
      </div>

      <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50/90 p-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={async (event) => {
            const selectedFiles = Array.from(event.target.files ?? []);
            if (selectedFiles.length === 0) {
              return;
            }

            setIsUploading(true);
            setError(null);

            try {
              const uploadedUrls: string[] = [];

              for (const file of selectedFiles) {
                const postUrl = await generateUploadUrl({});
                const response = await fetch(postUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": file.type || "application/octet-stream",
                  },
                  body: file,
                });

                const result = (await response.json()) as {
                  storageId?: string;
                  error?: string;
                };

                if (!response.ok || !result.storageId) {
                  throw new Error(result.error ?? "Upload failed.");
                }

                const fileUrl = await finalizeUpload({
                  storageId: result.storageId as never,
                });
                uploadedUrls.push(fileUrl);
              }

              onChange([...images, ...uploadedUrls]);
            } catch (uploadError) {
              setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
            } finally {
              setIsUploading(false);
              if (inputRef.current) {
                inputRef.current.value = "";
              }
            }
          }}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-white shadow-sm">
              {isUploading ? <LoaderCircle className="size-4 animate-spin text-primary" /> : <ImagePlus className="size-4 text-primary" />}
            </div>
            <div>
              <p className="font-medium text-slate-900">{isUploading ? "Uploading images..." : "Upload one or more images"}</p>
              <p className="text-xs text-slate-500">{categoryLabel} files are stored in Convex storage, not in the project filesystem.</p>
            </div>
          </div>
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Choose files"}
          </Button>
        </div>

        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

        {images.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {images.map((image, index) => (
              <div key={`${image}-${index}`} className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
                <div className="relative h-28 w-full">
                  <Image src={image} alt={`${label} ${index + 1}`} fill className="object-cover" unoptimized />
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-3">
                  <p className="truncate text-xs text-slate-500">{image}</p>
                  <button
                    type="button"
                    className="rounded-full p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                    onClick={() => onChange(images.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
