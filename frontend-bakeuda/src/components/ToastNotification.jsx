import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ToastNotification({ show, message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const bgColors = {
    success: 'bg-secondary-container text-on-secondary-container border-secondary/35',
    error: 'bg-error-container text-on-error-container border-error/35',
    info: 'bg-surface-container-highest text-on-surface border-outline/35',
  };

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  };

  const titles = {
    success: 'Berhasil',
    error: 'Terjadi Kesalahan',
    info: 'Informasi',
  };

  return createPortal(
    <div
      className={`fixed bottom-8 right-8 ${bgColors[type]} border px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-500 z-[9999] animate-in slide-in-from-bottom-5 fade-in`}
    >
      <span className={`material-symbols-outlined text-[24px] ${type === 'success' ? 'text-secondary' : type === 'error' ? 'text-error' : 'text-on-surface-variant'}`}>
        {icons[type]}
      </span>
      <div>
        <p className="font-bold">{titles[type]}</p>
        <p className="text-sm opacity-90 max-w-sm">
          {Array.isArray(message) ? (
            <ul className="list-disc pl-4">
              {message.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          ) : (
            message
          )}
        </p>
      </div>
      <button 
        className="ml-4 opacity-50 hover:opacity-100 transition-opacity" 
        onClick={onClose}
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>,
    document.body
  );
}
