# Daha

A course aggregator platform for high school students, with React frontend, FastAPI backend, Telegram bot, and Mini App.

## Setup

### Clone Repository

`git clone <your-gitlab-repo-url>`
`cd daha-mvp`

### Frontend (Vercel)

Install dependencies: `cd frontend && npm install`

Test locally: `npm start`

Deploy to Vercel: Connect to GitLab, set base directory frontend/, build command `npm run build, output build/`

### Mini App (Vercel)

Install dependencies: `cd mini-app && npm install`

Test locally: `npm start`

Deploy to Vercel: Connect to GitLab, set base directory mini-app/, build command `npm run build, output build/`

### Backend & Bot (PythonAnywhere)

Install dependencies: `cd backend && pip install -r requirements.txt`

Test locally: `uvicorn app.main:app --reload`

Deploy to PythonAnywhere: Create web app, pull from GitLab, configure WSGI, set BOT_TOKEN

Deployment

Vercel: Auto-deploys on GitLab main pushes.

PythonAnywhere: Pull from GitLab, reload web app after pushes.

Bot Webhook: `Set via curl -F "url=https://your-pythonanywhere-url/webhook" https://api.telegram.org/bot<your-bot-token>/setWebhook`

Testing
Frontend: [https://your-vercel-frontend-url]
Mini App: [https://your-vercel-mini-app-url] (via @DahaBot /webapp)
Admin: [https://your-vercel-frontend-url/admin] (password: admin123)
API: [https://your-pythonanywhere-url/api/courses]
Bot: Message @DahaBot with `/start`, `/courses`, `/webapp`