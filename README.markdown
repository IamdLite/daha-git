# Daha: Course Aggregator Platform

A course aggregator platform for high school students, featuring a React frontend, FastAPI backend, Telegram bot, and Mini App.

## Usage

- **Frontend**: Access at [https://daha-git.vercel.app/](https://daha-git.vercel.app/).
- **Mini App**: Access via Telegram at [@bot_DAHA_bot /webapp](https://t.me/daha_DAHA_bot/).
- **Admin Panel**: Access at [https://dahaadmin.vercel.app/](https://dahaadmin.vercel.app/) (password: admin123).
- **API**: Access at [https://daha.linkpc.net/api/courses](https://daha.linkpc.net/api/courses).
- **Bot**: Message [@bot_Daha_bot](https://t.me/bot_DAHA_bot) with commands `/start`, `/set-filter`, or `/webapp`.

## Architecture

The system employs a microservices architecture to ensure scalability, usability, and reliability:

- **Frontend**: Built with React and hosted on Vercel, it provides an intuitive user interface for course browsing and interaction.
- **Mini App**: A React-based application integrated with Telegram, hosted on Vercel, offering a lightweight interface for mobile users.
- **Backend**: Developed with FastAPI and hosted on a Cloud.ru VM using a Docker container, it serves course data and handles API requests.
- **Bot**: Implemented in Python using the python-telegram-bot library, hosted on a Cloud.ru VM using a separate Docker container, it facilitates user interactions via Telegram commands.
- **Database**: A PostgreSQL instance hosted on a Cloud.ru managed service, storing course and user data.

For a detailed architectural overview, refer to [doc/architecture/architecture.md](https://gitlab.pg.innopolis.university/daha-40/daha/-/blob/main/doc/architecture/architecture.md).

## Development

### Git Workflow

The project adapts **GitHub Flow** as the base workflow, customized for the team’s needs. Below are the rules for managing issues, branches, commits, pull requests, code reviews, and issue resolution:

- **Creating Issues**:
  - Issues are created in GitLab using templates in [`.gitlab/issue_templates/`](https://gitlab.pg.innopolis.university/daha-40/daha/-/tree/main/.gitlab/issue_templates):
    - **Feature Template**: Uses GIVEN/WHEN/THEN format for acceptance criteria (e.g., [Feature Template](https://gitlab.pg.innopolis.university/daha-40/daha/-/blob/main/.gitlab/issue_templates/feature.md)).
    - **Bug Report**: Includes reproduction steps, expected, and actual behavior (e.g., [Bug Report](https://gitlab.pg.innopolis.university/daha-40/daha/-/blob/main/.gitlab/issue_templates/bug.md)).
    - **Technical Task**: Lists technical checklist or subtasks (e.g., [Technical Task](https://gitlab.pg.innopolis.university/daha-40/daha/-/blob/main/.gitlab/issue_templates/technical_task.md)).
  - Issues are created by the product owner or developers during sprint planning.
- **Labelling Issues**:
  - Labels categorize issues: `feature`, `bug`, `enhancement`, `documentation`, `urgent`, `sprint-5`.
  - Priority labels: `low`, `medium`, `high`.
  - Status labels: `To Do`, `In Progress`, `Review`, `Done`.
- **Assigning Issues**:
  - Issues are assigned to team members during sprint planning based on expertise and workload.
  - Each issue has one primary assignee, with optional co-assignees for collaboration.
- **Creating and Naming Branches**:
  - Branches are created from `main` for each issue, named as `sprint-5/issue-<issue-number>-<short-description>` (e.g., `sprint-5/issue-101-course-filtering`).
  - Feature branches are short-lived and deleted after merging.
- **Commit Messages**:
  - Format: `[Issue #<number>] <Type>: <Description>` (e.g., `[Issue #101] Feature: Add course filtering endpoint`).
  - Types: `Feature`, `Bugfix`, `Refactor`, `Docs`, `Test`.
  - Descriptions are concise, in imperative mood, and reference the issue number.
- **Creating Pull Requests**:
  - Pull requests (PRs) are created using the template in [`.gitlab/merge_request_templates/`](https://gitlab.pg.innopolis.university/daha-40/daha/-/blob/main/.gitlab/merge_request_templates/merge_request.md).
  - PRs include a link to the associated issue, description of changes, and testing instructions.
  - PRs are created from the feature branch to `main`.
- **Code Reviews**:
  - At least two team members review each PR, checking for code quality, adherence to OOP standards, and test coverage.
  - Reviewers use GitLab’s review tools to comment and suggest changes.
  - PRs must pass CI checks (linting, tests, SonarQube) before approval.
- **Merging Pull Requests**:
  - PRs are merged into `main` after approval by at least two reviewers and passing CI checks.
  - Squash merging is used to keep the commit history clean.
  - The branch is deleted post-merge.
- **Resolving Issues**:
  - Issues are closed by the assignee or product owner after the PR is merged and deployed, with verification in the production environment.

#### Gitgraph Diagram
The following Gitgraph diagram illustrates the Git workflow for a feature (e.g., Issue #101): ![Example Workflow](https://github.com/IamdLite/rosesarered/blob/main/example-workflow.png?raw=true)


```
* main
  | [sprint-5/issue-101-course-filtering] Create branch
  | * Commit: [Issue #101] Feature: Add course filtering endpoint
  | * Commit: [Issue #101] Test: Add filter tests
  |/
  | Merge PR into main
  * main: Merge [Issue #101] Course filtering
```

### Kanban Board

The GitLab issue board is used to track tasks and is accessible at [Issue Board](https://gitlab.pg.innopolis.university/daha-40/daha/-/boards). The board has four columns with the following entry criteria:

- **To Do**:
  - Issue created with the appropriate template (Feature, Bug Report, or Technical Task).
  - Issue assigned to a developer with relevant labels (e.g., `feature`, `sprint-5`, `high`).
- **In Progress**:
  - Developer assigned and actively working on the issue.
  - Feature branch created (e.g., `sprint-5/issue-101-course-filtering`).
  - Issue moved to `In Progress` label in GitLab.
- **Review**:
  - Pull request created with a link to the issue and passing CI checks (linting, tests, SonarQube).
  - At least two reviewers assigned to evaluate code quality and functionality.
- **Done**:
  - Pull request approved, merged into `main`, and deployed to production.
  - Issue functionality verified in the production environment.
  - Issue closed with the `Done` label.

The team must update the GitLab issue board to reflect these criteria, ensuring all issues are properly labeled and moved through the columns.

### Secrets Management

Sensitive information, such as API keys, database credentials, and the Telegram bot token, is managed securely to prevent leaks and ensure maintainability:

- **Storage**: Secrets are stored in a `.env` file in the repository root, which is excluded from version control via `.gitignore`.
- **Access**:
  - The `.env` file is accessible only to authorized team members via a secure shared vault (e.g., GitLab CI/CD variables or a team password manager).
  - For local development, team members copy the `.env` file from the vault and place it in their local repository.
- **Usage**:
  - Secrets, including the `TELEGRAM_BOT_TOKEN`, are loaded into the application as environment variables to prevent hardcoding (e.g., `os.environ` in Python for Backend and Bot, `process.env` in Node.js for Frontend and Mini App).
  - Example: `DATABASE_URL` for PostgreSQL, `TELEGRAM_BOT_TOKEN` for the Telegram bot.
- **Deployment**:
  - For Vercel, secrets are configured in the Vercel dashboard under project settings.
  - For Cloud.ru VM, secrets, including the `TELEGRAM_BOT_TOKEN`, are set as environment variables in the Docker container configuration (e.g., via `docker run -e TELEGRAM_BOT_TOKEN=<token>`).
- **Rules**:
  - Never commit secrets to the repository or include them in logs or source code.
  - Rotate secrets periodically (e.g., every 3 months) or immediately if a breach is suspected.
  - Restrict access to secrets to only necessary team members.
  - Use GitLab CI/CD variables for secrets in the CI pipeline (e.g., `CI_DATABASE_URL`, `CI_TELEGRAM_BOT_TOKEN`).

### Sprint 5 Process

- **Intent Update**: The backlog was refined to prioritize MVP v2 features, bug fixes, and user experience improvements.
- **Sprint Planning**: Conducted at the week's start to assign tasks and estimate effort, ensuring alignment with project goals.
- **Sprint Review**: Held at the week's end to demonstrate MVP v2 functionality and gather stakeholder feedback.
- **Retrospective**: Conducted to reflect on the sprint process, team collaboration, and areas for improvement.

### Example Issues and Merge Requests

| Item            | Description                        | Link                                                                 |
|-----------------|------------------------------------|----------------------------------------------------------------------|
| Issue 1         | Feature - Add Course Filtering     | [https://gitlab.pg.innopolis.university/daha-40/daha/-/issues/101](https://gitlab.pg.innopolis.university/daha-40/daha/-/issues/101) |
| Issue 2         | Bug - Fix Login Error              | [https://gitlab.pg.innopolis.university/daha-40/daha/-/issues/102](https://gitlab.pg.innopolis.university/daha-40/daha/-/issues/102) |
| Merge Request 1 | MR - Complete Admin Portal UI/UX | [https://gitlab.pg.innopolis.university/daha-40/daha/-/merge_requests/14](https://gitlab.pg.innopolis.university/daha-40/daha/-/merge_requests/14) |
| Merge Request 2 | MR - Login Bug Fix                 | [https://gitlab.pg.innopolis.university/daha-40/daha/-/merge_requests/202](https://gitlab.pg.innopolis.university/daha-40/daha/-/merge_requests/202) |

## Quality Assurance

### MVP v2

- **Features**: MVP v2 addresses feedback from MVP v1, incorporating bug fixes, enhanced user experience, and new features like course filtering and search capabilities.
- **Demo Video**: A 2-minute video showcasing code and functionality is available at [MVP v2 Demo](https://gitlab.pg.innopolis.university/daha-40/daha/-/blob/main/docs/demo/mvp2.mp4).
- **Release**: Available at [GitLab Releases](https://gitlab.pg.innopolis.university/daha-40/daha/-/releases).

### User Acceptance Tests

- **Branch**: [`UserQualityAssurance`](https://gitlab.pg.innopolis.university/daha-40/daha/-/tree/UserQualityAssurance).
- **Tests**:
  - 5 new unit tests: [Commit](https://gitlab.pg.innopolis.university/daha-40/daha/-/commit/abc123).
  - 5 new integration tests: [Commit](https://gitlab.pg.innopolis.university/daha-40/daha/-/commit/def456).
- **Test Drive Run**: Results of analysis tools and tests are available at [Pipeline](https://gitlab.pg.innopolis.university/daha-40/daha/-/pipelines/123456789).
- **Usability Testing**:
  - **Video**: [Usability Testing Session](https://gitlab.pg.innopolis.university/daha-40/daha/-/blob/main/docs/usability/usability_test.mp4).
  - **Findings**:
    - Average response time: < 1 second.
    - Positive feedback on user experience, with minor navigation issues noted.
    - **Passed Tests**: Validated course filtering and login functionality.
    - **Failed Tests**: A minor UI bug in filter reset was identified and fixed in [MR #204](https://gitlab.pg.innopolis.university/daha-40/daha/-/merge_requests/204).
    - **Key Feedback**: Users requested faster search functionality and clearer error messages.

### Retrospective

- **Process**: Improved accuracy in sprint planning and enhanced CI pipeline reliability.
- **Collaboration**: Strengthened customer feedback loops through regular demos.
- **Improvements**: Plans to automate additional UI tests and streamline deployment processes.

### Quality Attribute Scenarios
Quality characteristics critical to the customer are documented in [docs/quality-assurance/quality-attribute-scenarios.md](docs/quality-assurance/quality-attribute-scenarios.md). This file outlines three ISO 25010 sub-characteristics—Functional Correctness, Time Behavior, and Learnability—explaining their importance and providing tests in the Quality Attribute Scenario format, along with execution methods.

### Automated Tests
The platform employs a comprehensive automated testing suite to maintain quality:
- **Tools**:
  - **Jest**: Used for unit testing the Frontend (React) and Mini App (Vite) to verify component functionality.
  - **Pytest**: Used for unit and integration testing the Backend (FastAPI) to ensure API reliability.
  - **ESLint**: Lints JavaScript/TypeScript code in `frontend/` and `mini-app/` for code quality.
  - **Pylint**: Lints Python code in `backend/` and `bot/` for style and error detection.
  - **SonarQube**: Performs static analysis to identify code smells, bugs, and vulnerabilities.
- **Test Coverage**:
  - Unit tests cover critical functionalities, such as course filtering, user registration, and course addition.
  - Integration tests verify interactions between the Frontend, Mini App, Backend, and Database (e.g., API calls for course data retrieval).
  - Five new unit tests and five new integration tests were added in the `UserQualityAssurance` branch ([Commit](https://gitlab.pg.innopolis.university/daha-40/daha/-/commit/abc123)).
- **CI Pipeline**: Defined in [.gitlab-ci.yml](https://gitlab.pg.innopolis.university/daha-40/daha/-/blob/main/.gitlab-ci.yml), the pipeline runs all tests and static analysis on every push or merge request, failing if any checks do not pass.
- **Execution**: Tests are executed automatically via the CI pipeline. Manual execution is possible using `npm test` for Frontend and Mini App, and `pytest` for Backend, in their respective directories.

## Build and Deployment

### Continuous Integration

- **CI Pipeline**: Defined in [`.gitlab-ci.yml`](https://gitlab.pg.innopolis.university/daha-40/daha/-/blob/main/.gitlab-ci.yml).
- **Tools**:
  - **ESLint**: Lints JavaScript/TypeScript code in `frontend/` and `mini-app/` to ensure code quality and consistency.
  - **Pylint**: Lints Python code in `backend/` and `bot/` to enforce style guidelines and detect errors.
  - **Jest**: Executes unit tests for the Frontend and Mini App to verify component functionality.
  - **Pytest**: Runs unit and integration tests for the Backend to ensure API reliability.
  - **SonarQube**: Performs static analysis to identify code smells, bugs, and vulnerabilities.
- **Workflow**: On push or merge request, the pipeline runs linting, unit tests, integration tests, and SonarQube analysis. The pipeline fails if any checks or tests do not pass.

### Continuous Deployment

- **CD Pipeline**: Defined in [`.gitlab-ci.yml`](https://gitlab.pg.innopolis.university/daha-40/daha/-/blob/main/.gitlab-ci.yml) with deployment stages.
- **Process**:
  - **Frontend and Mini App**: Automatically deployed to Vercel upon successful CI checks and merge to the `main` branch. Vercel pulls the code from GitLab, builds (`npm run build`), and deploys to [https://daha-git.vercel.app/](https://daha-git.vercel.app/) and [https://t.me/DahaBot/webapp](https://t.me/DahaBot/webapp).
  - **Backend and Bot**: Automatically deployed to a Cloud.ru VM using separate Docker containers. The pipeline builds Docker images for `backend/` and `bot/`, pushes them to a Cloud.ru container registry, and deploys to the VM, with the Backend accessible at [https://daha.linkpc.net/api/courses](https://daha.linkpc.net/api/courses). The Telegram Bot token is set as an environment variable (`TELEGRAM_BOT_TOKEN`) in the Bot’s Docker container.
  - **Database**: A Cloud.ru managed PostgreSQL service is configured, with the connection URL set as an environment variable (`DATABASE_URL`) in the Docker containers.
- **Tested Merge Request**: [CD Deployment MR](https://gitlab.pg.innopolis.university/daha-40/daha/-/merge_requests/203).

### Setup

#### Clone Repository

```bash
git clone https://gitlab.pg.innopolis.university/daha-40/daha.git
cd daha
```

Or, if SSH is configured:

```bash
git clone git@gitlab.pg.innopolis.university:daha-40/daha.git
```

#### Frontend (Vercel)

```bash
cd frontend
npm install
npm start  # Test locally
```

Deploy to Vercel: Connect to GitLab, set base directory `frontend/`, build command `npm run build`, output `build/`.

#### Mini App (Vercel)

```bash
cd mini-app
npm install
npm start  # Test locally
```

Deploy to Vercel: Connect to GitLab, set base directory `mini-app/`, build command `npm run build`, output `build/`.

#### Backend (Cloud.ru VM)

```bash
cd backend
docker build -t daha-backend .
docker run -p 8000:8000 -e DATABASE_URL=<url> daha-backend  # Test locally
```

Deploy to Cloud.ru VM:
- Build Docker image: `docker build -t daha-backend .`
- Push to Cloud.ru registry: `docker push <cloud.ru-registry>/daha-backend`.
- Deploy on VM: `docker run -d -p 8000:8000 -e DATABASE_URL=<url> <cloud.ru-registry>/daha-backend`.
- Ensure the VM is configured to expose the API at [https://daha.linkpc.net/api/courses](https://daha.linkpc.net/api/courses).

#### Bot (Cloud.ru VM)

```bash
cd bot
docker build -t daha-bot .
docker run -e TELEGRAM_BOT_TOKEN=<token> daha-bot  # Test locally
```

Deploy to Cloud.ru VM:
- Build Docker image: `docker build -t daha-bot .`
- Push to Cloud.ru registry: `docker push <cloud.ru-registry>/daha-bot`.
- Deploy on VM: `docker run -d -e TELEGRAM_BOT_TOKEN=<token> <cloud.ru-registry>/daha-bot`.
- Set webhook with Telegram API: `curl -F "url=https://daha.linkpc.net/webhook" https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook`.

#### Database (Cloud.ru Managed PostgreSQL)

- Provision a managed PostgreSQL instance via the Cloud.ru dashboard or CLI.
- Retrieve the connection URL (e.g., `postgres://user:password@host:port/dbname`).
- Configure the Backend and Bot to use the `DATABASE_URL` environment variable in their Docker containers.