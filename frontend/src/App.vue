<template>
  <div class="max-w-full">
    <Nav />
    <div class="flex flex-col justify-start items-center">
      <router-view />
    </div>
  </div>
</template>

<script>
import Nav from "./components/Nav.vue";
import axios from "axios";
import { tokenAuthorization } from "./axios";
import Swal from "sweetalert2";
export default {
  name: "App",
  components: {
    Nav,
  },
  methods: {
    async getAPI(endpoint) {
      try {
        const response = await axios.get(endpoint);
        const data = response.data.data[endpoint];

        this.$store.dispatch(endpoint, data);
        if (endpoint === "categories" && data.length < 0) {
          return "You don't have any categories";
        }
      } catch (error) {
        return error.response.data.message;
      }
    },
  },
  created() {
    this.getAPI("books").then((errorMessage) => {
      if (errorMessage === "Token diperlukan") {
        const token = localStorage.getItem("token");
        if (token) tokenAuthorization(token);
        this.getAPI("books").then((errorMessage) => {
          if (errorMessage) {
            Swal.fire({
              title: "Authentication",
              text: errorMessage,
              icon: "error",
              confirmButtonText: "Cool",
            });
          }
        });
      }
    });
    this.getAPI("categories").then((errorMessage) => {
      if (errorMessage === "Token diperlukan") {
        const token = localStorage.getItem("token");
        if (token) tokenAuthorization(token);
        this.getAPI("categories").then((errorMessage) => {
          if (errorMessage) {
            Swal.fire({
              title: "You don't have any categories",
              text: "Please add a new category",
              icon: "warning",
              confirmButtonText: "Cool",
            });
          }
        });
      }
    });
  },
};
</script>
