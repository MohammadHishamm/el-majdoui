/**
 * Renders a synchronous inline <script> that runs during HTML parsing (before first paint).
 * Per Next's "Preventing Flash Before Hydration" guide: emit executable JS on the server,
 * inert text/plain on the client, so React doesn't warn about rendering a <script> tag.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
