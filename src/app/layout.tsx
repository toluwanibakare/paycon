import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paycon — DeFAI Group Savings",
  description:
    "AI-powered group savings on Celo. Ajo, goal pools, and emergency funds — managed by your agent.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
