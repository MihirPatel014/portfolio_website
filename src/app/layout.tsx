import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../index.css';
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Mihir's Portfolio",
  description: 'Portfolio website of Mihir Patel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <main>
                {children}
            </main>

            <footer className="mt-20 border-t border-border py-10 bg-muted/30">
                <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Mihir. All rights reserved.</p>
                </div>
            </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
