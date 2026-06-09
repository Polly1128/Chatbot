interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export default function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className={`text-sm font-medium ${disabled ? 'text-deep-blue-40' : 'text-deep-blue-60'}`}>
          {label}
        </span>
      )}
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          disabled
            ? 'bg-deep-blue-10 cursor-not-allowed'
            : checked
            ? 'bg-brand-petrol cursor-pointer shadow-sm'
            : 'bg-deep-blue-20 cursor-pointer'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
