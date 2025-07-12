<<<<<<< HEAD
# Daha

A course aggregator platform for high school students, with React frontend, FastAPI backend, Telegram bot, and Mini App.

## How to add your code

1- Clone the repository locally or `git pull` to get the updated repo.  \
2- If not existing already, create a directory for your code, e.g `backend/` and add your code to it. \
3- Branches are created for every week sprints. Do `git fetch --all` then `git branch -r` to see all avaible branches. Push your code to the appropriate branch depending on your task. If no branch exists for the task you did, then create a new branch, and push your code to it. \
4- After you complete the task, create a merge request with the branch. \
4- I (or anyone assigned) will review the code and merge it with the main branch if everything is alright.

NB: No spaghetti code please, USE OOP STANDARDS!! and add a README.md file with steps to test your code. Thanks in advance!

## Setup

### Clone Repository

`git clone https://gitlab.pg.innopolis.university/daha-40/daha.git` \
`cd daha`

If you have configured the ssh connection, do \
`git clone git@gitlab.pg.innopolis.university:daha-40/daha.git` instead.

### Frontend (Vercel)

Install dependencies: `cd frontend && npm install` \

Test locally: `npm start` \

Deploy to Vercel: Connect to GitLab, set base directory frontend/, build command `npm run build, output build/`

### Mini App (Vercel)

PLEASE ADD STEPS TO RUN AND TEST HERE

### Backend 

PLEASE ADD STEPS TO RUN AND TEST HERE

### Bot

PLEASE ADD STEPS TO RUN AND TEST HERE



### Testing 
Frontend: [https://daha-git.vercel.app] \\
Mini App: [https://your-vercel-mini-app-url] (via @DahaBot /webapp) \
Admin: [https://your-vercel-frontend-url/admin] (password: admin123) \
API: [https://your-pythonanywhere-url/api/courses] \
Bot: Message @DahaBot with `/start`, `/set-filter`, `/webapp` 