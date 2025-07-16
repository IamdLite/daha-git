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
