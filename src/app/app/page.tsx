"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/browser";
import { Plan } from "@/lib/schemas";
import PlanView from "@/components/PlanView";
import NavBar from "@/components/NavBar";

export default function GeneratePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [syllabus, setSyllabus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState(8);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSupabase()
      .auth.getSession()
      .then(({ data }) => {
        if (!data.session) router.replace("/");
        else setCheckingAuth(false);
      })
      .catch(() => router.replace("/"));
  }, [router]);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setPlan(null);
    setSaved(false);
    try {
      const { data } = await getSupabase().auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        router.replace("/");
        return;
      }
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          syllabus,
          startDate: startDate || undefined,
          hoursPerWeek,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setPlan(json.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function savePlan() {
    if (!plan) return;
    setError(null);
    try {
      const supabase = getSupabase();
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error("Sign in required.");
      const { error: insertError } = await supabase.from("plans").insert({
        user_id: data.user.id,
        title: plan.courseTitle,
        plan_json: plan,
      });
      if (insertError) throw insertError;
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the plan.");
    }
  }

  if (checkingAuth) {
    return <p className="p-8 text-center text-slate-500">Loading…</p>;
  }

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold">Generate a study plan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Paste your syllabus below — plan appears in under a minute.
        </p>

        <form onSubmit={generate} className="mt-6 space-y-4">
          <textarea
            required
            value={syllabus}
            onChange={(e) => setSyllabus(e.target.value)}
            placeholder="Paste your full course syllabus here (schedule, topics, assignments, exams)…"
            rows={10}
            maxLength={20000}
            className="w-full rounded-xl border border-slate-300 p-4 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <div className="flex flex-wrap gap-4">
            <label className="text-sm font-medium text-slate-700">
              Term start date
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Study hours / week
              <input
                type="number"
                min={1}
                max={60}
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="mt-1 block w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {busy ? "Generating…" : "Generate plan"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
        )}

        {plan && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your plan</h2>
              <button
                onClick={savePlan}
                disabled={saved}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {saved ? "Saved ✓" : "Save plan"}
              </button>
            </div>
            <PlanView plan={plan} />
          </div>
        )}
      </main>
    </>
  );
}
