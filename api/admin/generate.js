// api/admin/generate.js — Generate new license key
import { insertKey } from "../../lib/supabase.js";
import { checkAdmin, corsHeaders } from "../../lib/adminAuth.js";

function randHex() {
  return Math.floor(Math.random() * 0xFFFFFF)
    .toString(16).padStart(6, "0").toUpperCase();
}

function generateKey(plan) {
  const prefix = plan === "lifetime" ? "KWT-LIFE"
               : plan === "yearly"   ? "KWT-YEAR"
               : plan === "monthly"  ? "KWT-MNTH"
               :                       "KWT-TOOL";
  return `${prefix}-${randHex()}-${randHex()}`;
}

export default async function handler(req, res) {
  corsHeaders(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  if (!checkAdmin(req, res)) return;

  const { plan = "monthly", expiryDays, note = "" } = req.body || {};

  try {
    const key = generateKey(plan);

    let expiry = null;
    if (plan !== "lifetime") {
      const days = parseInt(expiryDays) || 30;
      const d = new Date();
      d.setDate(d.getDate() + days);
      expiry = d.toISOString();
    } else {
      expiry = "2099-12-31T00:00:00.000Z";
    }

    await insertKey({
      key,
      active: true,
      plan,
      expiry,
      note,
      created_at: new Date().toISOString()
    });

    return res.status(200).json({ success: true, key, expiry, plan });
  } catch (e) {
    console.error("admin/generate error:", e);
    return res.status(500).json({ success: false, error: "Key generate nahi ho saki: " + e.message });
  }
}
