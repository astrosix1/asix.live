import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { NavbarWithModal } from "@/components/NavbarWithModal";
import { Footer } from "@/components/Footer";
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
  title: "Asix — Habit Tracking, Geopolitical Intelligence, and More",
  description: "Asix builds tools that help you think clearly and act decisively. Home of Ascend (habit tracker), GeoIntel (geopolitical intelligence), and WikiHole.",
  metadataBase: new URL("https://asix.live"),
  openGraph: {
    title: "Asix — Habit Tracking, Geopolitical Intelligence, and More",
    description: "Asix builds tools that help you think clearly and act decisively. Home of Ascend (habit tracker), GeoIntel (geopolitical intelligence), and WikiHole.",
    url: "https://asix.live",
    siteName: "Asix",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asix — Habit Tracking, Geopolitical Intelligence, and More",
    description: "Asix builds tools that help you think clearly and act decisively. Home of Ascend, GeoIntel, and WikiHole.",
  },
  alternates: {
    canonical: "https://asix.live",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projectSubdomain = await getProjectSubdomain();
  const showNavbar = !projectSubdomain; // Hide navbar for project subdomains

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {showNavbar && <NavbarWithModal />}
          <main className="flex-1">{children}</main>
          {showNavbar && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
