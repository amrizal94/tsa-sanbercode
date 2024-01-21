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
    const response = await axios.get("books");
    console.log(response);
    console.log(localStorage.getItem("token"));
  },
};
</script>
<style lang=""></style>
