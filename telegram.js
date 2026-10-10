const axios = require('axios');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WA_API_URL = process.env.WA_API_URL;
const WA_API_KEY = process.env.WA_API_KEY;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(200).send('Telegram Bot Webhook Vercel - Ready');

  const update = req.body;
  const message = update && update.message;
  if (!message || !message.text) return res.status(200).send('OK');

  const chatId = message.chat.id;
  const text = message.text.trim();
  const lower = text.toLowerCase();

  async function reply(msg) {
    if (!TOKEN) return;
    try {
      await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: msg,
        parse_mode: 'Markdown',
      });
    } catch (e) {
      console.error('Erreur envoi Telegram:', e.message);
    }
  }

  if (lower.startsWith('/ping')) {
    await reply('🏓 Pong ! Webhook Telegram opérationnel.');
    return res.status(200).send('OK');
  }

  if (lower.startsWith('/status')) {
    if (!WA_API_URL || !WA_API_KEY) {
      await reply("⚠️ Le bot WhatsApp n'est pas encore configuré (WA_API_URL manquant sur Vercel).");
      return res.status(200).send('OK');
    }
    try {
      const r = await axios.get(`${WA_API_URL}/status`, {
        headers: { 'x-api-key': WA_API_KEY },
        timeout: 8000,
      });
      await reply(`📡 Statut WhatsApp : *${r.data.status}*`);
    } catch (e) {
      await reply('❌ Impossible de joindre le bot WhatsApp.');
    }
    return res.status(200).send('OK');
  }

  if (lower.startsWith('/send ')) {
    const parts = text.split(' ');
    const to = parts[1];
    const body = parts.slice(2).join(' ');
    if (!to || !body) {
      await reply('Usage : /send <numero> <message>');
      return res.status(200).send('OK');
    }
    if (!WA_API_URL || !WA_API_KEY) {
      await reply("⚠️ Le bot WhatsApp n'est pas configuré.");
      return res.status(200).send('OK');
    }
    try {
      await axios.post(
        `${WA_API_URL}/send`,
        { to, message: body },
        { headers: { 'x-api-key': WA_API_KEY }, timeout: 10000 }
      );
      await reply('✅ Message envoyé sur WhatsApp.');
    } catch (e) {
      await reply('❌ Échec de l\'envoi : ' + (e.response?.data?.error || e.message));
    }
    return res.status(200).send('OK');
  }

  if (lower.startsWith('/menu') || lower.startsWith('/help')) {
    await reply(
      '*MR SOLARYS — Pont Telegram*\n\n' +
        '/ping — tester le webhook\n' +
        '/status — statut réel de la connexion WhatsApp\n' +
        '/send <numero> <message> — envoyer un message WhatsApp réel'
    );
    return res.status(200).send('OK');
  }

  return res.status(200).send('OK');
};
