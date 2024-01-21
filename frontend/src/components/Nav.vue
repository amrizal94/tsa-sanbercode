<template>
  <nav class="navbar bg-neutral text-neutral-content">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl">Library</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1" v-if="books">
        <li
          class="bg-slate-700 mx-2 hover:bg-gray-500"
          @click="handleClickSignOut"
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
import Swal from "sweetalert2";
import { mapGetters } from "vuex";
export default {
  name: "Nav",
  computed: {
    ...mapGetters(["books"]),
  },
  data() {
    return {
      token: null,
    };
  },
  created() {
    this.token = localStorage.getItem("token");
  },
  methods: {
    handleClickSignOut() {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Sign out success",
        showConfirmButton: false,
        timer: 1500,
      });
      localStorage.removeItem("token");
      this.$store.dispatch("books", null);
      this.$router.push("/login");
    },
  },
};
</script>
