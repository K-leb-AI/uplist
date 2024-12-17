import axios from 'axios';

axios.defaults.withCredentials = true;
const baseUrl =
  import.meta.env.MODE === 'development' ? 'http://localhost:8000/api' : '/api';

export const signup = async ({ formData }) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/signup`, formData);
    console.log('Signup successful:', response.data);
    return 'Signed In successfully!';
  } catch (error) {
    console.log('Signup Failed:', error);
    return error.response.data.message;
  }
};

export const login = async ({ formData }) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/login`, formData);
    console.log('Login successful:', response.data);
    return 'Logged In successfully!';
  } catch (error) {
    console.log('Signup Failed:', error);
    return error.response.data.message;
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${baseUrl}/auth/logout`);
    return response.data;
  } catch (error) {
    console.log('Signup Failed:', error);
    return error.response.data.message;
  }
};

export const checkAuth = async () => {
  try {
    const response = await axios.post(`${baseUrl}/auth/check`);
    return response;
  } catch (error) {
    console.log('Unauthorized:', error);
    return error.response.data.message;
  }
};

export const dailySummary = async () => {
  try {
    const response = await axios.get(`${baseUrl}/summary`);
    return response;
  } catch (error) {
    console.log('Something went wrong:', error);
    return error.response.data.message;
  }
};

export const getCollections = async () => {
  try {
    const response = await axios.get(`${baseUrl}/collections/`);
    return response;
  } catch (error) {
    console.log('Something went wrong:', error);
    return error.response.data.message;
  }
};

export const getOneCollection = async (collectionId) => {
  try {
    const response = await axios.get(`${baseUrl}/collections/${collectionId}`);
    return response;
  } catch (error) {
    console.log('Something went wrong:', error);
    return error.response.data.message;
  }
};

export const postCollection = async ({ collectionData }) => {
  try {
    const response = await axios.post(
      `${baseUrl}/collections/`,
      collectionData
    );
    return response;
  } catch (error) {
    console.log('Something went wrong:', error);
    return error.response.data.message;
  }
};

export const deleteCollection = async (collectionId) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/collections/${collectionId}`
    );
    return response;
  } catch (error) {
    console.log('Something went wrong:', error);
    return error.response.data.message;
  }
};

export const getTodosInCollection = async (collectionId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/collections/${collectionId}/todos`
    );
    return response;
  } catch (error) {
    console.log('Something went wrong:', error);
    return error.response.data.message;
  }
};

export const updateTodo = async (todoId, collectionId, todoData) => {
  try {
    const response = await axios.put(`${baseUrl}/todos/${todoId}`, todoData);
    return response;
  } catch (error) {
    return error.response.data.message;
  }
};

export const deleteTodo = async (todoId, collectionId) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/collections/${collectionId}/todos/${todoId}`
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log('Something went wrong:', error);
    return error.response.data.message;
  }
};

export const postTodo = async ({ todoData, collectionId }) => {
  console.log(todoData);
  try {
    const response = await axios.post(
      `${baseUrl}/collections/${collectionId}/todos`,
      todoData
    );
    return response;
  } catch (error) {
    console.log('Something went wrong:', error);
    return error.response.data.message;
  }
};
