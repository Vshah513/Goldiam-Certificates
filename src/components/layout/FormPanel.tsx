"use client";

import { ReactNode, useRef, useState, forwardRef } from "react";

interface FormPanelProps {
  formContent: ReactNode;
  previewContent: ReactNode;
  actionButtons?: ReactNode;
}

const FormPanel = forwardRef<HTMLDivElement, FormPanelProps>(
  function FormPanel({ formContent, previewContent, actionButtons }, ref) {
    const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

    return (
      <div className="min-h-screen flex flex-col">
        {/* Mobile tab bar */}
        <div className="lg:hidden no-print flex border-b border-dark/10 bg-white sticky top-0 z-20">
          <button
            onClick={() => setActiveTab("form")}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
              activeTab === "form"
                ? "text-gold border-b-2 border-gold"
                : "text-muted"
            }`}
          >
            Form
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
              activeTab === "preview"
                ? "text-gold border-b-2 border-gold"
                : "text-muted"
            }`}
          >
            Preview
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Form panel */}
          <div
            className={`lg:w-[40%] xl:w-[38%] overflow-y-auto bg-ivory no-print ${
              activeTab === "form" ? "block" : "hidden lg:block"
            }`}
          >
            <div className="p-5 sm:p-6 space-y-5">{formContent}</div>
          </div>

          {/* Vertical divider (desktop) */}
          <div className="hidden lg:block w-px bg-dark/10 no-print" />

          {/* Preview panel */}
          <div
            className={`flex-1 overflow-y-auto bg-[#e8e5e0] ${
              activeTab === "preview" ? "block" : "hidden lg:block"
            }`}
          >
            {/* Action buttons */}
            {actionButtons && (
              <div className="sticky top-0 z-10 no-print bg-[#e8e5e0]/80 backdrop-blur-sm border-b border-dark/5 px-6 py-3 flex items-center gap-3 justify-end">
                {actionButtons}
              </div>
            )}

            {/* Certificate preview */}
            <div className="p-6 sm:p-8 flex justify-center">
              <div
                ref={ref}
                className="w-full max-w-[595px] shadow-2xl"
              >
                {previewContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default FormPanel;
