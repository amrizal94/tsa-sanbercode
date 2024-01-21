<template>
  <div class="max-w-full">
    <Nav msg="Selamat datang di perpustakaan" />
    <div class="flex flex-col justify-start items-center mt-28">
      <router-view />
    </div>
  </div>
</template>

<script>
import Nav from "./components/Nav.vue";
import axios from "axios";

export default {
  name: "App",
  components: {
    Nav,
  },
  data() {
    return {
      books: null,
    };
  },
  async created() {
    try {
      const response = await axios.get("books");
      this.$store.dispatch("books", response.data.data.books);
    } catch (err) {
      if (err.response.status === 401) {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
      }
    }
  },
};
</script>
