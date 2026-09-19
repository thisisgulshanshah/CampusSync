"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getStudents, getFilterOptions } from "@/lib/data";

const PAGE_SIZE = 20;

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-xs uppercase tracking-wide text-ink/45">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-line bg-white px-2 py-1.5 text-sm text-ink focus-visible:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.text}
          </option>
        ))}
      </select>
    </label>
  );
}

function scoreColor(score) {
  if (score >= 75) return "text-ledger";
  if (score >= 50) return "text-ink";
  return "text-brick";
}

export default function StudentDirectory() {
  const { GENDERS, GROUPS, LUNCH, PREP } = useMemo(getFilterOptions, []);
  const [page, setPage] = useState(1);
  const [gender, setGender] = useState("all");
  const [group, setGroup] = useState("all");
  const [lunch, setLunch] = useState("all");
  const [testPrep, setTestPrep] = useState("all");
  const [query, setQuery] = useState("");

  const result = useMemo(
    () =>
      getStudents({
        page,
        pageSize: PAGE_SIZE,
        gender,
        group,
        lunch,
        testPrep,
        query,
      }),
    [page, gender, group, lunch, testPrep, query]
  );

  function updateFilter(setter) {
    return (val) => {
      setter(val);
      setPage(1);
    };
  }

  const { rows, total, totalPages } = result;
  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  return (
    <section className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <h2 className="font-serif text-2xl">Student records</h2>
        <input
          type="search"
          placeholder="Search by name or ID"
          value={query}
          onChange={(e) => updateFilter(setQuery)(e.target.value)}
          className="border border-line bg-white px-3 py-1.5 text-sm w-56 focus-visible:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-line">
        <Select
          label="Gender"
          value={gender}
          onChange={updateFilter(setGender)}
          options={[
            { value: "all", text: "All genders" },
            ...GENDERS.map((g) => ({ value: g, text: g })),
          ]}
        />
        <Select
          label="Group"
          value={group}
          onChange={updateFilter(setGroup)}
          options={[
            { value: "all", text: "All race/ethnicity" },
            ...GROUPS.map((g) => ({ value: g, text: g })),
          ]}
        />
        <Select
          label="Lunch"
          value={lunch}
          onChange={updateFilter(setLunch)}
          options={[
            { value: "all", text: "All lunch types" },
            ...LUNCH.map((g) => ({ value: g, text: g })),
          ]}
        />
        <Select
          label="Test prep"
          value={testPrep}
          onChange={updateFilter(setTestPrep)}
          options={[
            { value: "all", text: "All test prep" },
            ...PREP.map((g) => ({
              value: g,
              text: g === "completed" ? "Prep completed" : "No prep course",
            })),
          ]}
        />
      </div>

      <p className="text-sm text-ink/55 mb-3">
        Showing {start}–{end} of {total.toLocaleString()} filtered students
        (total database records: 1,000).
      </p>

      <div className="overflow-x-auto border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-ledger-light text-left text-xs uppercase tracking-wide text-ink/55">
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">Group</th>
              <th className="px-4 py-3">Parental education</th>
              <th className="px-4 py-3">Lunch</th>
              <th className="px-4 py-3">Test prep</th>
              <th className="px-4 py-3 text-right">Math</th>
              <th className="px-4 py-3 text-right">Reading</th>
              <th className="px-4 py-3 text-right">Writing</th>
              <th className="px-4 py-3 text-right">Overall</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.id}
                className={`border-b border-line last:border-0 ${
                  i % 2 === 1 ? "bg-paper/60" : "bg-white"
                }`}
              >
                <td className="px-4 py-2.5">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-ink/45 tabular">{r.id}</div>
                </td>
                <td className="px-4 py-2.5 text-ink/70">{r.gender}</td>
                <td className="px-4 py-2.5 text-ink/70">{r.group}</td>
                <td className="px-4 py-2.5 text-ink/70">{r.parentalEducation}</td>
                <td className="px-4 py-2.5 text-ink/70">{r.lunch}</td>
                <td className="px-4 py-2.5 text-ink/70">{r.testPrep}</td>
                <td className="px-4 py-2.5 text-right tabular">{r.math}</td>
                <td className="px-4 py-2.5 text-right tabular">{r.reading}</td>
                <td className="px-4 py-2.5 text-right tabular">{r.writing}</td>
                <td
                  className={`px-4 py-2.5 text-right tabular font-medium ${scoreColor(
                    r.overallAvg
                  )}`}
                >
                  {r.overallAvg.toFixed(2)}%
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link
                    href={`/students/${r.id}`}
                    className="text-ledger hover:text-ledger-dark underline underline-offset-2"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-10 text-center text-ink/50">
                  No students match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="text-ink/55">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="border border-line px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ledger-light"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="border border-line px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ledger-light"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
