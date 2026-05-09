import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeafLMS - Library Management System",
  description: "A modern, premium library management system for students and librarians.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
