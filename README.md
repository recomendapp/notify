# 🎬 Recomend — Notify

<p align="center">
  <img src="./assets/recomend_logo.svg" alt="Recomend logo" width="" />
</p>

**Notify** is the notification API for the **[Recomend](https://recomend.app)** app, dev by **[@lxup](https://github.com/lxup)**.
It handles in-app and push notifications using [Novu](https://novu.co/) and [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging).
Supabase triggers this API to send notifications based on user activity.

## ✅ TODO

Nothing yet.

## 🚀 Tech Stack

- ⚡️ [Express](https://expressjs.com/) - Web framework for Node.js
- 🔔 [Novu](https://novu.co/) – In-app Notifications
- 📲 [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging) – Push Notifications

## ✉️ Supported notification types (routes):
- follower — when someone follows a user
- friend — for friend requests or acceptances
- reco — new recommendations between users
- subscriber — subscriber-related events

## 📦 Installation

```bash
npm install
cp .env.template .env.local
# Add your environment variables to .env.local
npm run dev
```

## Novu

### Run Novu locally
```bash
npx novu@latest dev --port 9000
```

### Push Workflows to Novu
```bash
npx novu@latest sync \
  --bridge-url {{YOUR_BRIDGE_URL}} \
  --secret-key {{SECRET_KEY}} # DEV or PROD
```