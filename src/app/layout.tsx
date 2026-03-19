import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acme App — Workflow Automation",
  description:
    "Embedded Latenode white-label demo showcasing workflow automation integration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}
