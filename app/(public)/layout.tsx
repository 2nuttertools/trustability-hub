import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingContact } from "@/components/floating-contact";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContact />
    </>
  );
}
