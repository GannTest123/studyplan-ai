"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/browser";

export default function NavBar() {
  const router = useRouter();

  async function signOut() {
    await getSupabase().auth.signOut();
    router.push("/");
  }

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/app" className="font-bold text-indigo-700">
          StudyPlan AI
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/app" className="text-slate-600 hover:text-slate-900">
            New plan
          </Link>
          <Link href="/app/plans" className="text-slate-600 hover:text-slate-900">
            My plans
          </Link>
          <button onClick={signOut} className="text-slate-400 hover:text-slate-700">
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
