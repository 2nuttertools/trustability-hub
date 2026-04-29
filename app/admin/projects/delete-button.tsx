"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProjectAction } from "./actions";

export function DeleteProjectButton({ slug, name }: { slug: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="px-2 h-9 rounded-lg border border-border text-xs font-semibold hover:bg-muted"
        >
          ยกเลิก
        </button>
        <button
          onClick={() => {
            startTransition(async () => {
              await deleteProjectAction(slug);
              router.refresh();
            });
          }}
          disabled={pending}
          className="inline-flex items-center gap-1 px-3 h-9 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50"
        >
          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          ยืนยันลบ
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`ลบ ${name}`}
      className="w-9 h-9 rounded-lg border border-border text-rose-600 hover:bg-rose-50 hover:border-rose-300 flex items-center justify-center transition-colors"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
