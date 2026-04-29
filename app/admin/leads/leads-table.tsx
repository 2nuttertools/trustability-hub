"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, Search, Trash2, Loader2, ChevronDown, ChevronUp, Download, Calendar } from "lucide-react";
import { updateLeadStatusAction, deleteLeadAction } from "./actions";
import type { LeadRow, LeadStatus } from "@/lib/admin/leads";
import { cn } from "@/lib/utils";

const statusOptions: { value: LeadStatus; label: string; color: string }[] = [
  { value: "new", label: "ใหม่", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { value: "contacted", label: "ติดต่อแล้ว", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { value: "qualified", label: "Qualified", color: "bg-violet-100 text-violet-700 border-violet-300" },
  { value: "closed", label: "ปิดดีล", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { value: "lost", label: "Lost", color: "bg-slate-100 text-slate-700 border-slate-300" },
];

const statusColor = (s: LeadStatus) => statusOptions.find((o) => o.value === s)?.color ?? "";
const statusLabel = (s: LeadStatus) => statusOptions.find((o) => o.value === s)?.label ?? s;

function formatDate(s: string) {
  return new Date(s).toLocaleString("th-TH", {
    day: "numeric", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

function exportCsv(leads: LeadRow[]) {
  const headers = ["created_at", "status", "name", "phone", "email", "budget", "source", "project_slug", "message"];
  const rows = leads.map((l) => headers.map((h) => {
    const v = (l as unknown as Record<string, string | null>)[h] ?? "";
    return `"${String(v).replace(/"/g, '""')}"`;
  }).join(","));
  const csv = headers.join(",") + "\n" + rows.join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function LeadsTable({
  leads, initialSearch, initialStatus,
}: {
  leads: LeadRow[];
  initialSearch: string;
  initialStatus: LeadStatus | "all";
}) {
  const [search, setSearch] = useState(initialSearch);
  const [expanded, setExpanded] = useState<string | null>(null);
  const router = useRouter();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (initialStatus !== "all") params.set("status", initialStatus);
    if (search.trim()) params.set("q", search.trim());
    router.push(`/admin/leads${params.toString() ? "?" + params.toString() : ""}`);
  };

  return (
    <>
      {/* Search + export */}
      <div className="flex items-center gap-2 mb-4">
        <form onSubmit={submitSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหา ชื่อ / เบอร์ / email"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </form>
        <button
          type="button" onClick={() => exportCsv(leads)}
          disabled={leads.length === 0}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-white text-xs font-semibold hover:bg-muted disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground">ยังไม่มี lead ที่ตรงกับเงื่อนไข</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {leads.map((lead, i) => (
            <LeadRowItem
              key={lead.id}
              lead={lead}
              expanded={expanded === lead.id}
              onToggle={() => setExpanded((cur) => (cur === lead.id ? null : lead.id))}
              isLast={i === leads.length - 1}
            />
          ))}
        </div>
      )}
    </>
  );
}

function LeadRowItem({
  lead, expanded, onToggle, isLast,
}: {
  lead: LeadRow;
  expanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [notes, setNotes] = useState(lead.notes ?? "");
  const router = useRouter();

  const setStatus = (status: LeadStatus, notesVal?: string) => {
    startTransition(async () => {
      await updateLeadStatusAction(lead.id, status, notesVal);
      router.refresh();
    });
  };

  const remove = () => {
    if (!confirm("ลบ lead นี้?")) return;
    startTransition(async () => {
      await deleteLeadAction(lead.id);
      router.refresh();
    });
  };

  return (
    <div className={cn(!isLast && "border-b border-border")}>
      {/* Summary row */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 hover:bg-muted/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold truncate">{lead.name}</span>
              <span className={cn("text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border", statusColor(lead.status))}>
                {statusLabel(lead.status)}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>
              {lead.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>}
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(lead.created_at)}</span>
              {lead.project_slug && <span className="text-brand-700 font-semibold">📌 {lead.project_slug}</span>}
            </div>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
        </div>
      </button>

      {/* Detail */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 bg-muted/10">
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm">
              {lead.budget && <Row label="งบประมาณ" value={lead.budget} />}
              {lead.source && <Row label="Source" value={lead.source} />}
              {lead.message && <Row label="ข้อความ" value={lead.message} multiline />}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold mb-1.5 uppercase tracking-wider text-foreground/60">เปลี่ยนสถานะ</p>
                <div className="flex flex-wrap gap-1.5">
                  {statusOptions.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStatus(s.value, notes)}
                      disabled={pending || lead.status === s.value}
                      className={cn(
                        "text-xs font-semibold px-2.5 py-1 rounded-full border transition-all",
                        lead.status === s.value ? cn(s.color, "ring-2 ring-offset-1 ring-current") : cn(s.color, "opacity-70 hover:opacity-100"),
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold mb-1.5 uppercase tracking-wider text-foreground/60">โน้ต (internal)</p>
                <textarea
                  rows={2} value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={() => notes !== (lead.notes ?? "") && setStatus(lead.status, notes)}
                  placeholder="เช่น โทรไปแล้ว นัดดูบ้าน..."
                  className="w-full px-3 py-2 rounded-lg border border-border bg-white text-xs resize-y focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              <div className="flex justify-between items-center pt-1">
                <a
                  href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`}
                  className="text-xs font-semibold text-brand-700 hover:text-brand-900"
                >
                  📞 โทรหา {lead.name}
                </a>
                <button
                  type="button" onClick={remove} disabled={pending}
                  className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 disabled:opacity-50"
                >
                  {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  ลบ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={cn("text-sm", multiline && "whitespace-pre-wrap")}>{value}</span>
    </div>
  );
}
