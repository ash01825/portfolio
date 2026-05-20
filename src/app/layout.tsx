import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'arsh',
  description: 'junior cs grad',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
