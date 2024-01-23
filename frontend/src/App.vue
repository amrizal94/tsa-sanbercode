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
export default {
  name: "App",
  components: {
    Nav,
  },
  async created() {
    try {
      const response = await axios.get("books");
      this.$store.dispatch("books", response.data.data.books);
    } catch (err) {
      if (err.response.status === 401) {
        tokenAuthorization(null);
      }
    }
  },
};
</script>
