"use client";

import { useRef, useState } from "react";
import { Film, Loader2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/** youtube / vimeo links are embedded via iframe; anything else is treated as a direct file. */
export const EMBED_RE = /(youtube\.com|youtu\.be|vimeo\.com)/i;

/**
 * Controlled video picker for the gallery admin. Upload a video file straight from
 * the computer (stored in the public `media` bucket) OR paste a YouTube/Vimeo/direct
 * link. Reports the resulting URL via `onChange`; the parent owns the value + submits it.
 */
export function VideoUpload({
  value,
  onChange,
  folder = "gallery/videos",
  maxBytes = 50 * 1024 * 1024,
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  /** Max file weight in bytes (default 50 MB — Supabase standard upload limit). */
  maxBytes?: number;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const isEmbed = Boolean(value) && EMBED_RE.test(value);

  async function onPick(file: File) {
    setErr(null);
    if (file.size > maxBytes) {
      setErr(`File is ${(file.size / 1048576).toFixed(0)} MB — keep it under ${Math.round(maxBytes / 1048576)} MB.`);
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "mp4";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("media")
        .upload(path, file, { upsert: false, contentType: file.type || undefined });
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
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <div className="relative grid h-20 w-32 shrink-0 place-items-center overflow-hidden rounded-lg border bg-muted">
          {value && !isEmbed ? (
            <video src={value} className="size-full object-cover" muted preload="metadata" />
          ) : value && isEmbed ? (
            <Film className="size-6 text-muted-foreground" />
          ) : (
            <span className="text-[11px] text-muted-foreground">No video</span>
          )}
          {busy && (
            <span className="absolute inset-0 grid place-items-center bg-black/40">
              <Loader2 className="size-5 animate-spin text-white" />
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => ref.current?.click()}
            disabled={busy}
            className="inline-flex w-fit items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
          >
            <Upload className="size-4" /> Upload video
          </button>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="or paste a YouTube / Vimeo / video URL"
            dir="ltr"
            className="w-72 rounded-md border px-2 py-1 text-xs"
          />
          {err && <span className="text-xs text-destructive">{err}</span>}
        </div>
      </div>

      <input
        ref={ref}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
        }}
      />
    </div>
  );
}
