"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export function ConfigCodeBlock({ code }: { code: string }) {
  const [open, setOpen] = useState(false);

  return (
    <details
      className="mt-3"
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700 select-none">
        {open ? "Hide" : "Show"} SDK configuration code
      </summary>
      <SyntaxHighlighter
        language="javascript"
        style={vscDarkPlus}
        customStyle={{
          marginTop: "0.5rem",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          overflowX: "auto",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </details>
  );
}
