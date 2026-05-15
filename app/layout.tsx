import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalShopkeeper from "./components/GlobalShopkeeper";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { CartProvider } from "./components/CartContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PhonesAI | Pakistan's Smartest iPhone Store",
  description:
    "Buy verified iPhones in Pakistan — PTA Approved, Non-PTA, and JV. AI-powered shopping with Ustaad Ji. 7-day warranty. Based in Wah Cantt. Delivering all over Pakistan.",
  keywords:
    "iPhone Pakistan, PTA approved iPhone, JV iPhone, Non-PTA iPhone, buy iPhone online Pakistan, iPhone Wah Cantt, iPhone Islamabad, PhonesAI",
  openGraph: {
    title: "PhonesAI | Pakistan's Smartest iPhone Store",
    description:
      "Buy verified iPhones in Pakistan — PTA Approved, Non-PTA, and JV. AI-powered shopping with Ustaad Ji. 7-day warranty.",
    url: "https://phonesai.pk",
    siteName: "PhonesAI",
    locale: "en_PK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <GlobalShopkeeper />
        </CartProvider>
      </body>
    </html>
  );
}