import SiteHeader from "@/components/SiteHeader";
import StatRow from "@/components/StatRow";
import AnalyticsSection from "@/components/AnalyticsSection";
import StudentDirectory from "@/components/StudentDirectory";
import { getSummary } from "@/lib/data";

export default function DashboardPage() {
  const summary = getSummary();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6">
        <div className="py-8">
          <h1 className="font-serif text-3xl">Student performance dashboard</h1>
          <p className="mt-1 text-ink/55">
            Academic assessment analytics and student performance records.
          </p>
        </div>
        <StatRow summary={summary} />
        <AnalyticsSection />
        <StudentDirectory />
      </main>
      <footer className="border-t border-line mt-4">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-ink/40">
          ERP Academic Suite — Fall Term 2026
        </div>
      </footer>
    </>
  );
}
