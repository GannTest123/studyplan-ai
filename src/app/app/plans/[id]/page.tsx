"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/browser";
import { Plan, PlanSchema } from "@/lib/schemas";
import PlanView from "@/components/PlanView";
import NavBar from "@/components/NavBar";

export default function PlanDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("/");
        return;
      }
      const { data: row, error: qError } = await supabase
        .from("plans")
        .select("plan_json")
        .eq("id", params.id)
        .single();
      if (qError) {
        setError("Plan not found.");
        return;
      }
      const parsed = PlanSchema.safeParse(row.plan_json);
      if (parsed.success) setPlan(parsed.data);
      else setError("This plan could not be loaded.");
    });
  }, [params.id, router]);

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {error && (
          <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
        )}
        {!plan && !error && <p className="text-slate-500">Loading…</p>}
        {plan && <PlanView plan={plan} />}
      </main>
    </>
  );
}
