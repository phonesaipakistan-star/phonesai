import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalShopkeeper from "./components/GlobalShopkeeper";
import EmailPopup from "./components/EmailPopup";
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
  title: "PhonesAI | Buy iPhone & Samsung in Pakistan — PTA, Non-PTA, JV",
  description:
    "Pakistan ka #1 trusted phone store. Buy verified iPhones (PTA, Non-PTA, JV) and Samsung Galaxy S Ultra in Islamabad, Rawalpindi, Wah Cantt. 7-day warranty, free delivery, AI-powered shopping with Ustaad Ji.",
  keywords:
    "iPhone Pakistan, PTA approved iPhone, JV iPhone Pakistan, Non-PTA iPhone, buy iPhone online Pakistan, iPhone Islamabad, iPhone Rawalpindi, iPhone Wah Cantt, Samsung Galaxy S25 Ultra Pakistan, Samsung S24 Ultra price Pakistan, iPhone 16 Pro Max Pakistan, iPhone 17 Pro Max Pakistan, iPhone 15 Pro Pakistan, used iPhone Pakistan, new iPhone Pakistan, PhonesAI, verified iPhone Pakistan, 7 day warranty iPhone",
  authors: [{ name: "PhonesAI", url: "https://phonesai.pk" }],
  creator: "PhonesAI",
  publisher: "PhonesAI",
  metadataBase: new URL("https://phonesai.pk"),
  alternates: {
    canonical: "https://phonesai.pk",
  },
  openGraph: {
    title: "PhonesAI | Buy iPhone & Samsung in Pakistan — PTA, Non-PTA, JV",
    description:
      "Pakistan ka #1 trusted phone store. Verified iPhones aur Samsung — PTA, Non-PTA, JV. 7-day warranty. Free delivery all Pakistan. Wah Cantt based.",
    url: "https://phonesai.pk",
    siteName: "PhonesAI",
    locale: "en_PK",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PhonesAI — Buy Verified iPhones in Pakistan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PhonesAI | Buy iPhone & Samsung in Pakistan",
    description:
      "Verified iPhones & Samsung — PTA, Non-PTA, JV. 7-day warranty. Free delivery all Pakistan.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "add-your-google-search-console-verification-here",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "PhonesAI",
              description:
                "Pakistan ka trusted premium phone store — verified iPhones, Samsung flagships, iPads with 7-day warranty.",
              url: "https://phonesai.pk",
              telephone: "+923001234567",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Wah Cantt",
                addressRegion: "Punjab",
                addressCountry: "PK",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "33.7665",
                longitude: "72.7516",
              },
              openingHours: "Mo-Sa 10:00-20:00",
              priceRange: "PKR 50,000 - PKR 500,000",
              sameAs: ["https://phonesai.pk"],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Phones & Accessories",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "PTA Approved iPhones Pakistan",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Non-PTA iPhones Pakistan",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "JV iPhones Pakistan",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Samsung Galaxy S Ultra Pakistan",
                    },
                  },
                ],
              },
            }),
          }}
        />
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <GlobalShopkeeper />
          <EmailPopup />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}