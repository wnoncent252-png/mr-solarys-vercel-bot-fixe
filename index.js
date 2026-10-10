module.exports = (req, res) => {
  if (req.query && req.query.json === 'true') {
    return res.json({
      status: 'ONLINE',
      bot: 'MR SOLARYS',
      version: '2.0.0',
      platform: 'Vercel Serverless (site + pont) + Baileys (bot réel, hébergé séparément)',
      webhook: '/telegram',
      session: '/session',
      timestamp: new Date().toISOString(),
    });
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MR SOLARYS • Hub Vercel</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #04060d;
    color: #e2e8f0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px;
  }
  .wrapper { max-width: 640px; width: 100%; }
  .header { text-align: center; margin-bottom: 24px; }
  h1 { font-size: 28px; font-weight: 900; color: #ffffff; }
  .tagline { font-size: 13px; color: #94a3b8; margin-top: 6px; }
  .nav { display: flex; gap: 8px; background: #090e1d; padding: 6px; border-radius: 14px; border: 1px solid #1e293b; margin-bottom: 20px; }
  .nav-btn { flex: 1; padding: 10px 14px; border-radius: 10px; border: none; background: transparent; color: #94a3b8; font-size: 13px; font-weight: 700; cursor: pointer; }
  .nav-btn.active { background: #dc2626; color: #fff; }
  .card { background: #090e1d; border: 1px solid #1e293b; border-radius: 16px; padding: 24px; }
  .tab-content { display: none; }
  .tab-content.active { display: block; }
  h2 { font-size: 18px; margin-bottom: 8px; }
  p.desc { font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 16px; }
  .field { margin-bottom: 14px; text-align: left; }
  label { display: block; font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 6px; text-transform: uppercase; }
  input { width: 100%; background: #040711; border: 1px solid #334155; border-radius: 10px; padding: 12px 14px; color: #fff; font-size: 14px; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #dc2626; color: white; border: none; padding: 12px 20px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; width: 100%; margin-top: 6px; }
  .btn-secondary { background: #1e293b; color: #e2e8f0; }
  .code-box { background: #03050a; border: 2px dashed #06b6d4; border-radius: 12px; padding: 20px; text-align: center; margin: 16px 0; }
  .code-display { font-family: monospace; font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #38bdf8; }
  .status-box { background: #040711; border: 1px solid #1e293b; border-radius: 10px; padding: 12px; font-size: 13px; margin-bottom: 16px; }
  .alert-error { background: rgba(220,38,38,.15); border: 1px solid rgba(220,38,38,.4); color: #f87171; padding: 10px 14px; border-radius: 10px; font-size: 13px; margin-bottom: 14px; display:none; }
  .note { font-size: 11px; color: #64748b; margin-top: 16px; line-height: 1.5; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>☠ MR SOLARYS</h1>
    <div class="tagline">Site Vercel + pont vers le vrai bot WhatsApp (Baileys)</div>
  </div>

  <div class="nav">
    <button class="nav-btn active" id="navConnexion" onclick="switchTab('connexion')">Connexion</button>
    <button class="nav-btn" id="navAdmin" onclick="switchTab('admin')">Espace Admin</button>
  </div>

  <div id="tab-connexion" class="card tab-content active">
    <h2>📡 Statut réel du bot</h2>
    <div class="status-box">Statut WhatsApp : <b id="waStatus">chargement...</b></div>
    <p class="desc">Le vrai code de liaison ne peut être généré que depuis l'espace admin (il faut être connecté), car il déclenche une vraie requête vers WhatsApp via le bot.</p>
  </div>

  <div id="tab-admin" class="card tab-content">
    <div id="adminLoginForm">
      <h2>🔐 Connexion Administrateur</h2>
      <div id="adminError" class="alert-error"></div>
      <div class="field">
        <label>E-mail</label>
        <input type="email" id="adminEmail" />
      </div>
      <div class="field">
        <label>Mot de passe</label>
        <input type="password" id="adminPass" />
      </div>
      <button class="btn" onclick="loginAdmin()">Déverrouiller</button>
    </div>

    <div id="adminDashboard" style="display:none;">
      <h2>👑 Tableau de bord</h2>
      <button class="btn btn-secondary" onclick="logoutAdmin()">Déconnexion</button>

      <div style="margin-top:20px;">
        <h2>📱 Lier un numéro WhatsApp (code réel)</h2>
        <p class="desc">Ce bouton appelle le vrai bot WhatsApp et demande un vrai code de pairing généré par WhatsApp lui-même. Si le bot n'est pas joignable ou si une session est déjà active, l'erreur réelle s'affiche ici — aucun code n'est inventé.</p>
        <div class="field">
          <label>Numéro (indicatif inclus, sans +)</label>
          <input type="text" id="phoneInput" placeholder="33612345678" />
        </div>
        <button class="btn" onclick="generatePairing()">Générer le vrai code</button>
        <div id="pairingBox" class="code-box" style="display:none;">
          <div class="code-display" id="codeDisplay">----</div>
        </div>
        <div id="statusLiveBox" class="status-box" style="display:none;"></div>
      </div>
    </div>
  </div>

  <div class="note">
    Le bot WhatsApp réel tourne séparément (Railway/Render/VPS) — voir le
    README du dossier <code>whatsapp-bot/</code>. Ce site Vercel ne fait que
    s'y connecter via son API, il ne contient aucune simulation.
  </div>
</div>

<script>
  let adminToken = null;

  function switchTab(name) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-' + name).classList.add('active');
    document.getElementById('nav' + (name === 'connexion' ? 'Connexion' : 'Admin')).classList.add('active');
  }

  async function refreshStatus() {
    try {
      const r = await fetch('/session');
      const data = await r.json();
      document.getElementById('waStatus').innerText = data.status || data.error || 'INCONNU';
    } catch (e) {
      document.getElementById('waStatus').innerText = 'ERREUR';
    }
  }
  window.addEventListener('DOMContentLoaded', refreshStatus);

  async function loginAdmin() {
    const email = document.getElementById('adminEmail').value.trim();
    const pass = document.getElementById('adminPass').value;
    const err = document.getElementById('adminError');
    err.style.display = 'none';
    try {
      const r = await fetch('/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Erreur de connexion');
      adminToken = data.token;
      document.getElementById('adminLoginForm').style.display = 'none';
      document.getElementById('adminDashboard').style.display = 'block';
    } catch (e) {
      err.style.display = 'block';
      err.innerText = e.message;
    }
  }

  function logoutAdmin() {
    adminToken = null;
    document.getElementById('adminLoginForm').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminPass').value = '';
  }

  async function generatePairing() {
    const p = document.getElementById('phoneInput').value.trim();
    const box = document.getElementById('pairingBox');
    const statusEl = document.getElementById('statusLiveBox');
    statusEl.style.display = 'block';
    if (!p || p.length < 6) {
      statusEl.innerText = 'Entrez un numéro valide avec indicatif.';
      return;
    }
    statusEl.innerText = '⏳ Demande du vrai code en cours auprès de WhatsApp...';
    box.style.display = 'block';
    document.getElementById('codeDisplay').innerText = '----';
    try {
      const r = await fetch('/pair', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + adminToken,
        },
        body: JSON.stringify({ phone: p }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Échec de la génération du code.');
      document.getElementById('codeDisplay').innerText = data.code;
      statusEl.innerText = 'Entrez ce code dans WhatsApp > Appareils connectés > Lier avec un numéro de téléphone. Il expire après un court délai.';
    } catch (e) {
      statusEl.innerText = '❌ ' + e.message;
    }
  }
</script>
</body>
</html>`);
};
