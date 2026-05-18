import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xadxdkbdwyulprfukrjb.supabase.co",
  "sb_publishable_xdfjlB6s9sGF3imO0S-l-A_WW1CjdVh"
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://phonesai.pk";

  const { data: phones } = await supabase
    .from("phones")
    .select("id, created_at")
    .eq("in_stock", true);

  const phoneUrls = (phones ?? []).map((phone) => ({
    url: `${baseUrl}/shop/${phone.id}`,
    lastModified: new Date(phone.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/warranty`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...phoneUrls,
  ];
}
