"use client";

import { useRef, useState } from "react";
import { FileText, ImageIcon, Loader2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const IMG_RE = /\.(png|jpe?g|svg|webp|gif|avif)$/i;

/** Small inline file uploader for nested editors — calls onChange with the public URL. */
export function InlineUpload({
  value,
  onChange,
  folder = "uploads",
  label,
  accept = "image/*",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  accept?: string;
}) {
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function onPick(file: File) {
    setBusy(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
      if (!error) {
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        onChange(data.publicUrl);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
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
  );
}
