<template>
  <div class="max-w-4xl mx-auto">
    <Nav msg="Selamat datang di perpustakaan" />
    <div class="flex flex-col justify-start items-center mt-28">
      <router-view />
    </div>
  </div>
</template>

<script>
import Nav from "./components/Nav.vue";

export default {
  name: "App",
  components: {
    Nav,
  },
};
</script>
