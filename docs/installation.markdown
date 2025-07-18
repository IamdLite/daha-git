# ⚙️ Installation and Deployment

## 📥 Clone Repository

```bash
git clone https://gitlab.pg.innopolis.university/daha-40/daha.git
cd daha
```

Or, with SSH:

```bash
git clone git@gitlab.pg.innopolis.university:daha-40/daha.git
```

## 🌐 Frontend (Vercel)

```bash
cd frontend
npm install
npm run start  # Test locally
```

Deploy to Vercel: Connect to GitLab, set base directory `frontend/`, build command `npm run build`, output `build/`.

## 📱 Mini App (Vercel)

```bash
cd mini-app
npm install
npm run dev  # Test locally
```

Deploy to Vercel: Connect to GitLab, set base directory `mini-app/`, build command `npm run build`, output `build/`.

## ⚙️ Backend (Cloud.ru VM)

```bash
cd backend
docker-compose up --build  # Test locally
```

Deploy to Cloud.ru:
- Build: `docker build -t daha-backend .`
- Push: `docker push <cloud.ru-registry>/daha-backend`.
- Deploy: `docker run -d -p 8000:8000 -e DATABASE_URL=<url> <cloud.ru-registry>/daha-backend`.

## 🤖 Bot (Cloud.ru VM)

```bash
cd bot
docker build -t daha-bot .
docker run -e TELEGRAM_BOT_TOKEN=<token> daha-bot  # Test locally
```

Deploy to Cloud.ru:
- Build: `docker build -t daha-bot .`
- Push: `docker push <cloud.ru-registry>/daha-bot`.
- Deploy: `docker run -d -e TELEGRAM_BOT_TOKEN=<token> <cloud.ru-registry>/daha-bot`.
- Set webhook: `curl -F "url=https://daha.linkpc.net/webhook" https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook`.

## 🗄️ Database (Cloud.ru PostgreSQL)

- Provision PostgreSQL via Cloud.ru dashboard/CLI.
- Retrieve connection URL (e.g., `postgres://user:password@host:port/dbname`).
- Configure `DATABASE_URL` in Backend/Bot containers.

<p align="right">(<a href="#readme-top">back to top</a>)</p>