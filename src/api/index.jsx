import axios from 'axios';
// Forkify API v1 documentation: http://forkify-api.herokuapp.com
let instance = axios.create({
  baseURL: 'https://forkify-api.herokuapp.com/api/',
});

export default instance;
