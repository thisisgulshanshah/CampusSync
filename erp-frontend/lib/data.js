// -----------------------------------------------------------------------
// Data access layer.
//
// Right now this generates deterministic mock data shaped exactly like
// the Supabase `students` table the live dashboard queries (same columns
// seen on the deployed site: gender, race/ethnicity group, parental
// education, lunch, test prep, math/reading/writing scores).
//
// To wire up real Supabase later, replace the body of getStudents() /
// getStudentById() with calls like:
//
//   import { createClient } from "@supabase/supabase-js";
//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
//   );
//   const { data } = await supabase.from("students").select("*");
//
// Keep the return shape identical and every component below keeps working
// unchanged.
// -----------------------------------------------------------------------

const GENDERS = ["female", "male"];
const GROUPS = ["group A", "group B", "group C", "group D", "group E"];
const PARENT_ED = [
  "some high school",
  "high school",
  "some college",
  "associate's degree",
  "bachelor's degree",
  "master's degree",
];
const LUNCH = ["standard", "free/reduced"];
const PREP = ["none", "completed"];

const FIRST_NAMES = [
  "Aarav", "Meera", "Kabir", "Sara", "Ishaan", "Diya", "Vivaan", "Anaya",
  "Reyansh", "Myra", "Arjun", "Kiara", "Advait", "Riya", "Vihaan", "Anika",
  "Sai", "Navya", "Krishna", "Aadhya",
];
const LAST_NAMES = [
  "Sharma", "Verma", "Iyer", "Patel", "Nair", "Gupta", "Rao", "Mehta",
  "Khan", "Singh", "Reddy", "Das", "Chopra", "Malhotra", "Kulkarni",
];

// simple seeded RNG so the data set is stable across renders/requests
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20240915);
function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
function normalScore(mean, sd) {
  const u1 = rand();
  const u2 = rand();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return clamp(Math.round(mean + z * sd), 0, 100);
}

const TOTAL = 1000;

let CACHE = null;

function generateAll() {
  if (CACHE) return CACHE;
  const rows = [];
  for (let i = 1; i <= TOTAL; i++) {
    const id = `STU-${String(i).padStart(4, "0")}`;
    const gender = pick(GENDERS);
    const group = pick(GROUPS);
    const parentalEducation = pick(PARENT_ED);
    const lunch = pick(LUNCH);
    const testPrep = pick(PREP);

    const prepBoost = testPrep === "completed" ? 6 : 0;
    const lunchPenalty = lunch === "free/reduced" ? -5 : 0;

    const math = normalScore(66 + prepBoost + lunchPenalty, 15);
    const reading = normalScore(69 + prepBoost + lunchPenalty, 14);
    const writing = normalScore(68 + prepBoost + lunchPenalty, 15);
    const overallAvg = (math + reading + writing) / 3;

    rows.push({
      id,
      name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      gender,
      group,
      parentalEducation,
      lunch,
      testPrep,
      math,
      reading,
      writing,
      overallAvg: Math.round(overallAvg * 100) / 100,
    });
  }
  CACHE = rows;
  return rows;
}

export function getSummary() {
  const rows = generateAll();
  const avg = (key) =>
    Math.round((rows.reduce((s, r) => s + r[key], 0) / rows.length) * 100) / 100;
  return {
    totalStudents: rows.length,
    avgMath: avg("math"),
    avgReading: avg("reading"),
    avgWriting: avg("writing"),
    overallAvg:
      Math.round(
        ((avg("math") + avg("reading") + avg("writing")) / 3) * 100
      ) / 100,
  };
}

export function getStudents({
  page = 1,
  pageSize = 20,
  gender = "all",
  group = "all",
  lunch = "all",
  testPrep = "all",
  query = "",
} = {}) {
  let rows = generateAll();

  if (gender !== "all") rows = rows.filter((r) => r.gender === gender);
  if (group !== "all") rows = rows.filter((r) => r.group === group);
  if (lunch !== "all") rows = rows.filter((r) => r.lunch === lunch);
  if (testPrep !== "all") rows = rows.filter((r) => r.testPrep === testPrep);
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    rows = rows.filter(
      (r) => r.id.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)
    );
  }

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  return {
    rows: pageRows,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export function getStudentById(id) {
  const rows = generateAll();
  return rows.find((r) => r.id.toLowerCase() === String(id).toLowerCase()) || null;
}

export function getFilterOptions() {
  return { GENDERS, GROUPS, LUNCH, PREP };
}

export function getClassBreakdown() {
  const rows = generateAll();
  return GROUPS.map((g) => {
    const inGroup = rows.filter((r) => r.group === g);
    const avg =
      inGroup.reduce((s, r) => s + r.overallAvg, 0) / (inGroup.length || 1);
    return { group: g, count: inGroup.length, avg: Math.round(avg * 100) / 100 };
  });
}

export function getSubjectDistribution() {
  const rows = generateAll();
  const buckets = [
    { label: "0-39", min: 0, max: 39 },
    { label: "40-59", min: 40, max: 59 },
    { label: "60-74", min: 60, max: 74 },
    { label: "75-89", min: 75, max: 89 },
    { label: "90-100", min: 90, max: 100 },
  ];
  return buckets.map((b) => ({
    label: b.label,
    count: rows.filter((r) => r.overallAvg >= b.min && r.overallAvg <= b.max)
      .length,
  }));
}
