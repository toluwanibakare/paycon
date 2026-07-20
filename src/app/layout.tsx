import type { Metadata } from "next";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Providers } from "./providers";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
