<template lang="">
  <div class="bg-slate-500 w-1/2 p-5 rounded-2xl">
    <h1 class="text-yellow-50 font-serif text-4xl tracking-wider text-center">
      Sign In
    </h1>
    <form
      @submit.prevent="handleSubmit"
      class="p-5 box-border flex flex-col justify-center gap-2"
    >
      <input
        type="text"
        placeholder="Username"
        class="input input-bordered w-full"
        v-model="username"
      />
      <input
        type="password"
        placeholder="Password"
        class="input input-bordered w-full"
        v-model="password"
      />
      <button class="btn w-full">Sign In</button>
      <div class="label">
        <span class="label-text-alt">Don't have an account yet?</span>
        <span class="label-text-alt text-white">
          <router-link to="/register">Sign Up</router-link>
        </span>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async handleSubmit() {
      const response = await axios.post("users/login", {
        username: this.username,
        password: this.password,
      });
      if (response.status == 200) {
        localStorage.setItem("token", response.data.token);
        this.$router.push("/");
      }
    },
  },
};
</script>
<style lang=""></style>
