import Link from "next/link";
import { Building2, MessageCircle, Mail, MapPin, Phone } from "lucide-react";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-lg tracking-tight">Trustability Hub</span>
                <span className="text-[10px] tracking-[0.2em] text-white/60 uppercase">
                  Premium Real Estate
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-md">
              Trustability Hub — ตัวแทนอสังหาริมทรัพย์ที่ไว้วางใจได้
              เชื่อมต่อโครงการคุณภาพจากทั่วประเทศไทย สู่ผู้ซื้อทั้งชาวไทยและต่างชาติ
              ด้วยทีมที่ปรึกษาผู้เชี่ยวชาญและบริการครบวงจร 24/7
            </p>
            <div className="flex gap-2">
              {[FacebookIcon, InstagramIcon, YoutubeIcon, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-sm tracking-wide uppercase mb-4 text-white/90">
              บริการของเรา
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">ค้นหาโครงการ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">สำหรับนักลงทุน</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">บริการชาวต่างชาติ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">ที่ปรึกษาสินเชื่อ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">บริการบริหารการเช่า</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">บริการประเมินราคา</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm tracking-wide uppercase mb-4 text-white/90">
              แหล่งข้อมูล
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">บทความ & คู่มือ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">รีวิวโครงการ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">เครื่องคำนวณสินเชื่อ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">ราคาประเมิน</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm tracking-wide uppercase mb-4 text-white/90">
              ติดต่อเรา
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                <span>168 ตึกพรีเมียม ชั้น 28<br/>สุขุมวิท 21 กรุงเทพฯ 10110</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <a href="tel:+66800000000" className="hover:text-white">080-000-0000</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <a href="mailto:hello@trustabilityhub.co" className="hover:text-white">hello@trustabilityhub.co</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-accent flex-shrink-0" />
                <span>LINE: @trustabilityhub</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs text-white/50">
            <span>ใบอนุญาตประกอบธุรกิจตัวแทน เลขที่ XX-XXXX</span>
            <span>•</span>
            <span>สมาชิก สมาคมตัวแทนนายหน้าอสังหาริมทรัพย์ไทย</span>
            <span>•</span>
            <span>ISO 9001:2015 Certified</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© 2026 Trustability Hub Co., Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white">นโยบายความเป็นส่วนตัว</Link>
            <Link href="#" className="hover:text-white">เงื่อนไขการใช้งาน</Link>
            <Link href="#" className="hover:text-white">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
