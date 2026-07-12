import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "Paycon | Group Savings on Celo",
  description:
    "AI-powered group savings on the Celo blockchain. Run Ajo savings circles, goal pools, and emergency funds with your agent.",
  openGraph: {
    title: "Paycon | Group Savings on Celo",
    description:
      "AI-powered group savings on the Celo blockchain. Run Ajo savings circles, goal pools, and emergency funds with your agent.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
