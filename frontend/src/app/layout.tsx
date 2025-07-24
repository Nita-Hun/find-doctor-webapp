import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Inter } from 'next/font/google';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
//const geistSans = Inter({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Find Doctor",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
