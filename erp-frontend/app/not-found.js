import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="font-serif text-3xl">Record not found</h1>
        <p className="mt-2 text-ink/55">
          There's no student matching that ID in the database.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-ledger hover:text-ledger-dark underline underline-offset-2"
        >
          Back to dashboard
        </Link>
      </main>
    </>
  );
}
