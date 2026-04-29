# Trustability Hub — Premium Real Estate Agency

Next.js 16 + Vercel — เว็บไซต์ตัวแทนอสังหาริมทรัพย์ระดับพรีเมียม รองรับลูกค้าไทยและจีน

ข้อมูลโครงการ/บทความ/รีวิว เก็บเป็น **JSON files ใน repo** — แก้ผ่าน GitHub web ได้เลย → Vercel auto-deploy

## Stack

- Next.js 16 (App Router + Turbopack)
- TypeScript + Tailwind CSS v4
- Framer Motion (animations)
- JSON files for content (no DB)
- Vercel (deploy)

## ⚙️ Setup (ครั้งแรก)

```bash
npm install
npm run dev
```

เปิด <http://localhost:3000>

## ✏️ การจัดการเนื้อหา

แก้ไฟล์ใน `data/` แล้ว commit → Vercel auto-deploy ภายใน 1 นาที

| ไฟล์ | สำหรับ |
|---|---|
| `data/projects.json` | รายการโครงการ (ชื่อ, ราคา, รูป, จุดเด่น, สถานที่ใกล้เคียง, ...) |
| `data/articles.json` | บทความ/คู่มือบนหน้า Articles |
| `data/testimonials.json` | รีวิวลูกค้า |

### วิธีแก้บน GitHub Web (ง่ายสุด)

1. ไปที่ repo บน GitHub
2. คลิกไฟล์ที่ต้องการ เช่น `data/projects.json`
3. คลิกปุ่มดินสอ ✏️ มุมขวาบน
4. แก้ → Commit changes
5. Vercel deploy อัตโนมัติ ภายใน 60 วินาที

### เพิ่มโครงการใหม่

เปิด `data/projects.json` แล้ว append object ใหม่ ใช้ object ที่มีอยู่เป็น template:

```json
{
  "slug": "unique-url-slug",
  "name": "ชื่อโครงการภาษาไทย",
  "nameEn": "Project Name English",
  "developer": "ชื่อ Developer",
  "type": "คอนโด | บ้านเดี่ยว | ทาวน์โฮม | Pool Villa",
  "status": "Pre-sale | พร้อมอยู่ | อยู่ระหว่างก่อสร้าง",
  "priceFrom": 5000000,
  ...
}
```

หน้า project detail จะถูกสร้างที่ `/projects/<slug>` อัตโนมัติ

## 📁 โครงสร้างไฟล์

```
trustability-hub/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── projects/[slug]/page.tsx   # Project detail (dynamic)
│   ├── actions/leads.ts            # Contact form handler
│   └── layout.tsx
├── components/                     # All UI components
├── data/                           # 📌 EDIT HERE — content
│   ├── projects.json
│   ├── articles.json
│   └── testimonials.json
└── lib/
    ├── data.ts                     # JSON loader + types
    └── utils.ts
```

## 🚀 Deploy ไป Vercel

ครั้งแรก:

```bash
npx vercel deploy --yes --prod
```

หลังจากนั้นแค่ `git push` → Vercel deploy อัตโนมัติ

## 📨 Lead Form (Contact Submissions)

⚠️ **ตอนนี้ contact form ยัง*ไม่ส่งอีเมลจริง*** — submission จะ log เข้า Vercel server console เท่านั้น

ดูได้ที่: <https://vercel.com/aidji13store-6706s-projects/trustability-hub/logs>

### วิธีรับ lead ในอนาคต

แก้ใน `app/actions/leads.ts` — สามารถเลือกได้:

- **Resend** (ส่งเข้า email) — ฟรี 3,000 emails/เดือน
- **Google Sheets** (Apps Script webhook)
- **Discord/Slack webhook**
- **GitHub Issues** (แต่ละ lead = 1 issue)

ตอนนี้สถาปัตยกรรมเตรียมไว้แล้ว — แค่เปลี่ยน body ของ `submitLead()` ก็พอ

## 🌍 Features

- ✅ Landing page (Hero / Stats / Featured / Categories / Why Us / Testimonials / Articles / CTA)
- ✅ Project detail (Gallery + Lightbox + Mortgage Calculator + Sticky CTA)
- ✅ Floating Contact Button (LINE / WhatsApp / WeChat / Phone)
- ✅ Multi-currency display (THB / CNY / USD)
- ✅ Language switcher UI (TH / EN / CN)
- ✅ ISR (60s revalidation)
- ✅ SEO metadata + Image optimization

## 📝 TODO

- [ ] Wire Resend (or similar) for contact form
- [ ] เชื่อม Google Maps API จริง (ตอนนี้ placeholder)
- [ ] Auth + Save Favorites (ถ้ามี Supabase/Clerk)
- [ ] Multi-language จริง (i18n routing)
- [ ] Search/Filter page
- [ ] PWA + Offline support
