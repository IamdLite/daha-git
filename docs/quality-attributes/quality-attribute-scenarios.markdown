## Functional Suitability

### Functional Correctness

#### Importance
Functional correctness ensures that the Daha platform delivers accurate course information and reliable functionality, which is critical for high school students making academic decisions. Inaccurate filtering, course details, or user registration processes could mislead users, erode trust, and reduce platform adoption. Confirmed with the customer, this sub-characteristic is vital for maintaining credibility and supporting students’ educational goals.

#### Tests
1. **Filter Functionality**
   - **Source**: User
   - **Stimulus**: A user applies a filter for "Mathematics" courses at the "Advanced" level.
   - **Artifact**: Filter feature (Frontend and Backend).
   - **Environment**: Production environment at [https://daha-git.vercel.app](https://daha-git.vercel.app) with real course data.
   - **Response**: The system returns a list of courses matching the "Mathematics" subject and "Advanced" level, excluding irrelevant courses.
   - **Response Measure**: 100% of returned courses match the filter criteria.
   - **Execution**: Manually apply filters for known criteria (e.g., "Mathematics" and "Advanced") and verify results against database entries using a SQL query (e.g., `SELECT * FROM courses WHERE subject = 'Mathematics' AND level = 'Advanced'`). Run automated tests with Jest (`frontend/tests/filter.test.js`) to simulate filter inputs and Pytest (`backend/tests/test_filter.py`) to validate API responses against expected database outputs. Results are logged in the CI pipeline ([Pipeline](https://gitlab.pg.innopolis.university/daha-40/daha/-/pipelines/123456789)).

2. **Course Details Display**
   - **Source**: User
   - **Stimulus**: A user clicks on a course to view its details.
   - **Artifact**: Course detail page (Frontend and Backend).
   - **Environment**: Production environment at [https://daha-git.vercel.app](https://daha-git.vercel.app).
   - **Response**: The page displays all required information (e.g., course name, description, instructor, schedule) accurately and completely.
   - **Response Measure**: All displayed fields match the database record with 100% accuracy.
   - **Execution**: Manually select multiple courses and compare displayed details with database records via SQL queries. Use automated Jest tests (`frontend/tests/course_details.test.js`) to fetch course details via API and Pytest tests (`backend/tests/test_course_details.py`) to verify API responses against database entries. Results are logged in the CI pipeline.

3. **User Registration**
   - **Source**: User
   - **Stimulus**: A new user submits valid registration credentials.
   - **Artifact**: Registration form (Frontend and Backend).
   - **Environment**: Production environment at [https://daha-git.vercel.app](https://daha-git.vercel.app).
   - **Response**: The system creates a new user account and sends a confirmation email (if applicable).
   - **Response Measure**: Account is created successfully, and the email (if configured) is sent within 5 seconds.
   - **Execution**: Manually test registration with valid and invalid inputs, checking account creation in the database and email delivery (if applicable). Run automated Pytest tests (`backend/tests/test_registration.py`) to simulate registration requests and verify database updates. Results are logged in the CI pipeline.

## Performance Efficiency

### Time Behavior

#### Importance
Time behavior is crucial for user satisfaction, as high school students expect quick responses when filtering courses or accessing information. Slow performance can frustrate users, reducing engagement and adoption. Confirmed with the customer, fast response times are essential to compete with other educational platforms and ensure a seamless experience.

#### Tests
1. **Filter Response Time**
   - **Source**: User
   - **Stimulus**: A user applies a filter for "Science" courses.
   - **Artifact**: Filter feature (Frontend and Backend).
   - **Environment**: Production environment with typical load at [https://daha-git.vercel.app](https://daha-git.vercel.app).
   - **Response**: The system returns results within 2 seconds.
   - **Response Measure**: Response time is ≤ 2 seconds for 95% of filter requests.
   - **Execution**: Use Chrome DevTools to measure time from filter submission to result display. Employ JMeter ([https://jmeter.apache.org/](https://jmeter.apache.org/)) to simulate 50 concurrent filter requests and measure average response time. Log results in the CI pipeline and document in `docs/quality-assurance/performance-report.md`.

2. **Page Load Time**
   - **Source**: User
   - **Stimulus**: A user navigates to the homepage or a course detail page.
   - **Artifact**: Web pages (Frontend).
   - **Environment**: Production environment at [https://daha-git.vercel.app](https://daha-git.vercel.app).
   - **Response**: Pages load within 3 seconds.
   - **Response Measure**: Load time is ≤ 3 seconds for 95% of page requests.
   - **Execution**: Use Google PageSpeed Insights ([https://pagespeed.web.dev/](https://pagespeed.web.dev/)) to measure load times for the homepage and course detail pages. Optimize assets (e.g., images) if needed. Log results in the CI pipeline and document in `docs/quality-assurance/performance-report.md`.

3. **API Response Time**
   - **Source**: Frontend or Admin Portal
   - **Stimulus**: The Frontend makes an API call to fetch course data.
   - **Artifact**: API endpoints (e.g., `/api/courses`).
   - **Environment**: Production environment at [https://daha.linkpc.net/api/courses](https://daha.linkpc.net/api/courses).
   - **Response**: API responds within 500 ms.
   - **Response Measure**: Response time is ≤ 500 ms for 95% of requests.
   - **Execution**: Use Postman ([https://www.postman.com/](https://www.postman.com/)) to measure response times for multiple endpoints. Add logging to the Backend (Python’s `time` module) to monitor API performance. Log results in the CI pipeline and document in `docs/quality-assurance/performance-report.md`.

## Usability

### Learnability

#### Importance
Learnability is essential for the Daha platform, as high school students, often novice users, need to quickly understand how to navigate and use the platform. An intuitive interface reduces the learning curve, encouraging adoption and sustained use. Confirmed with the customer, learnability is critical for ensuring students can independently find and explore courses.

#### Tests
1. **First-Time User Task Completion**
   - **Source**: New User
   - **Stimulus**: A new user is tasked with finding all Mathematics courses.
   - **Artifact**: User interface (Frontend).
   - **Environment**: First-time use at [https://daha-git.vercel.app](https://daha-git.vercel.app) with no prior training.
   - **Response**: The user completes the task within 5 minutes without assistance.
   - **Response Measure**: 80% of users complete the task within 5 minutes.
   - **Execution**: Conduct user testing with 5-10 high school students new to the platform. Provide the task, measure completion time, and collect feedback via a survey. Record sessions for analysis and document in `docs/quality-assurance/usability-report.md`.

2. **Intuitive Navigation**
   - **Source**: New User
   - **Stimulus**: A new user navigates to the course filter page.
   - **Artifact**: Navigation menu (Frontend).
   - **Environment**: First-time use at [https://daha-git.vercel.app](https://daha-git.vercel.app).
   - **Response**: The user finds the filter page within 2 minutes.
   - **Response Measure**: 80% of users reach the filter page within 2 minutes.
   - **Execution**: During user testing, observe 5-10 participants navigating to the filter page. Time their actions and note difficulties. Use feedback to improve navigation. Document in `docs/quality-assurance/usability-report.md`.

3. **Help and Documentation**
   - **Source**: User
   - **Stimulus**: A user seeks help on filtering courses.
   - **Artifact**: Help section or tooltips (Frontend).
   - **Environment**: During use at [https://daha-git.vercel.app](https://daha-git.vercel.app).
   - **Response**: The user finds relevant help information and applies it to complete the task.
   - **Response Measure**: 80% of users successfully use help resources to filter courses.
   - **Execution**: Test the help section with 5-10 users attempting to filter courses using documentation or tooltips. Verify task completion without external assistance. Document feedback and session recordings in `docs/quality-assurance/usability-report.md`.