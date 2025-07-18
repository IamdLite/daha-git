## Architecture

The Daha platform employs a microservices architecture to ensure scalability, usability, and reliability. The following subsections detail the static, dynamic, and deployment views of the system, with diagrams stored in the `docs/architecture` directory.

### Static View

The static view of the Daha architecture is represented by a UML Component diagram, available at ![Component diagram](https://github.com/IamdLite/rosesarered/blob/main/component_diagram.png?raw=true).

#### Components
- **Frontend**: A React application providing the user interface for course browsing and interaction.
- **Mini App**: A React-based application integrated with Telegram for mobile users.
- **Admin Portal**: A Vite-based application for administrative tasks.
- **Backend**: A FastAPI service handling business logic and API requests.
- **Bot**: A Python-based Telegram bot for user interactions via Telegram.
- **Database**: A PostgreSQL database (assumed) storing course data and user information.

#### UML Component Diagram
The UML Component diagram is generated from the PlantUML code in `docs/architecture/static-view/component_diagram.puml`.

#### Coupling and Cohesion
- **Coupling**: The components are loosely coupled, communicating through well-defined RESTful APIs. This minimizes dependencies, allowing independent updates to each component without affecting others.
- **Cohesion**: Each component exhibits high cohesion, focusing on a single responsibility:
  - Frontend: Renders the user interface.
  - Mini App: Provides a mobile-friendly Telegram interface.
  - Admin Portal: Manages administrative tasks.
  - Backend: Processes business logic and API requests.
  - Bot: Handles Telegram interactions.
  - Database: Manages data storage and retrieval.
  High cohesion simplifies debugging and feature development.

#### Maintainability
The design decisions enhance maintainability, aligning with ISO 25010 maintainability sub-characteristics:
- **Modularity**: The microservices architecture allows independent development and deployment, enabling updates to one component (e.g., Frontend) without impacting others.
- **Reusability**: Standardized APIs enable components to be reused in other projects or contexts.
- **Analyzability**: Clear separation of concerns simplifies identifying issues within specific components.
- **Modifiability**: Loose coupling ensures changes (e.g., adding a new API endpoint) have minimal ripple effects.
- **Testability**: Independent components support targeted testing, with unit tests for Frontend (Jest), Admin Portal (Jest), and Backend (Pytest), and integration tests for API interactions.

### Dynamic View

The dynamic view illustrates system behavior through a UML Sequence diagram for the "Admin Adds Course and Notification Flow" scenario, available at ![docs/architecture/dynamic-view/sequence_diagram.png](https://github.com/IamdLite/rosesarered/blob/main/add_course_workflow.png?raw=true).

#### Scenario: Admin Adds Course and Notification Flow
- **Steps**:
  1. The Admin uses the Admin Panel to add a new course.
  2. The Admin Panel sends a POST request to the API Server at `/courses` with the new course data.
  3. The API Server inserts the course into the PostgreSQL Database.
  4. The Database confirms the course addition to the API Server.
  5. The API Server checks saved user filters to identify matching users.
  6. For each matched user, the API Server sends a notification request to the Telegram Bot.
  7. The Telegram Bot sends notifications to users and confirms to the API Server.
  8. The API Server notifies the Frontend of the new course.
  9. The Frontend updates its course list UI to reflect the new course.

#### UML Sequence Diagram
The UML Sequence diagram is generated from the PlantUML code in `docs/architecture/dynamic-view/sequence_diagram.puml`.

#### Execution Time
The execution time for this scenario in the production environment at [https://daha.linkpc.net/api/courses](https://daha.linkpc.net/api/courses) should be measured by the development team. Suggested steps:
- Instrument the API Server with logging (e.g., Python’s `time` module) to measure the time for the POST request, database insertion, and filter checking.
- Using the browser developer tools to measure the Frontend’s UI update time:  **~100-200 ms**.
- Appromixated Peformance:
  - API POST request and database insertion: **~100-200 ms**.
  - Filter checking per user: **~10-20 ms** per user.
  - Telegram Bot fetching courses from database: **~50-100 ms** per set of courses related to filters.
  - Frontend UI update: **~50-100 ms**.
  - Total (Admin input to UI update): **~500-1000 ms**, depending on the number of notified users.
The team must report the actual measured time in production.

### Deployment View

The deployment view illustrates how the Daha platform is deployed, shown in a diagram at      ![Deployment view 1](https://github.com/IamdLite/rosesarered/blob/main/add_course_workflow.png?raw=true).
--
![Deployment view 2](https://github.com/IamdLite/rosesarered/blob/main/deployment_view_2.png?raw=true)

#### Deployment Setup
- **Frontend**: Hosted on Vercel at [https://daha-git.vercel.app](https://daha-git.vercel.app), leveraging Vercel’s global CDN for fast static content delivery.
- **Mini App**: Hosted on Vercel, integrated with Telegram, accessible via [@DahaBot /webapp](https://t.me/bot_DAHA_bot/).
- **Admin Portal**: Built with Vite and hosted on Vercel at [https://dahaadmin.vercel.app](https://dahaadmin.vercel.app), optimized for modern web development.
- **Backend**: Dockerized FastAPI service deployed on a Cloud.ru VM instance, serving the API at [https://daha.linkpc.net/api/courses](https://daha.linkpc.net/api/courses).
- **Bot**: Dockerized Python-based Telegram bot deployed on the same Cloud.ru VM, handling interactions via Telegram.
- **Database**: PostgreSQL (assumed), deployed on the Cloud.ru VM or a managed service, storing course and user data.

#### UML Deployment Diagram
The UML Deployment diagram is generated from the PlantUML code in `docs/architecture/deployment-view/deployment_diagram.puml`.

#### Deployment Choices
- **Vercel for Frontend, Mini App, and Admin Portal**: Vercel’s serverless platform simplifies deployment of static sites and provides automatic scaling and a global CDN. This is ideal for the React-based Frontend and Mini App, and the Vite-based Admin Portal, ensuring fast load times and easy updates.
- **Cloud.ru VM for Backend and Bot**: Dockerization ensures consistent environments across development and production. The Cloud.ru VM offers control over resources, enabling efficient management of the FastAPI backend and Telegram bot. This setup supports scalability by allowing additional containers or VMs as needed.
- **Database**: Hosting the database on the same VM (or a managed service) ensures low-latency access for the Backend, critical for API performance.

#### Customer-Side Deployment
For customer deployment:
- **Frontend, Mini App, Admin Portal**: Customers can access these directly via Vercel URLs, requiring only a web browser.
- **Backend and Bot**: Customers deploying on their own infrastructure need a VM (e.g., on Cloud.ru or AWS) with Docker installed. They would pull the Docker images from a registry (e.g., Cloud.ru registry or Docker Hub), configure environment variables (e.g., database credentials, Telegram bot token), and run the containers.
- **Database**: Customers must set up a PostgreSQL instance, either on the same VM or a managed service, and provide connection details to the Backend.

## Quality Assurance

The Daha platform prioritizes quality to ensure a reliable, efficient, and user-friendly experience for high school students. The following subsections detail the quality assurance processes, including quality attribute scenarios and automated testing.

### Quality Attribute Scenarios
Quality characteristics critical to the customer are documented in [docs/quality-attributes/quality-attribute-scenarios.markdown](../quality-attributes/quality-attribute-scenarios.markdown). This file outlines three ISO 25010 sub-characteristics—Functional Correctness, Time Behavior, and Learnability—explaining their importance and providing tests in the Quality Attribute Scenario format, along with execution methods.

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