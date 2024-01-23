<template lang="">
  <div class="bg-slate-500 w-1/2 p-5 rounded-2xl mt-28">
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
import { tokenAuthorization } from "../axios";
import Swal from "sweetalert2";
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
      try {
        const responseUser = await axios.post("users/login", {
          username: this.username,
          password: this.password,
        });
        const token = responseUser.data.token;
        tokenAuthorization(token);
        try {
          const response = await axios.get("books");
          this.$store.dispatch("books", response.data.data.books);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Sign in success",
            showConfirmButton: false,
            timer: 1500,
          });
          this.$router.push("/");
        } catch (err) {
          if (err.response.status === 401) {
            Swal.fire({
              title: err.response.data.message,
              text: "Do you want to continue",
              icon: "error",
              confirmButtonText: "Cool",
            });
            tokenAuthorization(null);
          }
        }
      } catch (error) {
        Swal.fire({
          title: error.response.data.message,
          text: "Do you want to continue",
          icon: "error",
          confirmButtonText: "Cool",
        });
        const errorMessage = error.response.data.message;
        if (errorMessage.toLowerCase().includes("password")) {
          this.password = null;
        } else {
          this.username = null;
          this.password = null;
        }
      }
    },
  },
};
</script>
