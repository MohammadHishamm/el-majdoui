import { Mail, MailOpen, Phone, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { deleteMessage, setMessageRead } from "./actions";

type Row = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default async function MessagesPage() {
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, phone, message, is_read, created_at")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">{t.messages.heading}</h1>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {t.common.loadError}
        </p>
      )}

      <div className="grid gap-3">
        {rows.length === 0 ? (
          <p className="rounded-xl border p-6 text-center text-muted-foreground">{t.common.noItems}</p>
        ) : (
          rows.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl border p-4 ${m.is_read ? "" : "border-primary/30 bg-primary/5"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{m.name}</span>
                    {!m.is_read && (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                        {t.messages.unread}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground" dir="ltr">
                    <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-foreground">
                      <Mail className="size-3.5" /> {m.email}
                    </a>
                    {m.phone && (
                      <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 hover:text-foreground">
                        <Phone className="size-3.5" /> {m.phone}
                      </a>
                    )}
                    <span>{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <form action={setMessageRead.bind(null, m.id, !m.is_read)}>
                    <button className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent">
                      {m.is_read ? <Mail className="size-3.5" /> : <MailOpen className="size-3.5" />}
                      {m.is_read ? t.messages.markUnread : t.messages.markRead}
                    </button>
                  </form>
                  <form action={deleteMessage.bind(null, m.id)}>
                    <button className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/5">
                      <Trash2 className="size-3.5" /> {t.common.delete}
                    </button>
                  </form>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90" dir="auto">{m.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
