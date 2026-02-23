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
import { ValuationFormData, ValuationItem } from "@/types";
import { METALS_FOR_VALUATION, METAL_COLOURS, DIAMOND_TYPES } from "@/lib/constants";
import { generateCertificateNumber } from "@/lib/certificateNumbers";
import { todayString } from "@/lib/formatters";

function emptyItem(): ValuationItem {
  return {
    description: "",
    stoneType: "",
    stoneWeight: 0,
    numberOfDiamonds: 0,
    diamondType: "",
    metal: "",
    metalColour: "",
    valueKSH: 0,
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

  const update = (field: keyof ValuationFormData, value: string) =>
    setData((d) => ({ ...d, [field]: value }));

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
                  <FormField
                    label="Stone Type"
                    value={item.stoneType}
                    onChange={(v) => updateItem(idx, "stoneType", v)}
                    placeholder="e.g. Red Garnet"
                  />
                  <FormField
                    label="Stone Weight"
                    value={item.stoneWeight || ""}
                    onChange={(v) =>
                      updateItem(idx, "stoneWeight", parseFloat(v) || 0)
                    }
                    type="number"
                    suffix="CT"
                    step="0.01"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="No. of Diamonds"
                    value={item.numberOfDiamonds || ""}
                    onChange={(v) =>
                      updateItem(idx, "numberOfDiamonds", parseInt(v) || 0)
                    }
                    type="number"
                  />
                  <SelectField
                    label="Diamond Type"
                    value={item.diamondType}
                    onChange={(v) => updateItem(idx, "diamondType", v)}
                    options={DIAMOND_TYPES}
                  />
                </div>
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
          <div className="p-4 bg-white rounded-lg border border-dark/10">
            <FormField
              label="Valuer Name"
              value={data.valuerName}
              onChange={(v) => update("valuerName", v)}
              placeholder="Goldiam Jewellers"
            />
          </div>
        </>
      }
      previewContent={<ValuationTemplate data={data} />}
    />
  );
}
