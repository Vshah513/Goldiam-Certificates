"use client";

interface RangeFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Text shown next to the label, e.g. "120%". */
  valueLabel?: string;
}

export default function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  valueLabel,
}: RangeFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wide text-dark/70">
          {label}
        </label>
        {valueLabel && (
          <span className="text-xs font-semibold text-gold">{valueLabel}</span>
        )}
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-dark/15 accent-gold"
      />
    </div>
  );
}
