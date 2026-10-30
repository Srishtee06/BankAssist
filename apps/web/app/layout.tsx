import type { Metadata } from "next";
import "./globals.css";
import { BankingHeaderFooter } from "@/components/layout/BankingHeaderFooter";

export const metadata: Metadata = {
  title: "Apex Trust Bank — Banking Services & Intelligent Information Guide",
  description: "Official banking information portal. Understand savings accounts, loan EMI schedules, tariff charges, digital payment guidelines, and statutory policy standards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bank-warmWhite text-bank-textPrimary antialiased">
        <BankingHeaderFooter>{children}</BankingHeaderFooter>
      </body>
    </html>
  );
}
