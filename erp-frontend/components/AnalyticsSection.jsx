import { getClassBreakdown, getSubjectDistribution } from "@/lib/data";

function ClassBreakdown() {
  const data = getClassBreakdown();
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div>
      <h3 className="font-serif text-lg mb-4">Average by group</h3>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.group} className="flex items-center gap-3">
            <div className="w-20 text-sm text-ink/60">{d.group}</div>
            <div className="flex-1 h-5 bg-ledger-light relative">
              <div
                className="h-full bg-ledger"
                style={{ width: `${(d.count / max) * 100}%` }}
              />
            </div>
            <div className="w-24 text-right text-sm tabular text-ink/70">
              {d.count} students
            </div>
            <div className="w-16 text-right text-sm tabular font-medium">
              {d.avg}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreDistribution() {
  const data = getSubjectDistribution();
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div>
      <h3 className="font-serif text-lg mb-4">Overall average distribution</h3>
      <div className="flex items-end gap-4 h-40 border-b border-line pb-1">
        {data.map((d) => (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
            <div className="text-xs tabular text-ink/60">{d.count}</div>
            <div
              className="w-full bg-brass"
              style={{ height: `${(d.count / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-2">
        {data.map((d) => (
          <div key={d.label} className="flex-1 text-center text-xs text-ink/50">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsSection() {
  return (
    <section className="py-10">
      <h2 className="font-serif text-2xl mb-6">Academic performance analytics</h2>
      <div className="grid md:grid-cols-2 gap-10">
        <ClassBreakdown />
        <ScoreDistribution />
      </div>
    </section>
  );
}
