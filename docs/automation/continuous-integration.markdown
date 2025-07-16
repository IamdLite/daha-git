### Continuous Integration

- **CI Pipeline**: Defined in [`.gitlab-ci.yml`](https://gitlab.pg.innopolis.university/daha-40/daha/-/blob/main/.gitlab-ci.yml).
- **Tools**:
  - **ESLint**: Lints JavaScript/TypeScript code in `frontend/` and `mini-app/` to ensure code quality and consistency.
  - **Pylint**: Lints Python code in `backend/` and `bot/` to enforce style guidelines and detect errors.
  - **Jest**: Executes unit tests for the Frontend and Mini App to verify component functionality.
  - **Pytest**: Runs unit and integration tests for the Backend to ensure API reliability.
  - **SonarQube**: Performs static analysis to identify code smells, bugs, and vulnerabilities.
- **Workflow**: On push or merge request, the pipeline runs linting, unit tests, integration tests, and SonarQube analysis. The pipeline fails if any checks or tests do not pass.