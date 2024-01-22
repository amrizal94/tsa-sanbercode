<template lang="">
  <form @submit.prevent="handleSubmit">
    <h3 class="font-bold text-lg">Add New Book</h3>
    <div class="modal-action flex flex-col gap-2">
      <div class="flex flex-col ml-2 gap-2">
        <input
          type="text"
          placeholder="Title"
          class="input input-bordered"
          v-model="title"
        />
        <input
          type="text"
          placeholder="Description"
          class="input input-bordered"
          v-model="description"
        />
      </div>
      <div class="flex justify-between">
        <input
          type="text"
          placeholder="Release Year"
          class="input input-bordered"
          v-model="release_year"
        />
        <input
          type="text"
          placeholder="Total Page"
          class="input input-bordered"
          v-model="total_page"
        />
      </div>
      <div class="flex justify-between gap-10">
        <select
          class="select select-bordered w-full max-w-xs"
          v-model="category_id"
        >
          <option disabled selected>Category</option>
          <option
            v-for="(category, index) in categories"
            :key="index"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <input
          type="text"
          placeholder="Price"
          class="input input-bordered"
          v-model="price"
        />
      </div>
      <input
        type="file"
        class="file-input w-full max-w-xs"
        @change="handleCHangeFile"
      />
      <button class="btn btn-info" type="submit">Save</button>
    </div>
  </form>
</template>
<script>
import { mapGetters } from "vuex";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "AddBook",
  data() {
    return {
      title: null,
      description: null,
      release_year: null,
      price: null,
      total_page: null,
      file: null,
      category_id: "Category",
    };
  },
  computed: {
    ...mapGetters(["categories"]),
  },
  methods: {
    async handleSubmit() {
      const formData = new FormData();
      formData.append("title", this.title);
      formData.append("description", this.description);
      formData.append("release_year", this.release_year);
      formData.append("price", this.price);
      formData.append("total_page", this.total_page);
      formData.append("category_id", this.category_id);
      formData.append("image", this.file);
      try {
        const response = await axios.post("books", formData);
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        this.$store.dispatch("isModalOpen", false);
        location.reload();
      } catch (error) {
        Swal.fire({
          title: error.response.data.message,
          text: "Do you want to continue",
          icon: "error",
          confirmButtonText: "Cool",
        });
      }
    },
    handleCHangeFile(e) {
      this.file = e.target.files[0];
    },
  },
};
</script>
<style lang=""></style>
