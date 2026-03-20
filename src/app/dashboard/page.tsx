import Link from "next/link";
import { getSession } from "@/lib/auth";

const DEMO_CARDS = [
  {
    href: "/dashboard/templates",
    title: "Templates",
    description: "Browse shared scenario templates to get started quickly.",
    color: "bg-indigo-50 text-indigo-700",
  },
  {
    href: "/dashboard/full-embed",
    title: "Full Embed",
    description: "Default embed with all features visible — zero customization.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    href: "/dashboard/minimal-embed",
    title: "Minimal Embed",
    description: "Stripped-down embed for a focused, integrated feel.",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    href: "/dashboard/custom-menu",
    title: "Custom Menu",
    description: "Hide native menu and replace it with your own styled navigation.",
    color: "bg-teal-50 text-teal-700",
  },
  {
    href: "/dashboard/custom-theme",
    title: "Custom Theme",
    description: "Custom colors, fonts, and border radius to match your brand.",
    color: "bg-purple-50 text-purple-700",
  },
  {
    href: "/dashboard/translations",
    title: "Translations",
    description: "Language and string overrides to localize the editor.",
    color: "bg-amber-50 text-amber-700",
  },
  {
    href: "/dashboard/sdk-automation",
    title: "SDK Automation",
    description: "Programmatic control: create, save, deploy from your app.",
    color: "bg-rose-50 text-rose-700",
  },
  {
    href: "/dashboard/clone-template",
    title: "Clone Template",
    description: "Trigger a clone-template action from a host-app button.",
    color: "bg-cyan-50 text-cyan-700",
  },
];

export default async function DashboardOverview() {
  const session = await getSession();
  const userName = session?.user.name ?? "there";

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome, {userName}
      </h1>
      <p className="mt-2 text-gray-500">
        This demo showcases different ways to embed the Latenode workflow editor
        using the white-label SDK. Explore each configuration below.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEMO_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div
              className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${card.color}`}
            >
              {card.title}
            </div>
            <p className="mt-3 text-sm text-gray-500">{card.description}</p>
          </Link>
        ))}
      </div>

      <a
        href="https://documentation.latenode.com/white-label"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-5 hover:bg-blue-100 hover:border-blue-300 transition-all group"
      >
        <span className="text-2xl">📖</span>
        <div>
          <p className="text-base font-semibold text-blue-800 group-hover:underline">
            White Label Documentation
          </p>
          <p className="text-sm text-blue-600">
            documentation.latenode.com/white-label
          </p>
        </div>
        <span className="ml-auto text-blue-400 text-lg">↗</span>
      </a>

      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">
          How it works
        </h2>
        <ol className="mt-3 space-y-2 text-sm text-gray-500 list-decimal list-inside">
          <li>Your app authenticates the user (email + password in this demo).</li>
          <li>The backend signs a short-lived Latenode JWT for the authenticated user.</li>
          <li>The frontend loads the Latenode Embedded SDK and calls <code className="bg-gray-100 px-1 rounded text-gray-700">sdk.configure()</code> with the JWT.</li>
          <li>The editor renders inside an iframe with the specified configuration.</li>
        </ol>
      </div>
    </div>
  );
}
