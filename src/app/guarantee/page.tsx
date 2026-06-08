"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import FormPanel from "@/components/layout/FormPanel";
import GuaranteeTemplate from "@/components/templates/GuaranteeTemplate";
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
import { GuaranteeFormData, Stone } from "@/types";
import {
  METAL_TYPES,
  METAL_COLOURS,
  GOLD_KARATS,
  STONE_TYPES,
  STONE_SHAPES,
} from "@/lib/constants";
import { generateCertificateNumber } from "@/lib/certificateNumbers";
import { todayString } from "@/lib/formatters";

function emptyStone(): Stone {
  return {
    stoneName: "",
    stoneType: "",
    stoneWeight: 0,
    stoneShape: "",
    numberOfStones: 0,
    stoneColour: "",
    stoneClarity: "",
  };
}

export default function GuaranteePage() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<GuaranteeFormData>({
    clientName: "",
    date: todayString(),
    certificateNumber: "",
    itemDescription: "",
    metalType: "",
    metalColour: "",
    goldPurity: "",
    totalMetalWeight: 0,
    hasStones: false,
    stones: [emptyStone()],
    additionalNotes: "",
  });

  useEffect(() => {
    setData((d) => ({
      ...d,
      certificateNumber: generateCertificateNumber("guarantee"),
    }));
  }, []);

  const update = <K extends keyof GuaranteeFormData>(
    field: K,
    value: GuaranteeFormData[K]
  ) => setData((d) => ({ ...d, [field]: value }));

  const updateStone = (
    idx: number,
    field: keyof Stone,
    value: string | number
  ) =>
    setData((d) => ({
      ...d,
      stones: d.stones.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    }));

  const addStone = () =>
    setData((d) => ({ ...d, stones: [...d.stones, emptyStone()] }));

  const removeStone = (idx: number) =>
    setData((d) => ({
      ...d,
      stones: d.stones.filter((_, i) => i !== idx),
    }));

  const toggleStones = (v: boolean) =>
    setData((d) => ({
      ...d,
      hasStones: v,
      stones: v && d.stones.length === 0 ? [emptyStone()] : d.stones,
    }));

  const docTitle = `Goldiam_Guarantee_${data.clientName || "Draft"}_${data.date}`;

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
            certificateType="guarantee"
            formData={data}
            title={`Guarantee – ${data.clientName || "Draft"} – ${data.date}`}
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
            Guarantee Certificate
          </h2>

          {/* Certificate info */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-dark/10">
            <FormField
              label="Client Name"
              value={data.clientName}
              onChange={(v) => update("clientName", v)}
              placeholder="Client full name"
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

          {/* Item details */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-dark/10">
            <h3 className="text-xs font-bold uppercase tracking-wide text-gold">
              Item Details
            </h3>
            <TextAreaField
              label="Item Description"
              value={data.itemDescription}
              onChange={(v) => update("itemDescription", v)}
              placeholder="e.g. Ladies Ring"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="Metal Type"
                value={data.metalType}
                onChange={(v) => update("metalType", v)}
                options={METAL_TYPES}
              />
              <SelectField
                label="Metal Colour"
                value={data.metalColour}
                onChange={(v) => update("metalColour", v)}
                options={METAL_COLOURS}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="Gold Purity"
                value={data.goldPurity}
                onChange={(v) => update("goldPurity", v)}
                options={GOLD_KARATS}
              />
              <FormField
                label="Total Metal Weight"
                value={data.totalMetalWeight || ""}
                onChange={(v) => update("totalMetalWeight", parseFloat(v) || 0)}
                type="number"
                suffix="g"
                step="0.01"
              />
            </div>
          </div>

          {/* Stone details */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-dark/10">
            <ToggleField
              label="Has Stones?"
              checked={data.hasStones}
              onChange={toggleStones}
            />
            {data.hasStones && (
              <div className="space-y-3">
                {data.stones.map((stone, idx) => (
                  <div
                    key={idx}
                    className="space-y-3 rounded-lg border border-dark/10 bg-ivory/40 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gold">
                        Stone {idx + 1}
                      </span>
                      {data.stones.length > 1 && (
                        <button
                          onClick={() => removeStone(idx)}
                          className="text-xs text-red-500 transition-colors hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        label="Stone Name"
                        value={stone.stoneName}
                        onChange={(v) => updateStone(idx, "stoneName", v)}
                        placeholder="e.g. Diamond, Tanzanite"
                      />
                      <SelectField
                        label="Stone Type"
                        value={stone.stoneType}
                        onChange={(v) => updateStone(idx, "stoneType", v)}
                        options={STONE_TYPES}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        label="Stone Weight"
                        value={stone.stoneWeight || ""}
                        onChange={(v) =>
                          updateStone(idx, "stoneWeight", parseFloat(v) || 0)
                        }
                        type="number"
                        suffix="CT"
                        step="0.01"
                      />
                      <SelectField
                        label="Stone Shape"
                        value={stone.stoneShape}
                        onChange={(v) => updateStone(idx, "stoneShape", v)}
                        options={STONE_SHAPES}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        label="Number of Stones"
                        value={stone.numberOfStones || ""}
                        onChange={(v) =>
                          updateStone(idx, "numberOfStones", parseInt(v) || 0)
                        }
                        type="number"
                      />
                      <FormField
                        label="Stone Colour"
                        value={stone.stoneColour}
                        onChange={(v) => updateStone(idx, "stoneColour", v)}
                        placeholder="e.g. D-F, Red"
                      />
                    </div>
                    <ClarityField
                      label="Stone Clarity"
                      value={stone.stoneClarity}
                      onChange={(v) => updateStone(idx, "stoneClarity", v)}
                    />
                  </div>
                ))}
                <button
                  onClick={addStone}
                  className="w-full rounded-lg border-2 border-dashed border-gold/40 py-2 text-sm font-bold text-gold transition-colors hover:border-gold hover:bg-gold/5"
                >
                  + Add Another Stone
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-3 p-4 bg-white rounded-lg border border-dark/10">
            <TextAreaField
              label="Additional Notes"
              value={data.additionalNotes}
              onChange={(v) => update("additionalNotes", v)}
              placeholder="Any additional information..."
              rows={3}
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
      previewContent={<GuaranteeTemplate data={data} />}
    />
  );
}
