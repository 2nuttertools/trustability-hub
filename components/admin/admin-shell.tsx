"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, Home, Users, Inbox, Newspaper, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "./actions";
import { useTransition } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  superAdminOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "โครงการ", icon: Home },
  { href: "/admin/articles", label: "บทความ", icon: Newspaper },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/users", label: "ผู้ดูแลระบบ", icon: Users, superAdminOnly: true },
];

export function AdminShell({
  user,
  children,
}: {
  user: { displayName: string; email: string; role: "super-admin" | "admin" };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const visibleNav = navItems.filter((n) => !n.superAdminOnly || user.role === "super-admin");

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-border">
        <Link href="/admin" className="flex items-center gap-2 px-5 py-5 border-b border-border">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-600 to-brand-900 flex items-center justify-center shadow">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div className="leading-none">
            <p className="font-bold text-sm bg-gradient-to-r from-brand-900 to-brand-600 bg-clip-text text-transparent">
              Trustability Hub
            </p>
            <p className="text-[9px] tracking-[0.2em] text-muted-foreground uppercase mt-0.5">
              Admin Console
            </p>
          </div>
        </Link>

        <nav className="flex-1 p-3 space-y-1">
          {visibleNav.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="px-3 py-2.5 rounded-lg bg-muted/40 mb-2">
            <p className="text-sm font-semibold leading-tight truncate">{user.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <span className={cn(
              "inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full mt-1.5",
              user.role === "super-admin"
                ? "bg-amber-100 text-amber-800"
                : "bg-brand-100 text-brand-700",
            )}>
              {user.role}
            </span>
          </div>
          <button
            onClick={() => startTransition(() => logoutAction())}
            disabled={pending}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            ออกจากระบบ
          </button>
          <Link
            href="/"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-brand-700 transition-colors mt-1"
          >
            ← กลับสู่เว็บหลัก
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-900 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">Admin</span>
        </Link>
        <button
          onClick={() => startTransition(() => logoutAction())}
          disabled={pending}
          className="text-xs text-rose-600 font-semibold flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" /> ออก
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-0 mt-14 lg:mt-0 overflow-x-hidden">
        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border flex justify-around py-2">
          {visibleNav.slice(0, 5).map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center gap-0.5 py-1 text-[10px]",
                  active ? "text-brand-700 font-bold" : "text-muted-foreground",
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 lg:p-8 pb-20 lg:pb-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
