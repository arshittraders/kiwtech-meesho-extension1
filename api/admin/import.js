// api/admin/import.js — Bulk import keys
import { upsertKey } from "../../lib/supabase.js";
import { checkAdmin, corsHeaders } from "../../lib/adminAuth.js";

export default async function handler(req, res) {
  corsHeaders(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  if (!checkAdmin(req, res)) return;

  const { keys } = req.body || {};
  if (!keys || typeof keys !== "object") {
    return res.status(400).json({ success: false, error: "Keys object missing" });
  }

  try {
    let imported = 0;
    for (const [key, info] of Object.entries(keys)) {
      await upsertKey({
        key:        key.trim().toUpperCase(),
        active:     info.active ?? true,
        plan:       info.plan || "monthly",
        expiry:     info.expiry || null,
        note:       info.note || "",
        created_at: info.created || new Date().toISOString()
      });
      imported++;
    }
    return res.status(200).json({ success: true, imported });
  } catch (e) {
    console.error("admin/import error:", e);
    return res.status(500).json({ success: false, error: "Import failed: " + e.message });
  }
}
