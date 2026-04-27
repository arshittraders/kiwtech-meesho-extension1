// lib/supabase.js — Supabase client (no npm needed, pure fetch)

const SUPABASE_URL          = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE                 = "license_keys";

function headers() {
  return {
    "Content-Type":  "application/json",
    "apikey":        SUPABASE_SERVICE_KEY,
    "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
    "Prefer":        "return=representation"
  };
}

// ── Get one key by value ──────────────────────────────────────────────────────
export async function getKey(key) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE}?key=eq.${encodeURIComponent(key)}&limit=1`,
    { headers: headers() }
  );
  const rows = await res.json();
  return rows?.[0] || null;
}

// ── Get ALL keys ──────────────────────────────────────────────────────────────
export async function getAllKeys() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE}?order=created_at.desc`,
    { headers: headers() }
  );
  return await res.json(); // array of rows
}

// ── Insert new key ────────────────────────────────────────────────────────────
export async function insertKey(row) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE}`,
    { method: "POST", headers: headers(), body: JSON.stringify(row) }
  );
  const data = await res.json();
  return data?.[0] || data;
}

// ── Update key (partial) ──────────────────────────────────────────────────────
export async function updateKey(key, patch) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE}?key=eq.${encodeURIComponent(key)}`,
    { method: "PATCH", headers: headers(), body: JSON.stringify(patch) }
  );
  const data = await res.json();
  return data?.[0] || data;
}

// ── Upsert (insert or update) ─────────────────────────────────────────────────
export async function upsertKey(row) {
  const h = { ...headers(), Prefer: "resolution=merge-duplicates,return=representation" };
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE}`,
    { method: "POST", headers: h, body: JSON.stringify(row) }
  );
  const data = await res.json();
  return data?.[0] || data;
}
