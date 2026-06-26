// Client-safe role constants/types (NO server imports — safe in client components).

export type AppRole = "super_admin" | "content_editor" | "news_manager";

export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Admin",
  content_editor: "Content Editor",
  news_manager: "News Manager",
};
