# Telegram Setup (Vercel)

Use these server env vars in Vercel -> Project Settings -> Environment Variables:

- `TG_BOT_TOKEN` = token from @BotFather
- `TG_CHAT_ID` = your chat id (for order notifications), example: `6006811538`

## 1) /start greeting (webhook)

After each deploy, set webhook:

`https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://<YOUR_VERCEL_DOMAIN>/api/telegram-webhook&drop_pending_updates=true`

Check status:

`https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo`

Expected: no last_error_message, correct webhook URL.

## 2) Order notifications from all clients

Frontend sends order to server endpoint:

`POST /api/order-notify`

Server sends Telegram message using env vars above.

This means notifications work for EVERY customer, not only for your browser.

## Diagnostics endpoints

- `GET /api/telegram-webhook` -> webhook health
- `GET /api/order-notify` -> notification service health
