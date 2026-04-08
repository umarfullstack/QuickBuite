module.exports = async function handler(req, res) {
  const botToken = (process.env.TG_BOT_TOKEN || '').trim();
  const testChatId = (process.env.TG_CHAT_ID || '').trim();

  const requestUrl = (() => {
    try {
      return new URL(req.url || '', 'https://local.test');
    } catch (e) {
      return null;
    }
  })();

  async function sendMessage(chatId, text) {
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    const tgData = await tgRes.json().catch(() => ({}));
    if (!tgRes.ok || tgData.ok === false) {
      throw new Error(`Telegram sendMessage failed: ${JSON.stringify(tgData)}`);
    }
    return tgData;
  }

  async function ensureWebhook() {
    const protoHeader = (req.headers['x-forwarded-proto'] || '').toString().split(',')[0].trim();
    const hostHeader = (req.headers['x-forwarded-host'] || req.headers.host || '').toString().split(',')[0].trim();
    const proto = protoHeader || 'https';
    const host = hostHeader;
    if (!host) return { ok: false, reason: 'no_host' };

    const webhookUrl = `${proto}://${host}/api/telegram-webhook`;
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        drop_pending_updates: true
      })
    });

    const tgData = await tgRes.json().catch(() => ({}));
    return { ok: tgRes.ok && tgData.ok !== false, webhookUrl, telegram: tgData };
  }

  if (req.method === 'GET') {
    const autoSetupParam =
      (req.query && req.query.auto_setup) ||
      (requestUrl && requestUrl.searchParams.get('auto_setup')) ||
      '';

    if (String(autoSetupParam) === '1') {
      if (!botToken) {
        return res.status(500).json({ ok: false, error: 'TG_BOT_TOKEN is not configured' });
      }
      try {
        const setup = await ensureWebhook();
        if (!setup.ok) return res.status(500).json({ ok: false, setup });
        return res.status(200).json({ ok: true, auto_setup: true, setup });
      } catch (error) {
        return res.status(500).json({ ok: false, error: String(error.message || error) });
      }
    }

    if (req.query && String(req.query.send_test) === '1') {
      if (!botToken || !testChatId) {
        return res.status(500).json({ ok: false, error: 'TG_BOT_TOKEN or TG_CHAT_ID is not configured' });
      }
      try {
        const data = await sendMessage(testChatId, '✅ Telegram webhook test OK');
        return res.status(200).json({ ok: true, direct_test: true, telegram: data });
      } catch (error) {
        return res.status(500).json({ ok: false, error: String(error.message || error) });
      }
    }

    return res.status(200).json({
      ok: true,
      service: 'telegram-webhook',
      configured: Boolean(botToken),
      route: '/api/telegram-webhook'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  if (!botToken) {
    return res.status(500).json({ ok: false, error: 'TG_BOT_TOKEN is not configured' });
  }

  const update = req.body || {};
  const message = update.message || update.edited_message;

  if (!message || !message.chat) {
    return res.status(200).json({ ok: true, ignored: true, reason: 'No message' });
  }

  const chatId = message.chat.id;
  const user = message.from || {};
  const displayName = user.first_name || [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || 'друг';
  const text = typeof message.text === 'string' ? message.text.trim() : '';
  const isStartCommand = /^\/start(?:@\w+)?(?:\s|$)/i.test(text);

  if (message.web_app_data && typeof message.web_app_data.data === 'string') {
    const reply = [
      `Спасибо, ${displayName}!`,
      'Данные из Mini App получены.'
    ].join('\n');

    try {
      await sendMessage(chatId, reply);
      return res.status(200).json({ ok: true, replied: true, type: 'web_app_data' });
    } catch (error) {
      console.error('Failed to send web_app_data reply:', error);
      return res.status(200).json({ ok: false, error: 'Send failed (web_app_data)' });
    }
  }

  if (!isStartCommand) {
    return res.status(200).json({ ok: true, ignored: true, reason: 'Not /start or web_app_data' });
  }

  const greeting = `✨ Привет, ${displayName}! Добро пожаловать в QuickBite 🍕\nЧтобы выбрать еду, нажми «Menu» слева снизу 👇`;

  try {
    await sendMessage(chatId, greeting);
    return res.status(200).json({ ok: true, replied: true, type: 'start' });
  } catch (error) {
    console.error('Failed to send /start greeting:', error);
    return res.status(200).json({ ok: false, error: 'Send failed (/start)' });
  }
};
