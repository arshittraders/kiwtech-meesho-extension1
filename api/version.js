// api/version.js — Current extension version
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({
    version: "3.1",
    releaseNotes: "Server-based license system",
    downloadUrl: process.env.ZIP_DOWNLOAD_URL || ""
  });
}
