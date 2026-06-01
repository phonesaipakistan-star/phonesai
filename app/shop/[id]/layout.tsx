import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xadxdkbdwyulprfukrjb.supabase.co",
  "sb_publishable_xdfjlB6s9sGF3imO0S-l-A_WW1CjdVh"
);

type LayoutProps = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { id } = await params;

  const { data: phone } = await supabase
    .from("phones")
    .select("model,storage,color,category,condition,battery_health,images")
    .eq("id", id)
    .single();

  if (!phone) {
    return {
      title: "Phone Not Found | PhonesAI Pakistan",
      description: "Browse verified iPhones and Samsung phones at PhonesAI Pakistan.",
    };
  }

  const title = `${phone.model} ${phone.storage} ${phone.color} — ${phone.category} | PhonesAI Pakistan`;
  const batteryText = phone.battery_health ? `${phone.battery_health}%` : "verified";
  const description = `Buy ${phone.model} in Pakistan. ${phone.category} — ${phone.condition}. Battery health ${batteryText}. 7-day warranty. Free delivery all Pakistan. Verified by Ustaad Ji.`;

  const ogImage = phone.images?.[0] ?? "/og-image.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function ProductLayout({ children }: Pick<LayoutProps, "children">) {
  return children;
}
