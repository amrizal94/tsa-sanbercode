<template lang="">
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <h3 class="font-bold text-lg">Add New Category</h3>
    <div class="flex gap-5">
      <input
        type="text"
        placeholder="Name of the new category"
        class="input input-bordered w-full max-w-xs"
        v-model="name"
        required
      />
      <button class="btn" type="submit">Button</button>
    </div>
  </form>
</template>
<script>
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: "AddCategory",
  data() {
    return {
      name: null,
    };
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
        this.$store.dispatch("modal", null);
        this.$store.dispatch("isModalOpen", false);
      } catch (error) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Add Category",
          text: error.response.data.message,
          confirmButtonText: "Oke",
        });
      }
    },
  },
};
</script>
<style lang=""></style>
