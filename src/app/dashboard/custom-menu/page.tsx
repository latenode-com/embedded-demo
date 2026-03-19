"use client";

import { useState, useCallback } from "react";
import { LatenodeEditor } from "@/components/LatenodeEditor";
import type { LatenodeSDK } from "@/components/LatenodeEditor";
import { PRESETS } from "@/lib/latenode-configs";

interface MenuItem {
  id: string;
  label: string;
  route: string;
  icon: React.ReactNode;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "scenarios",
    label: "My Automations",
    route: "/scenarios",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
      </svg>
    ),
  },
  {
    id: "connections",
    label: "Connections",
    route: "/connections",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    ),
  },
];

function CustomSideMenu({ sdk, activeRoute, onNavigate }: {
  sdk: LatenodeSDK | null;
  activeRoute: string;
  onNavigate: (route: string) => void;
}) {
  const handleNav = (route: string) => {
    onNavigate(route);
    sdk?.navigate({ to: route });
  };

  return (
    <div className="w-56 shrink-0 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-700">
      <div className="px-4 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20">
            <svg className="h-4 w-4 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">Workflow Studio</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-1">
        <p className="px-2 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
          Navigate
        </p>
        <ul className="space-y-0.5">
          {MENU_ITEMS.map((item) => {
            const isActive = activeRoute.startsWith(item.route);
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNav(item.route)}
                  disabled={!sdk}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-lg transition-colors disabled:opacity-40 ${
                    isActive
                      ? "bg-slate-700/70 text-white font-medium"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 py-3 border-t border-slate-700/50 space-y-0.5">
        <a
          href="https://documentation.latenode.com/white-label"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
          Documentation
        </a>
        <a
          href="#"
          className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
          Help & Support
        </a>
      </div>
    </div>
  );
}

export default function CustomMenuPage() {
  const [activeRoute, setActiveRoute] = useState("/scenarios");

  const renderSideMenu = useCallback(
    (sdk: LatenodeSDK | null) => (
      <CustomSideMenu
        sdk={sdk}
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
      />
    ),
    [activeRoute]
  );

  return (
    <LatenodeEditor
      preset={PRESETS.customMenu}
      sideMenu={renderSideMenu}
    />
  );
}
