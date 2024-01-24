import axios from "axios";

export const tokenAuthorization = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = "Bearer " + token;
  } else {
    axios.defaults.headers.common['Authorization'] = ""
  }
}
axios.defaults.baseURL = process.env.VUE_APP_API_HOST;