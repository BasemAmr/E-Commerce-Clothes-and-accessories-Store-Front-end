import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Urbanist } from 'next/font/google';
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/Nav";

// Force dynamic rendering for the entire app because the Navbar fetches categories on every request.
// Without this, Next.js tries to statically prerender special pages like /_not-found, which fail
// when the API server isn't running during build time.
export const dynamic = 'force-dynamic';

const font = Urbanist({
  subsets: ["latin"],
})
// ecommerce shop
export const metadata: Metadata = {
  title: "Ecommerce Shop",
  description: "An ecommerce shop built with Next.js and Stripe",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ font.className }`}
      >
        <Navbar />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
