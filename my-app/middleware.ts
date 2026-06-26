import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on admin routes only (keeps the public site free of auth overhead).
  matcher: ["/admin/:path*"],
};
