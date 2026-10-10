const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const { email, password } = req.body || {};
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const SECRET = process.env.ADMIN_TOKEN_SECRET;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !SECRET) {
    return res.status(500).json({
      error: "Identifiants admin non configurés sur Vercel (ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_TOKEN_SECRET).",
    });
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Identifiants incorrects.' });
  }

  const expires = Date.now() + 1000 * 60 * 60 * 2; // 2 heures
  const payload = `${email}.${expires}`;
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  const token = Buffer.from(`${payload}.${sig}`).toString('base64');

  res.json({ token, expires });
};
