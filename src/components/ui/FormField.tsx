"use client";

interface FormFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  required?: boolean;
  min?: number;
  step?: string;
}

export default function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  prefix,
  suffix,
  required,
  min,
  step,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-wide text-dark/70">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex items-center">
        {prefix && (
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-dark/20 bg-ivory px-3 py-2 text-sm text-muted">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          min={min}
          step={step}
          className={`w-full border border-dark/20 bg-white px-3 py-2 text-sm text-dark transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 ${
            prefix ? "rounded-r-md" : suffix ? "rounded-l-md" : "rounded-md"
          }`}
        />
        {suffix && (
          <span className="inline-flex items-center rounded-r-md border border-l-0 border-dark/20 bg-ivory px-3 py-2 text-sm text-muted">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
