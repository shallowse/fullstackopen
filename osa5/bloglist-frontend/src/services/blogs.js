import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data;
};

const postNewBlog = async (newBlog = {}) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const updateBlog = async (blogId = '', updateBlog = {}) => {
  const response = await axios.put(`${baseUrl}/${blogId}`, updateBlog);
  return response.data;
};

const exportBundle = {
  getAll,
  postNewBlog,
  updateBlog,
  setToken,
}

export default exportBundle;
