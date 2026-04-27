// api/admin/deactivate.js — Deactivate a license key
import { updateKey } from "../../lib/supabase.js";
import { checkAdmin, corsHeaders } from "../../lib/adminAuth.js";

export default async function handler(req, res) {
  corsHeaders(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  if (!checkAdmin(req, res)) return;

  const { key } = req.body || {};
  if (!key) return res.status(400).json({ success: false, error: "Key missing" });

  try {
    await updateKey(key.trim().toUpperCase(), { active: false });
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error("admin/deactivate error:", e);
    return res.status(500).json({ success: false, error: "Deactivate nahi ho saka" });
  }
}
