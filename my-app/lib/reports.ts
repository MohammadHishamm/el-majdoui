export type Report = {
  id: string;
  title: string;
  /** Period label, e.g. "عام 2025" or "2020–2021". */
  period: string;
  /**
   * Path to the PDF under /public, or "" while the document is still pending.
   * An empty value hides the download and preview actions — the content guide
   * forbids shipping a stand-in file in place of the real report.
   */
  file: string;
};
