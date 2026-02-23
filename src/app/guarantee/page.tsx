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
import { GuaranteeFormData } from "@/types";
import {
  METAL_TYPES,
  METAL_COLOURS,
  GOLD_KARATS,
  STONE_TYPES,
  STONE_SHAPES,
  STONE_CLARITIES,
} from "@/lib/constants";
import { generateCertificateNumber } from "@/lib/certificateNumbers";
import { todayString } from "@/lib/formatters";

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
    stoneName: "",
    stoneType: "",
    stoneWeight: 0,
    stoneShape: "",
    numberOfStones: 0,
    stoneColour: "",
    stoneClarity: "",
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
              onChange={(v) => update("hasStones", v)}
            />
            {data.hasStones && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Stone Name"
                    value={data.stoneName}
                    onChange={(v) => update("stoneName", v)}
                    placeholder="e.g. Diamond, Ruby"
                  />
                  <SelectField
                    label="Stone Type"
                    value={data.stoneType}
                    onChange={(v) => update("stoneType", v)}
                    options={STONE_TYPES}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Stone Weight"
                    value={data.stoneWeight || ""}
                    onChange={(v) =>
                      update("stoneWeight", parseFloat(v) || 0)
                    }
                    type="number"
                    suffix="CT"
                    step="0.01"
                  />
                  <SelectField
                    label="Stone Shape"
                    value={data.stoneShape}
                    onChange={(v) => update("stoneShape", v)}
                    options={STONE_SHAPES}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Number of Stones"
                    value={data.numberOfStones || ""}
                    onChange={(v) =>
                      update("numberOfStones", parseInt(v) || 0)
                    }
                    type="number"
                  />
                  <FormField
                    label="Stone Colour"
                    value={data.stoneColour}
                    onChange={(v) => update("stoneColour", v)}
                    placeholder="e.g. D-F, Red"
                  />
                </div>
                <SelectField
                  label="Stone Clarity"
                  value={data.stoneClarity}
                  onChange={(v) => update("stoneClarity", v)}
                  options={STONE_CLARITIES}
                />
              </>
            )}
          </div>

          {/* Notes */}
          <div className="p-4 bg-white rounded-lg border border-dark/10">
            <TextAreaField
              label="Additional Notes"
              value={data.additionalNotes}
              onChange={(v) => update("additionalNotes", v)}
              placeholder="Any additional information..."
              rows={3}
            />
          </div>
        </>
      }
      previewContent={<GuaranteeTemplate data={data} />}
    />
  );
}
