<template lang="">
  <form @submit.prevent="handleSubmit">
    <h3 class="font-bold text-lg">Edit Book</h3>
    <div class="modal-action flex flex-col gap-2">
      <div class="flex flex-col ml-2 gap-2">
        <input
          type="text"
          v-bind:placeholder="book.title"
          class="input input-bordered"
          v-model="title"
        />
        <input
          type="text"
          v-bind:placeholder="book.description"
          class="input input-bordered"
          v-model="description"
        />
      </div>
      <div class="flex justify-between">
        <input
          type="text"
          v-bind:placeholder="book.release_year"
          class="input input-bordered"
          v-model="release_year"
        />
        <input
          type="text"
          v-bind:placeholder="book.total_page"
          class="input input-bordered"
          v-model="total_page"
        />
      </div>
      <div class="flex justify-between gap-10">
        <select
          class="select select-bordered w-full max-w-xs"
          v-model="category_id"
        >
          <option disabled>{{ category_id }}</option>
          <option
            v-for="(category, index) in categories"
            :key="index"
            :value="category.id"
            :selected="category.name == book.category_id"
          >
            {{ category.name }}
          </option>
        </select>
        <input
          type="text"
          v-bind:placeholder="book.price"
          class="input input-bordered"
          v-model="price"
        />
      </div>
      <input
        type="file"
        class="file-input w-full max-w-xs"
        @change="handleCHangeFile"
      />
      <button class="btn btn-warning" type="submit">Edit</button>
    </div>
  </form>
</template>
<script>
import { mapGetters } from "vuex";
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: "EditBook",
  data() {
    return {
      title: null,
      description: null,
      release_year: null,
      price: null,
      total_page: null,
      file: null,
      category_id: this.book.category_id,
    };
  },
  props: ["book"],
  computed: {
    ...mapGetters(["categories", "books"]),
  },
  methods: {
    handleCHangeFile(e) {
      this.file = e.target.files[0];
    },
    async handleSubmit() {
      const formData = new FormData();
      if (this.title) formData.append("title", this.title);
      if (this.description) formData.append("description", this.description);
      if (this.release_year) formData.append("release_year", this.release_year);
      if (this.price) formData.append("price", this.price);
      if (this.total_page) formData.append("total_page", this.total_page);
      if (this.category_id !== "Category") {
        formData.append("category_id", this.category_id);
      }
      formData.append("image", this.file);
      try {
        const response = await axios.patch("books/" + this.book.id, formData);
        Swal.fire({
          position: "top-right",
          icon: "success",
          title: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        this.$store.dispatch("isModalOpen", false);
        const index = this.categories.findIndex(
          (category) => category.id === this.category_id
        );
        this.category_id = this.categories[index].name;
        try {
          const response = await axios.get("books");
          this.$store.dispatch("books", response.data.data.books);
        } catch (error) {
          Swal.fire({
            title: error.response.data.message,
            text: "Session expired, please sign in again",
            icon: "error",
            confirmButtonText: "Cool",
          });
        }
      } catch (error) {
        Swal.fire({
          title: error.response.data.message,
          text: "Do you want to continue",
          icon: "error",
          confirmButtonText: "Oke",
        });
      }
    },
  },
};
</script>
<style lang=""></style>
