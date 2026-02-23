"use client";

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function DateField({
  label,
  value,
  onChange,
  required,
}: DateFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-wide text-dark/70">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-md border border-dark/20 bg-white px-3 py-2 text-sm text-dark transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
      />
    </div>
  );
}
