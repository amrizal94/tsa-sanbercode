<template lang="">
  <div class="bg-slate-500 w-1/2 p-5 rounded-2xl">
    <h1 class="text-yellow-50 font-serif text-4xl tracking-wider text-center">
      Sign Up
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
        type="email"
        placeholder="Email"
        class="input input-bordered w-full"
        v-model="email"
      />
      <input
        type="password"
        placeholder="Password"
        class="input input-bordered w-full"
        v-model="password"
      />
      <button class="btn w-full btn-success">Sign Up</button>
      <div class="label">
        <span class="label-text-alt">already have an account?</span>
        <span class="label-text-alt text-white"
          ><router-link to="/login">Sign In</router-link></span
        >
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: "Register",
  data() {
    return {
      username: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await axios.post("users/register", {
          username: this.username,
          email: this.email,
          password: this.password,
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        this.$router.push("/login");
      } catch (error) {
        Swal.fire({
          title: error.response.data.message,
          text: "Do you want to continue",
          icon: "error",
          confirmButtonText: "Cool",
        });
      }
    },
  },
};
</script>
<style lang=""></style>
