import Link from "next/link";

const FEATURES = [
  {
    title: "Visual Workflow Builder",
    description:
      "Drag-and-drop editor for building automation workflows without writing code.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
  {
    title: "Seamless Embedding",
    description:
      "Embed the automation platform directly into your app with a few lines of code.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: "Full Customization",
    description:
      "Theme, brand, and translate the editor to match your product's identity.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    step: "1",
    title: "Sign Up",
    description: "Create an account in seconds.",
  },
  {
    step: "2",
    title: "Open the Editor",
    description: "Access the embedded workflow builder.",
  },
  {
    step: "3",
    title: "Build & Deploy",
    description: "Create automations and deploy them instantly.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-gray-900">Acme App</span>
            <span className="text-xs text-gray-400 font-normal">your SaaS</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/latenode-com/embedded-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Demo Notice Banner */}
      <div className="bg-blue-50 border-b border-blue-100 px-6 py-3">
        <p className="text-center text-sm text-blue-700">
          This is a live demo showing how to embed the{" "}
          <a
            href="https://latenode.com/embedded-ipaas"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2 hover:text-blue-900"
          >
            Latenode.com
          </a>{" "}
          workflow builder into your own SaaS application.
        </p>
      </div>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            <a
              href="https://latenode.com/embedded-ipaas"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              Latenode.com
            </a>{" "}
            Workflow Automation,
            <br />
            <span className="text-blue-600">Built Into Your App</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
            This demo shows what it looks like when you embed Latenode&apos;s workflow
            automation editor directly into your product — sign up to explore
            the full embedded experience.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Log In
            </Link>
          </div>

          {/* YouTube Video */}
          <div className="mt-14 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 aspect-video w-full">
            <iframe
              src="https://www.youtube.com/embed/AOpV7CBJGFs"
              title="Latenode Embedded iPaaS Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Latenode Link */}
          <div className="mt-10">
            <a
              href="https://latenode.com/embedded-ipaas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
            >
              Explore Latenode Embedded iPaaS
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Everything You Need
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            How It Works
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold">
                  {s.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-400">
            Acme App (your SaaS) — Latenode Embedded iPaaS Demo
          </span>
          <div className="flex items-center gap-6">
            <a
              href="https://documentation.latenode.com/white-label"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Latenode Docs ↗
            </a>
            <a
              href="https://github.com/latenode-com/embedded-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
