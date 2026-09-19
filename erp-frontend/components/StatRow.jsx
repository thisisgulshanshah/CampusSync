function Cell({ label, value, suffix = "", emphasis = false }) {
  return (
    <div className="flex-1 px-6 py-5 first:pl-0 last:pr-0">
      <div className="text-xs uppercase tracking-wide text-ink/45">{label}</div>
      <div
        className={`mt-1 font-serif tabular text-3xl ${
          emphasis ? "text-ledger" : "text-ink"
        }`}
      >
        {value}
        <span className="text-lg text-ink/50">{suffix}</span>
      </div>
    </div>
  );
}

export default function StatRow({ summary }) {
  return (
    <div className="flex flex-wrap divide-x divide-line border-y border-line">
      <Cell label="Total students" value={summary.totalStudents.toLocaleString()} />
      <Cell label="Avg math" value={summary.avgMath} />
      <Cell label="Avg reading" value={summary.avgReading} />
      <Cell label="Avg writing" value={summary.avgWriting} />
      <Cell label="Overall average" value={summary.overallAvg} suffix="%" emphasis />
    </div>
  );
}
