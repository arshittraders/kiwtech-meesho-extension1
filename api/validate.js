// api/validate.js — License key validation
import { getKey } from "../lib/supabase.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  const { key } = req.body || {};
  if (!key) return res.status(400).json({ valid: false, error: "Key missing" });

  try {
    const row = await getKey(key.trim().toUpperCase());

    if (!row)          return res.status(200).json({ valid: false });
    if (!row.active)   return res.status(200).json({ valid: false, reason: "deactivated" });
    if (row.expiry && new Date() > new Date(row.expiry))
                       return res.status(200).json({ valid: false, expired: true });

    return res.status(200).json({ valid: true, plan: row.plan });

  } catch (e) {
    console.error("validate error:", e);
    return res.status(500).json({ valid: false, error: "Server error" });
  }
}
