import axios from "axios";

export const tokenAuthorization = (token) => {
  axios.defaults.headers.common['Authorization'] = "Bearer " + token;
}
axios.defaults.baseURL = process.env.VUE_APP_API_HOST;