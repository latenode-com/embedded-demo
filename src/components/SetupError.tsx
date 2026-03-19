interface SetupErrorProps {
  missing: string[];
}

export function SetupError({ missing }: SetupErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
              <svg
                className="h-5 w-5 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Setup Required
            </h2>
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-5">
            <p className="text-sm font-medium text-amber-800">
              Missing environment variable{missing.length > 1 ? "s" : ""}:
            </p>
            <ul className="mt-1 space-y-0.5">
              {missing.map((v) => (
                <li key={v} className="text-sm text-amber-700">
                  <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">
                    {v}
                  </code>
                </li>
              ))}
            </ul>
          </div>

          <ol className="space-y-3 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                1
              </span>
              <div>
                Copy the example env file:
                <code className="mt-1 block rounded-md bg-gray-900 px-3 py-2 text-xs text-gray-100 font-mono">
                  cp .env.example .env
                </code>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                2
              </span>
              <span>
                Edit <code className="bg-gray-100 px-1 rounded text-xs font-mono">.env</code> and
                fill in your values
              </span>
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                3
              </span>
              <span>Restart the dev server</span>
            </li>
          </ol>

          <div className="mt-5 flex gap-3 text-sm">
            <a
              href="https://github.com/latenode-com/embedded-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View README
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
            <a
              href="https://documentation.latenode.com/white-label"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Latenode Docs
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
