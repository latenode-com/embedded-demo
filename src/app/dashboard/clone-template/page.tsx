"use client";

import { useState } from "react";
import { LatenodeEditor } from "@/components/LatenodeEditor";
import { ConfigCodeBlock } from "@/components/ConfigCodeBlock";
import { PRESETS } from "@/lib/latenode-configs";

const CLONE_TEMPLATES = [
  { label: "Clone Template #1", templateId: "69bd0f987e78dbcedb7f095f" },
  { label: "Clone Template #2", templateId: "69bd168fa9d944b44456eb33" },
];

export default function CloneTemplatePage() {
  const [revealed, setRevealed] = useState(false);

  const handleClone = (templateId: string) => {
    setRevealed(true);
    window.latenodeSdk?.navigate({
      to: `/run-action?action=clone-template&template-id=${templateId}`,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-semibold text-gray-900">{PRESETS.cloneTemplate.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{PRESETS.cloneTemplate.description}</p>
        <ConfigCodeBlock code={PRESETS.cloneTemplate.codeString} />
      </div>

      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex gap-3 flex-wrap">
        {CLONE_TEMPLATES.map((t) => (
          <button
            key={t.templateId}
            onClick={() => handleClone(t.templateId)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
            </svg>
            {t.label}
          </button>
        ))}
      </div>

      <div className={revealed ? "flex-1 min-h-0" : "hidden"}>
        <LatenodeEditor preset={PRESETS.cloneTemplate} hideHeader />
      </div>
    </div>
  );
}
