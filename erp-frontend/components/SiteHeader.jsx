import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-baseline justify-between">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-serif text-xl font-semibold tracking-tight">
            ERP Academic Suite
          </span>
          <span className="hidden sm:inline text-sm text-ink/50">
            Student Performance Dashboard
          </span>
        </Link>
        <nav className="text-sm text-ink/60">
          <span className="tabular">Fall Term 2026</span>
        </nav>
      </div>
    </header>
  );
}
