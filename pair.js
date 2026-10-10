const axios = require('axios');
const { verifyAdminToken, getBearerToken } = require('./_lib/verifyToken');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  if (!verifyAdminToken(getBearerToken(req))) {
    return res.status(401).json({ error: 'Non autorisé. Connectez-vous au tableau de bord admin.' });
  }

  const base = process.env.WA_API_URL;
  const key = process.env.WA_API_KEY;
  if (!base || !key) {
    return res.status(500).json({ error: 'WA_API_URL / WA_API_KEY non configurés sur Vercel.' });
  }

  const { phone } = req.body || {};
  if (!phone) return res.status(400).json({ error: 'Numéro de téléphone requis.' });

  try {
    const r = await axios.post(
      `${base}/pair`,
      { phone },
      { headers: { 'x-api-key': key }, timeout: 15000 }
    );
    // r.data.code est le VRAI code renvoyé par WhatsApp via le bot Baileys.
    res.json(r.data);
  } catch (e) {
    res.status(502).json({ error: e.response?.data?.error || e.message });
  }
};
