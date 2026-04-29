import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Trustability Hub",
  robots: { index: false, follow: false },
};

// The admin section deliberately omits the public Navbar/Footer/FloatingContact
// (rendered in app/layout.tsx via separate elements). To keep things simple we
// use the same root layout. Auth checks happen per page.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-50">{children}</div>;
}
