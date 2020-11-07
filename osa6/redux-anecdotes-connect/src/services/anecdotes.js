import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNewAnecdote = async (newAnecdote) => {
  const obj = { ...newAnecdote };
  const response = await axios.post(baseUrl, obj);
  return response.data;
};

const updateAnecdote = async (updateAnecdote) => {
  const url = `${baseUrl}/${updateAnecdote.id}`;
  const response = await axios.put(url, updateAnecdote);
  return response.data;
};

export default { getAll, createNewAnecdote, updateAnecdote };
