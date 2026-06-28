"use client";

import { useRef, useState } from "react";
import { FileText, ImageIcon, Loader2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const IMG_RE = /\.(png|jpe?g|svg|webp|gif|avif)$/i;

function readImageSize(file: File): Promise<{ w: number; h: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

/**
 * Small inline file uploader for nested editors — calls onChange with the public URL.
 * `recommendedSize` shows the target dimensions; uploads that are too heavy or too
 * large in pixels are rejected so admins don't drop oversized images into small slots.
 */
export function InlineUpload({
  value,
  onChange,
  folder = "uploads",
  label,
  accept = "image/*",
  recommendedSize,
  hint,
  maxBytes = 3 * 1024 * 1024,
  maxDimension = 3000,
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  accept?: string;
  /** Target size shown to the admin, e.g. "480 × 271 px". */
  recommendedSize?: string;
  /** Extra guidance line (what this image is / where it appears). */
  hint?: string;
  /** Max file weight in bytes (default 3 MB). */
  maxBytes?: number;
  /** Max width/height in px (default 3000). */
  maxDimension?: number;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  async function onPick(file: File) {
    setErr(null);

    if (file.size > maxBytes) {
      setErr(`File is ${(file.size / 1048576).toFixed(1)} MB — keep it under ${Math.round(maxBytes / 1048576)} MB.`);
      return;
    }
    const isRasterImage = file.type.startsWith("image/") && file.type !== "image/svg+xml";
    if (isRasterImage) {
      const dims = await readImageSize(file);
      if (dims && (dims.w > maxDimension || dims.h > maxDimension)) {
        setErr(`Image is ${dims.w}×${dims.h}px — too large. Keep each side ≤ ${maxDimension}px${recommendedSize ? ` (target ${recommendedSize})` : ""}.`);
        return;
      }
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
      if (error) {
        setErr(error.message);
      } else {
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        onChange(data.publicUrl);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded border bg-muted">
          {value && IMG_RE.test(value) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : value ? (
            <FileText className="size-4 text-muted-foreground" />
          ) : (
            <ImageIcon className="size-4 text-muted-foreground" />
          )}
          {busy && (
            <span className="absolute inset-0 grid place-items-center bg-black/40">
              <Loader2 className="size-4 animate-spin text-white" />
            </span>
          )}
        </span>
        <div className="flex flex-col gap-1">
          {label && <span className="text-[11px] text-muted-foreground">{label}</span>}
          <div className="flex gap-1">
            <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent disabled:opacity-50">
              <Upload className="size-3.5" /> Upload
            </button>
            <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="or URL" className="w-40 rounded-md border px-2 py-1 text-[11px]" dir="ltr" />
          </div>
        </div>
        <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) onPick(file); }} />
      </div>
      {recommendedSize && (
        <span className="text-[11px] text-muted-foreground">
          📐 Recommended size: <span className="font-medium text-foreground/80">{recommendedSize}</span>
        </span>
      )}
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      {err && <span className="text-[11px] font-medium text-destructive">{err}</span>}
    </div>
  );
}
