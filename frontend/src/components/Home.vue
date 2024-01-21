<template lang="">
  <div>
    <h3>HOME</h3>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "Home",
  async created() {
    const response = axios.get("books");
    console.log(response);
  },
};
</script>
<style lang=""></style>
