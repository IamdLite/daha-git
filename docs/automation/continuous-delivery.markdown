### Continuous Deployment

- **CD Pipeline**: Defined in [`.gitlab-ci.yml`](https://gitlab.pg.innopolis.university/daha-40/daha/-/blob/main/.gitlab-ci.yml) with deployment stages.
- **Process**:
  - **Frontend and Mini App**: Automatically deployed to Vercel upon successful CI checks and merge to the `main` branch. Vercel pulls the code from GitLab, builds (`npm run build`), and deploys to [https://daha-git.vercel.app/](https://daha-git.vercel.app/) and [https://t.me/DahaBot/webapp](https://t.me/DahaBot/webapp).
  - **Backend and Bot**: Automatically deployed to a Cloud.ru VM using separate Docker containers. The pipeline builds Docker images for `backend/` and `bot/`, pushes them to a Cloud.ru container registry, and deploys to the VM, with the Backend accessible at [https://daha.linkpc.net/api/courses](https://daha.linkpc.net/api/courses). The Telegram Bot token is set as an environment variable (`TELEGRAM_BOT_TOKEN`) in the Bot’s Docker container.
  - **Database**: A Cloud.ru managed PostgreSQL service is configured, with the connection URL set as an environment variable (`DATABASE_URL`) in the Docker containers.
- **Tested Merge Request**: [CD Deployment MR](https://gitlab.pg.innopolis.university/daha-40/daha/-/merge_requests/203).
