// api/admin/keys.js — List all license keys
import { getAllKeys } from "../../lib/supabase.js";
import { checkAdmin, corsHeaders } from "../../lib/adminAuth.js";

export default async function handler(req, res) {
  corsHeaders(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  if (!checkAdmin(req, res)) return;

  try {
    const rows = await getAllKeys();
    // Convert array → object (key: info) — popup.js is expecting this format
    const keys = {};
    for (const row of rows) {
      keys[row.key] = {
        active:    row.active,
        plan:      row.plan,
        expiry:    row.expiry,
        note:      row.note || "",
        created:   row.created_at
      };
    }
    return res.status(200).json({ success: true, keys });
  } catch (e) {
    console.error("admin/keys error:", e);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
