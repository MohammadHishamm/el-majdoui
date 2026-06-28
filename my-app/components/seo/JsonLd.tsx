/**
 * Renders a JSON-LD structured-data <script>. Server component — safe to drop
 * into any server page. `data` may be a single schema object or an array.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped enough for a JSON-LD script block.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
