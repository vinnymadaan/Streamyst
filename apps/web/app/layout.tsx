import './globals.css';

import type { Metadata } from 'next';

import { Inter, Space_Grotesk } from 'next/font/google';

import { TRPCProvider } from '@/providers/trpc-provider';

import { ThemeProvider } from '@/providers/theme-provider';

import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'Streamyst',
  description: 'Modern form infrastructure for teams and creators.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
    lang="en" 
    suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider>
          <TRPCProvider>{children}</TRPCProvider>
        </ThemeProvider>

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
