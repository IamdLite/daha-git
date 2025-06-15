 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (window.TelegramWebApp) {
      window.TelegramWebApp.ready();
      window.TelegramWebApp.expand();
    }
    axios.get('https://your-pythonanywhere-url/api/courses')
      .then(response => setCourses(response.data))
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  return (
    <div className="App">
      <h1>Daha Mini App</h1>
      <p>Browse Courses in Telegram</p>
      <ul>
        {courses.map(course => (
          <li key={course.id}>{course.name} by {course.provider}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;