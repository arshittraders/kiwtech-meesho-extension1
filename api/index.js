// Kiwtech Meesho Tool Server — api/index.js
export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    service: "Kiwtech Meesho Tool Server",
    timestamp: new Date().toISOString()
  });
}
