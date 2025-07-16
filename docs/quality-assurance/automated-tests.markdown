### Automated Tests
The platform employs a comprehensive automated testing suite to maintain quality:
- **Tools**:
  - **Jest**: Used for unit testing the Frontend (React) and Admin Portal (Vite) to verify component functionality.
  - **Pytest**: Used for unit and integration testing the Backend (FastAPI) to ensure API reliability.
  - **ESLint**: Lints JavaScript/TypeScript code in `frontend/` and `admin portal/` for code quality.
  - **Pylint**: Lints Python code in `backend/` and `telegram-bot/` for style and error detection.
  - **SonarQube**: Performs static analysis to identify code smells, bugs, and vulnerabilities.
- **Test Coverage**:
  - Unit tests cover critical functionalities, such as course filtering, user registration, and course addition. 
  - Integration tests verify interactions between the Frontend, Admin Portal, Backend, and Database (e.g., API calls for course data retrieval).
  - Five new unit tests and five new integration tests were added in the `UserQualityAssurance` branch ([Commit](https://gitlab.pg.innopolis.university/daha-40/daha/-/commit/abc123)).
- **CI Pipeline**: Defined in [.gitlab-ci.yml](https://gitlab.pg.innopolis.university/daha-40/daha/-/blob/main/.gitlab-ci.yml), the pipeline runs all tests and static analysis on every push or merge request, failing if any checks do not pass.
- **Execution**: Tests are executed automatically via the CI pipeline. Manual execution is possible using `npm test` for Frontend and Admin Portal, and `pytest` for Backend, in their respective directories.

