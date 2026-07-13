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
      case 'danger': return 'text-red-600';
      case 'warning': return 'text-orange-500';
      default: return 'text-blue-600';
    }
  };

  const getButtonClass = () => {
    switch(type) {
      case 'danger': return 'bg-red-600 hover:bg-red-700 text-white border-transparent';
      case 'warning': return 'bg-orange-500 hover:bg-orange-600 text-white border-transparent';
      default: return 'bg-blue-600 hover:bg-blue-700 text-white border-transparent';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/50 transition-opacity" 
        onClick={onCancel}
      ></div>
      <div className="relative bg-white w-full max-w-sm rounded-lg shadow-xl p-0 animate-scale-in flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3 bg-white">
          <span className={`material-symbols-outlined text-[24px] ${getIconColorClass()}`}>{getIcon()}</span>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="px-6 py-5 bg-white">
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors shadow-sm ${getButtonClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
