"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Phone = {
  id: string | number;
  model: string | null;
  storage: string | null;
  color: string | null;
  category: string | null;
  price: number | string | null;
  battery_health: number | string | null;
};

export default function TestPage() {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhones = async () => {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase.from("phones").select("*");

      if (queryError) {
        setError(queryError.message);
        setPhones([]);
      } else {
        setPhones((data ?? []) as Phone[]);
      }

      setLoading(false);
    };

    fetchPhones();
  }, []);

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-3xl font-bold tracking-tight">Supabase Connection Test</h1>
        <p className="mt-2 text-white/70">Table: phones</p>

        {loading && <p className="mt-8 text-white/80">Loading phones...</p>}

        {error && (
          <div className="mt-8 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-red-200">
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {phones.length === 0 ? (
              <p className="text-white/80">No phones found.</p>
            ) : (
              phones.map((phone) => (
                <article
                  key={phone.id}
                  className="rounded-xl border border-white/15 bg-white/[0.03] p-4"
                >
                  <p>
                    <span className="text-white/60">Model:</span> {phone.model ?? "-"}
                  </p>
                  <p>
                    <span className="text-white/60">Storage:</span> {phone.storage ?? "-"}
                  </p>
                  <p>
                    <span className="text-white/60">Color:</span> {phone.color ?? "-"}
                  </p>
                  <p>
                    <span className="text-white/60">Category:</span> {phone.category ?? "-"}
                  </p>
                  <p>
                    <span className="text-white/60">Price:</span> {phone.price ?? "-"}
                  </p>
                  <p>
                    <span className="text-white/60">Battery Health:</span>{" "}
                    {phone.battery_health ?? "-"}
                  </p>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
