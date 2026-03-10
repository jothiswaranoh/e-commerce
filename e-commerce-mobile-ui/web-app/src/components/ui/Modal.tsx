import { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dialog' | 'fullscreen';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  variant = 'dialog',
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  // =========================
  // FULLSCREEN MODAL
  // =========================
  if (variant === 'fullscreen') {
    return createPortal(
      <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {footer && (
          <div className="border-t px-6 py-4 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>,
      document.getElementById('modal-root')!
    );
  }

  // =========================
  // DIALOG MODAL — FIXED
  // =========================
  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal Wrapper */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* 🔴 STOP CLICK PROPAGATION HERE */}
        <div
          className={`w-full ${sizes[size]} mx-4 bg-white rounded-2xl shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {children}
          </div>

          {footer && (
            <div className="border-t p-6 flex justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
}