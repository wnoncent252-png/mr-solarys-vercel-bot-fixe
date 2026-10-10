const crypto = require('crypto');

function verifyAdminToken(token) {
  if (!token) return false;
  const SECRET = process.env.ADMIN_TOKEN_SECRET;
  if (!SECRET) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split('.');
    const sig = parts.pop();
    const expires = parts.pop();
    const email = parts.join('.');
    const expected = crypto.createHmac('sha256', SECRET).update(`${email}.${expires}`).digest('hex');
    if (sig !== expected) return false;
    if (Date.now() > Number(expires)) return false;
    return true;
  } catch {
    return false;
  }
}

function getBearerToken(req) {
  const header = req.headers['authorization'] || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

module.exports = { verifyAdminToken, getBearerToken };
