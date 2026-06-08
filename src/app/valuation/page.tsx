"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import FormPanel from "@/components/layout/FormPanel";
import ValuationTemplate from "@/components/templates/ValuationTemplate";
import PrintButton from "@/components/PrintButton";
import ExportPDFButton from "@/components/ExportPDFButton";
import SaveCertificateButton from "@/components/SaveCertificateButton";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import TextAreaField from "@/components/ui/TextAreaField";
import DateField from "@/components/ui/DateField";
import ToggleField from "@/components/ui/ToggleField";
import RangeField from "@/components/ui/RangeField";
import ClarityField from "@/components/ui/ClarityField";
import { ValuationFormData, ValuationItem, ValuationStone } from "@/types";
import {
  METALS_FOR_VALUATION,
  METAL_COLOURS,
  STONE_TYPES,
  STONE_SHAPES,
} from "@/lib/constants";
import { generateCertificateNumber } from "@/lib/certificateNumbers";
import { todayString } from "@/lib/formatters";

function emptyValuationStone(): ValuationStone {
  return {
    name: "",
    type: "",
    weight: 0,
    count: 0,
    shape: "",
    colour: "",
    clarity: "",
  };
}

function emptyItem(): ValuationItem {
  return {
    description: "",
    metal: "",
    metalColour: "",
    metalWeight: 0,
    hasStones: false,
    valueKSH: 0,
    stones: [emptyValuationStone()],
  };
}

export default function ValuationPage() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<ValuationFormData>({
    clientName: "",
    date: todayString(),
    certificateNumber: "",
    items: [emptyItem()],
    valuerName: "Goldiam Jewellers",
  });

  useEffect(() => {
    setData((d) => ({
      ...d,
      certificateNumber: generateCertificateNumber("valuation"),
    }));
  }, []);

  const update = (
    field: keyof ValuationFormData,
    value: string | boolean | number
  ) => setData((d) => ({ ...d, [field]: value }));

  const updateItem = (
    idx: number,
    field: keyof ValuationItem,
    value: string | number
  ) =>
    setData((d) => ({
      ...d,
      items: d.items.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      ),
    }));

  const addItem = () =>
    setData((d) => ({ ...d, items: [...d.items, emptyItem()] }));

  const removeItem = (idx: number) =>
    setData((d) => ({
      ...d,
      items: d.items.filter((_, i) => i !== idx),
    }));

  const updateStone = (
    itemIdx: number,
    stoneIdx: number,
    field: keyof ValuationStone,
    value: string | number
  ) =>
    setData((d) => ({
      ...d,
      items: d.items.map((item, i) =>
        i === itemIdx
          ? {
              ...item,
              stones: item.stones.map((s, j) =>
                j === stoneIdx ? { ...s, [field]: value } : s
              ),
            }
          : item
      ),
    }));

  const addStone = (itemIdx: number) =>
    setData((d) => ({
      ...d,
      items: d.items.map((item, i) =>
        i === itemIdx
          ? { ...item, stones: [...item.stones, emptyValuationStone()] }
          : item
      ),
    }));

  const removeStone = (itemIdx: number, stoneIdx: number) =>
    setData((d) => ({
      ...d,
      items: d.items.map((item, i) =>
        i === itemIdx
          ? { ...item, stones: item.stones.filter((_, j) => j !== stoneIdx) }
          : item
      ),
    }));

  const toggleStones = (itemIdx: number, hasStones: boolean) =>
    setData((d) => ({
      ...d,
      items: d.items.map((item, i) =>
        i === itemIdx
          ? {
              ...item,
              hasStones,
              stones:
                hasStones && item.stones.length === 0
                  ? [emptyValuationStone()]
                  : item.stones,
            }
          : item
      ),
    }));

  const docTitle = `Goldiam_Valuation_${data.clientName || "Draft"}_${data.date}`;

  return (
    <FormPanel
      ref={certificateRef}
      actionButtons={
        <>
          <Link
            href="/"
            className="mr-auto text-sm text-muted hover:text-dark transition-colors"
          >
            &larr; Back
          </Link>
          <PrintButton contentRef={certificateRef} documentTitle={docTitle} />
          <SaveCertificateButton
            contentRef={certificateRef}
            filename={`${docTitle}.pdf`}
            certificateType="valuation"
            formData={data}
            title={`Valuation – ${data.clientName || "Draft"} – ${data.date}`}
          />
          <ExportPDFButton
            contentRef={certificateRef}
            filename={`${docTitle}.pdf`}
          />
        </>
      }
      formContent={
        <>
          <h2 className="font-serif text-xl font-bold text-dark">
            Valuation Certificate
          </h2>

          {/* Certificate info */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-dark/10">
            <FormField
              label="Client Name"
              value={data.clientName}
              onChange={(v) => update("clientName", v)}
              placeholder="e.g. MOSES"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <DateField
                label="Date"
                value={data.date}
                onChange={(v) => update("date", v)}
                required
              />
              <FormField
                label="Certificate #"
                value={data.certificateNumber}
                onChange={(v) => update("certificateNumber", v)}
              />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wide text-dark/70">
              Items
            </h3>
            {data.items.map((item, idx) => (
              <div
                key={idx}
                className="space-y-3 p-4 bg-white rounded-lg border border-dark/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gold">
                    Item {idx + 1}
                  </span>
                  {data.items.length > 1 && (
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <TextAreaField
                  label="Description"
                  value={item.description}
                  onChange={(v) => updateItem(idx, "description", v)}
                  placeholder="e.g. 18K Rose Gold Ring with Red Garnet"
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-3">
                  <SelectField
                    label="Metal"
                    value={item.metal}
                    onChange={(v) => updateItem(idx, "metal", v)}
                    options={METALS_FOR_VALUATION}
                  />
                  <SelectField
                    label="Metal Colour"
                    value={item.metalColour}
                    onChange={(v) => updateItem(idx, "metalColour", v)}
                    options={METAL_COLOURS}
                  />
                </div>
                <FormField
                  label="Metal Weight"
                  value={item.metalWeight || ""}
                  onChange={(v) =>
                    updateItem(idx, "metalWeight", parseFloat(v) || 0)
                  }
                  type="number"
                  suffix="g"
                  step="0.01"
                />
                <div className="space-y-3 rounded-lg border border-dark/10 bg-ivory/40 p-3">
                  <ToggleField
                    label="Has Stones?"
                    checked={item.hasStones}
                    onChange={(v) => toggleStones(idx, v)}
                  />
                  {item.hasStones && (
                    <div className="space-y-3">
                      {item.stones.map((stone, sIdx) => (
                        <div
                          key={sIdx}
                          className="space-y-3 rounded-lg border border-dark/10 bg-white p-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gold">
                              Stone {sIdx + 1}
                            </span>
                            {item.stones.length > 1 && (
                              <button
                                onClick={() => removeStone(idx, sIdx)}
                                className="text-xs text-red-500 transition-colors hover:text-red-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <FormField
                              label="Stone Name"
                              value={stone.name}
                              onChange={(v) => updateStone(idx, sIdx, "name", v)}
                              placeholder="e.g. Diamond, Tanzanite"
                            />
                            <SelectField
                              label="Stone Type"
                              value={stone.type}
                              onChange={(v) => updateStone(idx, sIdx, "type", v)}
                              options={STONE_TYPES}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <FormField
                              label="Stone Weight"
                              value={stone.weight || ""}
                              onChange={(v) =>
                                updateStone(idx, sIdx, "weight", parseFloat(v) || 0)
                              }
                              type="number"
                              suffix="CT"
                              step="0.01"
                            />
                            <SelectField
                              label="Stone Shape / Cut"
                              value={stone.shape}
                              onChange={(v) => updateStone(idx, sIdx, "shape", v)}
                              options={STONE_SHAPES}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <FormField
                              label="Number of Stones"
                              value={stone.count || ""}
                              onChange={(v) =>
                                updateStone(idx, sIdx, "count", parseInt(v) || 0)
                              }
                              type="number"
                            />
                            <FormField
                              label="Stone Colour"
                              value={stone.colour}
                              onChange={(v) => updateStone(idx, sIdx, "colour", v)}
                              placeholder="e.g. D-F, Red"
                            />
                          </div>
                          <ClarityField
                            value={stone.clarity}
                            onChange={(v) => updateStone(idx, sIdx, "clarity", v)}
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => addStone(idx)}
                        className="w-full rounded-lg border-2 border-dashed border-gold/40 py-2 text-sm font-bold text-gold transition-colors hover:border-gold hover:bg-gold/5"
                      >
                        + Add Another Stone
                      </button>
                    </div>
                  )}
                </div>
                <FormField
                  label="Value"
                  value={item.valueKSH || ""}
                  onChange={(v) =>
                    updateItem(idx, "valueKSH", parseFloat(v) || 0)
                  }
                  type="number"
                  prefix="KSH"
                  required
                />
              </div>
            ))}
            <button
              onClick={addItem}
              className="w-full rounded-lg border-2 border-dashed border-gold/40 py-2.5 text-sm font-bold text-gold hover:border-gold hover:bg-gold/5 transition-colors"
            >
              + Add Another Item
            </button>
          </div>

          {/* Valuer */}
          <div className="space-y-3 p-4 bg-white rounded-lg border border-dark/10">
            <FormField
              label="Valuer Name"
              value={data.valuerName}
              onChange={(v) => update("valuerName", v)}
              placeholder="Goldiam Jewellers"
            />
            <ToggleField
              label="Add Signature"
              checked={data.showSignature ?? false}
              onChange={(v) => update("showSignature", v)}
            />
            {data.showSignature && (
              <RangeField
                label="Signature Size"
                value={data.signatureScale ?? 100}
                onChange={(v) => update("signatureScale", v)}
                min={50}
                max={250}
                step={5}
                valueLabel={`${data.signatureScale ?? 100}%`}
              />
            )}
          </div>
        </>
      }
      previewContent={<ValuationTemplate data={data} />}
    />
  );
}
