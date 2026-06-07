import React from 'react';

export default function StatusBadge({ status }) {
  let bgClass = "bg-surface-container-low text-on-surface-variant";
  const normalized = (status || "").toLowerCase().trim();

  if (
    normalized === "verifikasi" ||
    normalized === "disetujui" ||
    normalized === "selesai" ||
    normalized === "lunas" ||
    normalized === "aktif"
  ) {
    bgClass = "bg-secondary-container text-on-secondary-container";
  } else if (
    normalized === "ditolak" ||
    normalized === "perlu perbaikan" ||
    normalized === "overdue" ||
    normalized === "revisi"
  ) {
    bgClass = "bg-error-container text-on-error-container";
  } else if (
    normalized === "draft" ||
    normalized === "menunggu"
  ) {
    bgClass = "bg-surface-container-high text-on-surface-variant";
  } else if (
    normalized === "menunggu validasi" ||
    normalized === "proses" ||
    normalized === "baru"
  ) {
    bgClass = "bg-primary-fixed text-on-primary-fixed-variant";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[12px] font-bold inline-flex items-center justify-center whitespace-nowrap ${bgClass}`}>
      {status}
    </span>
  );
}
