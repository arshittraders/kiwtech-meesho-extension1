// lib/adminAuth.js — Admin password check
export function checkAdmin(req, res) {
  const { adminPass } = req.body || {};
  const correct = process.env.ADMIN_PASSWORD;
  if (!correct) {
    res.status(500).json({ success: false, error: "ADMIN_PASSWORD env variable set nahi hai" });
    return false;
  }
  if (!adminPass || adminPass !== correct) {
    res.status(403).json({ success: false, error: "Wrong password" });
    return false;
  }
  return true;
}

export function corsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
