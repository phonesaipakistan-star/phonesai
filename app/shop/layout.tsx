import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop iPhones & Samsung in Pakistan | PhonesAI",
  description:
    "Browse verified iPhones (PTA, Non-PTA, JV), Samsung Galaxy S Ultra, iPads and accessories. Best prices in Pakistan. Free delivery. 7-day warranty. Wah Cantt.",
  alternates: {
    canonical: "https://phonesai.pk/shop",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
