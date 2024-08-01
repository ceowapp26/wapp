import React from 'react';
import { Toaster } from 'sonner';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/providers/theme-provider';
import { GeneralContextProvider } from '@/context/general-context-provider';
import { MyspaceContextProvider } from '@/context/myspace-context-provider';
import { ConvexClientProvider } from '@/providers/convex-provider';
import { GeneralModalProvider } from '@/components/providers/modal-provider';
import { DocumentModalProvider } from '@/components/apps/document/providers/modal-provider';
import { EdgeStoreProvider } from '@/lib/edgestore';
import { ReduxProvider } from '@/redux/ReduxProvider';
import { NextUIProvider } from '@nextui-org/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const client = new ApolloClient({
  uri: process.env.DATABASE_URL || 'https://example.com/graphql', 
  cache: new InMemoryCache(),
});

export const metadata: Metadata = {
  title: 'WApp',
  description: 'The connected workspace where better, faster work happens.',
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
        href: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg",
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <React.StrictMode>
          <ReduxProvider>
            <ConvexClientProvider>
              <EdgeStoreProvider>
                <NextUIProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    storageKey="jotion-theme-2"
                  >
                    <Toaster position="bottom-center" />
                    <GeneralContextProvider>
                      <MyspaceContextProvider>
                        <GeneralModalProvider />
                        <DocumentModalProvider />
                        {children}
                      </MyspaceContextProvider>
                    </GeneralContextProvider>
                  </ThemeProvider>
                </NextUIProvider>
              </EdgeStoreProvider>
            </ConvexClientProvider>
          </ReduxProvider>
        </React.StrictMode>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
