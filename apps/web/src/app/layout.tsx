import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@invitely/ui';
import { TelegramProvider } from '@/providers/telegram-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Invitely',
  description: 'Gözəl rəqəmsal dəvət kartları yaradın',
  other: {
    'telegram:channel': '@invitely_bot',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" suppressHydrationWarning>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider>
          <TelegramProvider>
            {children}
          </TelegramProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
