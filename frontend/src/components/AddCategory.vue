<template lang="">
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <h3 class="font-bold text-lg">Add New Category</h3>
    <div class="flex gap-5">
      <input
        type="text"
        placeholder="Categoy Name"
        class="input input-bordered w-full max-w-xs"
        v-model="name"
        required
      />
      <button class="btn" type="submit">Save</button>
      <div class="btn" @click="handleClick(modalChildren)">Cancel</div>
    </div>
  </form>
</template>
<script>
import axios from "axios";
import Swal from "sweetalert2";
import { mapGetters } from "vuex";
export default {
  name: "AddCategory",
  data() {
    return {
      name: null,
    };
  },
  computed: {
    ...mapGetters(["modalChildren"]),
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await axios.post("categories", {
          name: this.name,
        });
        Swal.fire({
          position: "top-right",
          icon: "success",
          title: "Add Category",
          text: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        try {
          const response = await axios.get("categories");
          this.$store.dispatch("categories", response.data.data.categories);
        } catch (error) {
          Swal.fire({
            title: error.response.data.message,
            text: "Do you want to continue",
            icon: "error",
            confirmButtonText: "Cool",
          });
        }
        this.$store.dispatch("modalChildren", false);
      } catch (error) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Failed to add category",
          text: error.response.data.message,
          confirmButtonText: "Oke",
        });
        if (
          error.response.data.message ===
          "Your's session has expired and must log in again."
        ) {
          localStorage.removeItem("token");
          this.$store.dispatch("books", null);
          this.$store.dispatch("isModalOpen", false);
          this.$store.dispatch("modalChildren", false);
          this.$store.dispatch("modal", null);
          this.$router.push("/login");
        }
      }
    },
    handleClick(modalChildren) {
      this.$store.dispatch("modalChildren", !modalChildren);
    },
  },
};
</script>
<style lang=""></style>
