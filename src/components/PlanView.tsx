import type { Plan } from "@/lib/schemas";

export default function PlanView({ plan }: { plan: Plan }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold">{plan.courseTitle}</h2>
        <p className="text-sm text-slate-500">{plan.totalWeeks}-week study plan</p>
      </div>

      <ol className="space-y-3">
        {plan.weeks.map((w) => (
          <li key={w.week} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold">
                Week {w.week}
                <span className="ml-2 text-sm font-normal text-slate-500">{w.dateRange}</span>
              </h3>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                ~{w.studyHours}h study
              </span>
            </div>

            {w.milestone && (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
                ⚑ {w.milestone}
              </p>
            )}

            {w.topics.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Topics</p>
                <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
                  {w.topics.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            {w.deliverables.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Due</p>
                <ul className="mt-1 list-inside list-disc text-sm text-rose-700">
                  {w.deliverables.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ol>

      {plan.tips.length > 0 && (
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="font-semibold">Study tips</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
            {plan.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
