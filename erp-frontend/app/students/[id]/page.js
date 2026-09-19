import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { getStudentById } from "@/lib/data";

function ScoreBar({ label, value }) {
  const color = value >= 75 ? "bg-ledger" : value >= 50 ? "bg-brass" : "bg-brick";
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm text-ink/60">{label}</span>
        <span className="tabular font-serif text-lg">{value}</span>
      </div>
      <div className="h-2 bg-ledger-light">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-ink/45">{label}</div>
      <div className="mt-0.5 text-ink">{value}</div>
    </div>
  );
}

export default function StudentDetailPage({ params }) {
  const student = getStudentById(params.id);
  if (!student) notFound();

  const standing =
    student.overallAvg >= 75
      ? "Strong standing"
      : student.overallAvg >= 50
      ? "Meeting expectations"
      : "Needs support";

  const standingColor =
    student.overallAvg >= 75
      ? "text-ledger"
      : student.overallAvg >= 50
      ? "text-brass"
      : "text-brick";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-8">
        <Link
          href="/"
          className="text-sm text-ledger hover:text-ledger-dark underline underline-offset-2"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-6 flex items-start justify-between border-b border-line pb-6">
          <div>
            <h1 className="font-serif text-3xl">{student.name}</h1>
            <p className="mt-1 tabular text-ink/50">{student.id}</p>
          </div>
          <div className="text-right">
            <div className={`font-serif text-3xl tabular ${standingColor}`}>
              {student.overallAvg.toFixed(2)}%
            </div>
            <div className={`text-sm ${standingColor}`}>{standing}</div>
          </div>
        </div>

        <section className="py-8 border-b border-line">
          <h2 className="font-serif text-xl mb-5">Assessment scores</h2>
          <div className="space-y-4 max-w-md">
            <ScoreBar label="Math" value={student.math} />
            <ScoreBar label="Reading" value={student.reading} />
            <ScoreBar label="Writing" value={student.writing} />
          </div>
        </section>

        <section className="py-8">
          <h2 className="font-serif text-xl mb-5">Student profile</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <Field label="Gender" value={student.gender} />
            <Field label="Race/ethnicity group" value={student.group} />
            <Field label="Parental education" value={student.parentalEducation} />
            <Field label="Lunch" value={student.lunch} />
            <Field
              label="Test prep"
              value={student.testPrep === "completed" ? "Completed" : "Not completed"}
            />
          </div>
        </section>
      </main>
    </>
  );
}

export function generateMetadata({ params }) {
  const student = getStudentById(params.id);
  return { title: student ? `${student.name} — ERP Academic Suite` : "Student not found" };
}
