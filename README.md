# QuickBite Platform

Single-page food delivery platform with a Telegram webhook endpoint for bot automation.

## Project structure

- `index.html` - UI markup and Alpine directives only.
- `assets/css/styles.css` - all application styles.
- `assets/js/app.js` - all client app logic (Alpine store, cart, auth, tracking).
- `api/telegram-webhook.js` - Vercel serverless webhook for Telegram (`/start` greeting).
- `TELEGRAM_SETUP.md` - step-by-step Telegram/Vercel setup.

## Local run

Open directly:

```powershell
Start-Process index.html
```

## Deploy (Vercel)

1. Push to GitHub.
2. Import repo in Vercel.
3. Add env var: `TG_BOT_TOKEN`.
4. Set Telegram webhook to:

`https://<your-domain>/api/telegram-webhook`

## Notes

- Frontend is static (`index.html` + assets).
- Backend endpoint is serverless (`api/*`).
