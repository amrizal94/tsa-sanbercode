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
    async getBooks() {
      try {
        const response = await axios.get("books");
        this.$store.dispatch("books", response.data.data.books);
      } catch (error) {
        return error.response.data.message;
      }
    },
  },
  created() {
    this.getBooks().then((errorMessage) => {
      if (errorMessage === "Token diperlukan") {
        const token = localStorage.getItem("token");
        if (token) tokenAuthorization(token);
        this.getBooks().then((errorMessage) => {
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
  },
};
</script>
