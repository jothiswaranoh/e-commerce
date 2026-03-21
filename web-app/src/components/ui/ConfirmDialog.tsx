import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const config = {
    danger: {
      icon: AlertTriangle,
      bg: 'bg-red-50',
      iconColor: 'text-red-500',
      borderColor: 'border-red-100',
      btnVariant: 'danger' as const,
      glow: 'shadow-red-200/50'
    },
    warning: {
      icon: AlertCircle,
      bg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      borderColor: 'border-amber-100',
      btnVariant: 'primary' as const, // We'll use primary for warning, or handle in btn logic
      glow: 'shadow-amber-200/50'
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-100',
      btnVariant: 'primary' as const,
      glow: 'shadow-blue-200/50'
    }
  };

  const { icon: Icon, bg, iconColor, borderColor, btnVariant, glow } = config[variant];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className={`relative bg-white rounded-3xl shadow-2xl ${glow} max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-neutral-200`}>
        {/* Header Decor */}
        <div className={`h-2 w-full ${variant === 'danger' ? 'bg-red-500' : variant === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
        
        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-8">
            <div className={`w-14 h-14 rounded-2xl ${bg} border ${borderColor} flex items-center justify-center mb-6 shadow-sm`}>
              <Icon className={`w-7 h-7 ${iconColor}`} />
            </div>
            <h3 className="text-2xl font-display font-bold text-neutral-900 mb-3 tracking-tight">{title}</h3>
            <p className="text-neutral-500 leading-relaxed font-medium">{message}</p>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              fullWidth
              className="rounded-2xl py-3.5 border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50 active:scale-95 transition-all"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              variant={btnVariant === 'danger' ? 'danger' : 'primary'}
              fullWidth
              className="rounded-2xl py-3.5 font-bold shadow-lg active:scale-95 transition-all"
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
