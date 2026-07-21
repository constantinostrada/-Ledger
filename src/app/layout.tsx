import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ledger - Financial Transaction Management',
  description: 'A clean architecture financial ledger application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
