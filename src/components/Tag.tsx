import { X } from 'lucide-react';

interface TagProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'email' | 'department' | 'are';
}

const variantStyles = {
  default: 'bg-primary-soft text-brand-petrol hover:bg-primary-100',
  email: 'bg-brand-green/20 text-dark-green hover:bg-brand-green/30',
  department: 'bg-soft-yellow/40 text-dark-yellow hover:bg-soft-yellow/60',
  are: 'bg-soft-purple/30 text-dark-purple hover:bg-soft-purple/50',
};

export default function Tag({ label, onRemove, variant = 'default' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors ${variantStyles[variant]}`}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:opacity-70 transition-opacity p-0.5 rounded-full hover:bg-white/50"
        >
          <X size={14} />
        </button>
      )}
    </span>
  );
}
