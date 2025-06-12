 import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MainFrontend() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('https://your-pythonanywhere-url/api/courses')
      .then(response => setCourses(response.data))
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  return (
    <div className="App">
      <h1>Welcome to Daha</h1>
      <p>Free Course Aggregator for High School Students</p>
      <ul>
        {courses.map(course => (
          <li key={course.id}>{course.name} by {course.provider}</li>
        ))}
      </ul>
    </div>
  );
}

export default MainFrontend;
