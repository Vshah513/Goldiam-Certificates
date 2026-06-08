"use client";

import { useEffect, useState } from "react";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import { STONE_CLARITIES } from "@/lib/constants";

const OTHER = "Other";
const CLARITY_OPTIONS = [...STONE_CLARITIES, OTHER] as const;

function isPresetClarity(value: string) {
  return (STONE_CLARITIES as readonly string[]).includes(value);
}

interface ClarityFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function ClarityField({
  label = "Stone Quality (Clarity)",
  value,
  onChange,
}: ClarityFieldProps) {
  const [customMode, setCustomMode] = useState(
    () => value !== "" && !isPresetClarity(value)
  );

  useEffect(() => {
    if (value && !isPresetClarity(value)) {
      setCustomMode(true);
    }
  }, [value]);

  const selectValue = customMode ? OTHER : value;

  const handleSelect = (selected: string) => {
    if (selected === OTHER) {
      setCustomMode(true);
      if (isPresetClarity(value)) onChange("");
      return;
    }
    setCustomMode(false);
    onChange(selected);
  };

  return (
    <div className="space-y-3">
      <SelectField
        label={label}
        value={selectValue}
        onChange={handleSelect}
        options={CLARITY_OPTIONS}
      />
      {customMode && (
        <FormField
          label="Specify Quality / Clarity"
          value={value}
          onChange={onChange}
          placeholder="e.g. Eye Clean, AAA"
        />
      )}
    </div>
  );
}
