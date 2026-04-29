import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingContact } from "@/components/floating-contact";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const notoThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trustability Hub — ตัวแทนอสังหาริมทรัพย์ที่ไว้วางใจได้",
  description:
    "ค้นหาบ้าน คอนโด ทาวน์โฮม โครงการคุณภาพทั่วประเทศไทย พร้อมบริการที่ปรึกษาส่วนตัว 24/7 — Trustability Hub: Premium Real Estate Agency for Thai & Chinese Buyers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${jakarta.variable} ${notoThai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
