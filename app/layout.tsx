import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Urbanist } from 'next/font/google';
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/Nav";
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
