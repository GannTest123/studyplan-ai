"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/browser";
import NavBar from "@/components/NavBar";

type PlanRow = { id: string; title: string; created_at: string };

export default function PlansPage() {
  const router = useRouter();
  const [rows, setRows] = useState<PlanRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("/");
        return;
      }
      const { data: plans, error: qError } = await supabase
        .from("plans")
        .select("id, title, created_at")
        .order("created_at", { ascending: false });
      if (qError) setError(qError.message);
      else setRows(plans ?? []);
    });
  }, [router]);

  async function deletePlan(id: string) {
    const { error: dError } = await getSupabase().from("plans").delete().eq("id", id);
    if (dError) setError(dError.message);
    else setRows((prev) => prev?.filter((r) => r.id !== id) ?? null);
  }

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold">My plans</h1>
        {error && (
          <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
        )}
        {rows === null && !error && <p className="mt-4 text-slate-500">Loading…</p>}
        {rows !== null && rows.length === 0 && (
          <p className="mt-4 text-slate-500">
            No saved plans yet.{" "}
            <Link href="/app" className="text-indigo-600 hover:underline">
              Generate one →
            </Link>
          </p>
        )}
        <ul className="mt-6 space-y-3">
          {rows?.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
            >
              <div>
                <Link
                  href={`/app/plans/${r.id}`}
                  className="font-medium text-indigo-700 hover:underline"
                >
                  {r.title}
                </Link>
                <p className="text-xs text-slate-400">
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => deletePlan(r.id)}
                className="text-sm text-slate-400 hover:text-rose-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
