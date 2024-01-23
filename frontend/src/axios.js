import axios from "axios";

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token")
axios.defaults.baseURL = process.env.VUE_APP_API_HOST