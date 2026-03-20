"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ConfigPreset } from "@/lib/latenode-configs";
import { ConfigCodeBlock } from "./ConfigCodeBlock";

declare global {
  interface Window {
    LatenodeEmbeddedSDK: new () => LatenodeSDK;
    latenodeSdk?: LatenodeSDK;
  }
}

export interface LatenodeSDK {
  configure(config: Record<string, unknown>): Promise<void>;
  cleanup(): void;
  navigate(opts: { to: string }): void;
  createEmptyScenario(title?: string): Promise<void>;
  save(): Promise<void>;
  deploy(): Promise<void>;
  runOnce(): Promise<void>;
}

const SDK_URL = "https://embedded.latenode.com/static/sdk/0.1.5.js";

interface Props {
  preset: ConfigPreset;
  showAutomationControls?: boolean;
  sideMenu?: (sdk: LatenodeSDK | null) => React.ReactNode;
  initialRoute?: string;
  hideHeader?: boolean;
}

export function LatenodeEditor({ preset, showAutomationControls, sideMenu, initialRoute, hideHeader }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sdkRef = useRef<LatenodeSDK | null>(null);
  const abortedRef = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [setupRequired, setSetupRequired] = useState(false);
  const [missingVars, setMissingVars] = useState<string[]>([]);

  const init = useCallback(async () => {
    try {
      setStatus("loading");

      const tokenRes = await fetch("/api/latenode/token", {
        method: "POST",
        credentials: "include",
      });

      if (abortedRef.current) return;

      if (!tokenRes.ok) {
        const body = await tokenRes.json().catch(() => ({}));
        if (body.setupRequired) {
          setSetupRequired(true);
          setMissingVars(body.missing ?? []);
        }
        throw new Error(body.error || `Token request failed (${tokenRes.status})`);
      }

      const { token } = await tokenRes.json();

      if (!document.querySelector(`script[src="${SDK_URL}"]`)) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = SDK_URL;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Latenode SDK"));
          document.head.appendChild(script);
        });
      }

      if (abortedRef.current) return;

      const container = document.getElementById("latenode-embed");
      if (container) container.innerHTML = "";

      const sdk = new window.LatenodeEmbeddedSDK();
      sdkRef.current = sdk;
      window.latenodeSdk = sdk;

      const containerId = "latenode-embed";

      await sdk.configure({
        ...preset.config,
        token,
        container: containerId,
      });

      if (initialRoute) {
        sdk.navigate({ to: initialRoute });
      }

      if (abortedRef.current) {
        sdk.cleanup();
        return;
      }

      setStatus("ready");
    } catch (err) {
      if (abortedRef.current) return;
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }, [preset, initialRoute]);

  useEffect(() => {
    abortedRef.current = false;
    init();

    return () => {
      abortedRef.current = true;
      sdkRef.current?.cleanup();
      sdkRef.current = null;
      delete window.latenodeSdk;
    };
  }, [init]);

  const handleAction = async (action: string) => {
    const sdk = sdkRef.current;
    if (!sdk) return;

    try {
      switch (action) {
        case "create":
          await sdk.createEmptyScenario("New automation");
          break;
        case "save":
          await sdk.save();
          break;
        case "deploy":
          await sdk.deploy();
          break;
        case "run":
          await sdk.runOnce();
          break;
      }
    } catch (err) {
      console.error(`SDK action "${action}" failed:`, err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {!hideHeader && (
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-semibold text-gray-900">{preset.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{preset.description}</p>
          <ConfigCodeBlock code={preset.codeString} />
        </div>
      )}

      {showAutomationControls && status === "ready" && (
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex gap-2 flex-wrap">
          <button
            onClick={() => handleAction("create")}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Create Scenario
          </button>
          <button
            onClick={() => handleAction("save")}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => handleAction("deploy")}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Deploy
          </button>
          <button
            onClick={() => handleAction("run")}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors"
          >
            Run Once
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0 flex">
        {sideMenu && sideMenu(sdkRef.current)}
        <div className="flex-1 relative min-h-0">
          {status === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                <p className="text-sm text-gray-500">
                  Initializing Latenode editor...
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 p-8">
              {setupRequired ? (
                <div className="max-w-md w-full">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                        <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Setup Required</h3>
                    </div>

                    {missingVars.length > 0 && (
                      <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-4">
                        <p className="text-sm font-medium text-amber-800">
                          Missing environment variable{missingVars.length > 1 ? "s" : ""}:
                        </p>
                        <ul className="mt-1 space-y-0.5">
                          {missingVars.map((v) => (
                            <li key={v} className="text-sm text-amber-700">
                              <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">{v}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <ol className="space-y-2 text-sm text-gray-700">
                      <li className="flex gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">1</span>
                        <div>
                          Copy the example env file:
                          <code className="mt-1 block rounded-md bg-gray-900 px-3 py-2 text-xs text-gray-100 font-mono">cp .env.example .env</code>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">2</span>
                        <span>Edit <code className="bg-gray-100 px-1 rounded text-xs font-mono">.env</code> and fill in your Latenode credentials</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">3</span>
                        <span>Restart the dev server</span>
                      </li>
                    </ol>

                    <div className="mt-4 flex gap-3 text-sm">
                      <a
                        href="https://github.com/latenode-com/embedded-demo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        View README
                      </a>
                      <a
                        href="https://documentation.latenode.com/white-label"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
                      >
                        Latenode Docs
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-md text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Failed to load editor
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">{errorMsg}</p>
                  <button
                    onClick={init}
                    className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          )}

          <div
            id="latenode-embed"
            ref={containerRef}
            className="w-full h-full"
            style={{ minHeight: "500px" }}
          />
        </div>
      </div>
    </div>
  );
}
