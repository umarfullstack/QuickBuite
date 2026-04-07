module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'telegram-webhook',
      configured: Boolean(process.env.TG_BOT_TOKEN),
      route: '/api/telegram-webhook'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const botToken = process.env.TG_BOT_TOKEN;
  if (!botToken) {
    return res.status(500).json({ ok: false, error: 'TG_BOT_TOKEN is not configured' });
  }

  const update = req.body || {};
  const message = update.message || update.edited_message;

  if (!message || !message.chat || typeof message.text !== 'string') {
    return res.status(200).json({ ok: true, ignored: true, reason: 'No text message' });
  }

  const text = message.text.trim();
  const isStartCommand = /^\/start(?:@\w+)?(?:\s|$)/i.test(text);

  if (!isStartCommand) {
    return res.status(200).json({ ok: true, ignored: true, reason: 'Not /start command' });
  }

  const chatId = message.chat.id;
  const user = message.from || {};
  const displayName = user.username || user.first_name || user.last_name || 'друг';

  const greeting = [
    `Привет, ${displayName}!`,
    'Добро пожаловать в Food Delivery Admin.',
    'Я на связи и готов отправлять уведомления о заказах.'
  ].join('\n');

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: greeting
      })
    });

    const tgData = await tgRes.json().catch(() => ({}));
    if (!tgRes.ok || tgData.ok === false) {
      console.error('Telegram sendMessage failed:', tgData);
      return res.status(200).json({ ok: false, telegram: tgData });
    }

    return res.status(200).json({ ok: true, replied: true });
  } catch (error) {
    console.error('Failed to send /start greeting:', error);
    return res.status(200).json({ ok: false, error: 'Send failed' });
  }
};
