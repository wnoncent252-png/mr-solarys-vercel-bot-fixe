const axios = require('axios');

module.exports = async (req, res) => {
  const base = process.env.WA_API_URL;
  const key = process.env.WA_API_KEY;

  if (!base || !key) {
    return res.json({
      project: 'MR SOLARYS',
      version: '2.0.0',
      status: 'NOT_CONFIGURED',
      detail: 'WA_API_URL / WA_API_KEY ne sont pas configurés sur Vercel.',
      telegram_bot: process.env.TELEGRAM_BOT_TOKEN ? 'CONFIGURED' : 'PENDING',
    });
  }

  try {
    const r = await axios.get(`${base}/status`, {
      headers: { 'x-api-key': key },
      timeout: 8000,
    });
    res.json({
      project: 'MR SOLARYS',
      version: '2.0.0',
      status: r.data.status,
      telegram_bot: process.env.TELEGRAM_BOT_TOKEN ? 'CONFIGURED' : 'PENDING',
    });
  } catch (e) {
    res.status(502).json({
      project: 'MR SOLARYS',
      status: 'UNREACHABLE',
      error: "Impossible de contacter le bot WhatsApp à l'adresse WA_API_URL.",
      detail: e.message,
    });
  }
};
