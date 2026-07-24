import React from 'react';
import { createPortal } from 'react-dom';

export default function DraftConfirmModal({ 
  isOpen, 
  onClose, 
  onDiscard, 
  onSave 
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-xl p-0 flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3 bg-white">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px] text-primary">save</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800">Simpan Draf?</h3>
        </div>
        <div className="px-6 py-5 bg-white">
          <p className="text-gray-600 text-sm leading-relaxed">
            Apakah Anda ingin menyimpan data yang sudah diisi sebagai draf sebelum kembali?
          </p>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col gap-2">
          <button 
            type="button"
            onClick={onSave}
            className="w-full py-2.5 text-sm font-bold bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Ya, Simpan Draf
          </button>
          <button 
            type="button"
            onClick={onDiscard}
            className="w-full py-2.5 text-sm font-bold bg-error/10 text-error rounded-full hover:bg-error/20 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Tidak, Keluar Saja
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-sm font-bold bg-transparent text-gray-600 rounded-full hover:bg-gray-200 transition-colors mt-1"
          >
            Batal
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
