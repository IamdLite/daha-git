import axios from 'axios';

// GET COURSES
export const fetchCourses = async () => {
  const response = await axios
    .get('https://daha.linkpc.net/courses')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET SINGLE COURSE
export const fetchSingleProduct = async (id: string) => {
  const response = await axios
    .get(`https://daha.linkpc.net/course/${id}`)
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL USERS
export const fetchTotalUsers = async () => {
  const response = await axios
    .get('https://daha.linkpc.net/users')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

