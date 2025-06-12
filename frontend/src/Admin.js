import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [courses, setCourses] = useState([]);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('https://your-pythonanywhere-url/api/courses')
        .then(response => setCourses(response.data))
        .catch(error => console.error('Error fetching courses:', error));
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="App">
        <h1>Admin Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Admin Panel</h1>
      <ul>
        {courses.map(course => (
          <li key={course.id}>{course.name} by {course.provider}</li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
