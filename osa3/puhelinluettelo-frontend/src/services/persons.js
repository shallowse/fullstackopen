import axios from 'axios';

const baseUrl = '/api/persons';

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const postPerson = (newPerson = {}) => {
  const request = axios.post(baseUrl, newPerson);
  return request.then(response => response.data);
}

const deletePerson = (personId = '') => {
  const url = `${baseUrl}/${personId}`;
  const request = axios.delete(url);

  // json-server returns an empty object if the deletion was successful
  return request.then(response => response.data);
}

const updatePerson = (person = '') => {
  const url = `${baseUrl}/${person.id}`;
  const request = axios.put(url, person);

  return request.then(response => response.data);
};

// This removes the following notification
// "Assign object to a variable before exporting as module default  import/no-anonymous-default-export"
const exportBundle = {
  getAll,
  postPerson,
  deletePerson,
  updatePerson,
}

export default exportBundle;
