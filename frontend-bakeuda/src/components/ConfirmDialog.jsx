import React from 'react';
import { createPortal } from 'react-dom';

export default function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Ya', 
  cancelText = 'Batal', 
  onConfirm, 
  onCancel,
  type = 'danger' // 'danger' or 'warning'
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch(type) {
      case 'danger': return 'warning';
      case 'warning': return 'info';
      default: return 'help';
    }
  };

  const getIconColorClass = () => {
    switch(type) {
      case 'danger': return 'bg-error/10 text-error';
      case 'warning': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-primary/10 text-primary';
    }
  };

  const getButtonClass = () => {
    switch(type) {
      case 'danger': return 'bg-error hover:bg-error/90 text-white';
      case 'warning': return 'bg-orange-500 hover:bg-orange-600 text-white';
      default: return 'bg-primary hover:bg-primary/90 text-white';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      ></div>
      <div className="relative bg-white w-full max-w-sm rounded-[24px] shadow-2xl p-6 animate-scale-in text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${getIconColorClass()}`}>
          <span className="material-symbols-outlined text-[32px]">{getIcon()}</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">{title}</h3>
        <p className="text-on-surface-variant text-sm mb-6">{message}</p>
        
        <div className="flex gap-3 w-full">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold rounded-xl transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 font-bold rounded-xl transition-colors shadow-sm ${getButtonClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
