export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="ltr" className="min-h-screen" lang="en">
      {children}
    </div>
  );
}
