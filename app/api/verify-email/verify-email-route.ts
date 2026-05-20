import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  "https://xadxdkbdwyulprfukrjb.supabase.co",
  process.env.SUPABASE_SERVICE_KEY ?? "sb_publishable_xdfjlB6s9sGF3imO0S-l-A_WW1CjdVh"
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect("https://phonesai.pk/verify-email?status=invalid");
  }

  const { data, error } = await supabase
    .from("customer_leads")
    .select("id, email, verified")
    .eq("token", token)
    .single();

  if (error || !data) {
    return NextResponse.redirect("https://phonesai.pk/verify-email?status=invalid");
  }

  if (data.verified) {
    return NextResponse.redirect("https://phonesai.pk/verify-email?status=already");
  }

  await supabase
    .from("customer_leads")
    .update({ verified: true })
    .eq("token", token);

  return NextResponse.redirect("https://phonesai.pk/verify-email?status=success");
}