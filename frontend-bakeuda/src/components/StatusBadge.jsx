import React from 'react';

export default function StatusBadge({ status }) {
  let bgClass = "bg-slate-100 text-slate-700 border border-slate-200"; // Default (Draft-like)
  const normalized = (status || "").toLowerCase().trim();

  if (
    normalized === "disetujui" ||
    normalized === "selesai" ||
    normalized === "lunas" ||
    normalized === "aktif"
  ) {
    bgClass = "bg-emerald-100 text-emerald-800 border border-emerald-200";
  } else if (
    normalized === "ditolak" ||
    normalized === "perlu perbaikan" ||
    normalized === "overdue" ||
    normalized === "revisi" ||
    normalized === "perlu revisi" ||
    normalized === "nonaktif"
  ) {
    bgClass = "bg-rose-100 text-rose-800 border border-rose-200";
  } else if (
    normalized === "draft"
  ) {
    bgClass = "bg-slate-100 text-slate-700 border border-slate-200";
  } else if (
    normalized.includes("menunggu") ||
    normalized === "proses" ||
    normalized === "baru"
  ) {
    bgClass = "bg-amber-100 text-amber-800 border border-amber-200";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[12px] font-bold inline-flex items-center justify-center whitespace-nowrap ${bgClass}`}>
      {status}
    </span>
  );
}
