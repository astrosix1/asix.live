import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { getProjectSubdomain } from "@/lib/subdomain";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "asixstud - Project Portfolio",
  description: "A collection of projects showcasing web development, design, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projectSubdomain = getProjectSubdomain();
  const showNavbar = !projectSubdomain; // Hide navbar for project subdomains

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {showNavbar && <Navbar />}
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
