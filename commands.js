const axios = require('axios');
const { verifyAdminToken, getBearerToken } = require('./_lib/verifyToken');

module.exports = async (req, res) => {
  if (!verifyAdminToken(getBearerToken(req))) {
    return res.status(401).json({ error: 'Non autorisé. Connectez-vous au tableau de bord admin.' });
  }

  const base = process.env.WA_API_URL;
  const key = process.env.WA_API_KEY;
  if (!base || !key) {
    return res.status(500).json({ error: 'WA_API_URL / WA_API_KEY non configurés sur Vercel.' });
  }

  try {
    if (req.method === 'GET') {
      const r = await axios.get(`${base}/commands`, { headers: { 'x-api-key': key }, timeout: 8000 });
      return res.json(r.data);
    }
    if (req.method === 'POST') {
      const { trigger, code } = req.body || {};
      if (!trigger || !code) return res.status(400).json({ error: 'trigger et code sont requis.' });
      const r = await axios.post(
        `${base}/commands`,
        { trigger, code },
        { headers: { 'x-api-key': key }, timeout: 8000 }
      );
      return res.json(r.data);
    }
    return res.status(405).json({ error: 'method_not_allowed' });
  } catch (e) {
    res.status(502).json({ error: e.response?.data?.error || e.message });
  }
};
