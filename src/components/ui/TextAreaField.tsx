"use client";

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export default function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required,
}: TextAreaFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-wide text-dark/70">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full rounded-md border border-dark/20 bg-white px-3 py-2 text-sm text-dark transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 resize-y"
      />
    </div>
  );
}
