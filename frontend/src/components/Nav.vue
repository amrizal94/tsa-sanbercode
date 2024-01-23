<template>
  <nav class="navbar bg-neutral text-neutral-content">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl"
        ><router-link to="/">Library</router-link></a
      >
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1" v-if="books">
        <li
          class="bg-slate-700 mx-2 hover:bg-gray-500 p-2 cursor-pointer"
          @click="handleClick"
        >
          Sign out
        </li>
      </ul>
      <ul class="menu menu-horizontal px-1" v-if="!books">
        <li class="bg-slate-700 mx-2 hover:bg-gray-500">
          <router-link to="/register">Sign Up</router-link>
        </li>
        <li class="bg-slate-700 mx-2 hover:bg-gray-500">
          <router-link to="/login">Sign in</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { tokenAuthorization } from "../axios";
import Swal from "sweetalert2";
import { mapGetters } from "vuex";
export default {
  name: "Nav",
  computed: {
    ...mapGetters(["books"]),
  },
  methods: {
    handleClick() {
      Swal.fire({
        position: "top-right",
        icon: "success",
        title: "Sign out success",
        showConfirmButton: false,
        timer: 1500,
      });
      tokenAuthorization(null);
      this.$store.dispatch("books", null);
      this.$router.push("/login");
    },
  },
};
</script>
