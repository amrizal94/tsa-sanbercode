<template lang="">
  <div class="flex flex-wrap justify-evenly gap-5 p-5">
    <div
      class="card w-96 bg-base-100 shadow-xl"
      v-for="(book, index) in books"
      :key="index"
    >
      <figure @click="handleClickImage(book.image_url)" class="cursor-pointer">
        <img
          v-bind:src="book.image_url"
          @error="imageUrlDefault"
          alt="Book image"
          width="200"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title flex justify-between">
          {{ book.title }}
          <div class="badge badge-secondary">{{ book.price }}</div>
        </h2>
        <div class="overflow-x-auto">
          <table class="table">
            <tbody>
              <tr>
                <th>Description</th>
                <td>{{ book.description }}</td>
              </tr>
              <tr>
                <th>Release year</th>
                <td>{{ book.release_year }}</td>
              </tr>
              <tr>
                <th>Thickness</th>
                <td>{{ book.thickness }}</td>
              </tr>
              <tr>
                <th>Total page</th>
                <td>{{ book.total_page }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card-actions justify-between items-center">
          <div class="flex">
            <div class="badge badge-outline">{{ book.category.name }}</div>
          </div>
          <div class="flex gap-5">
            <v-icon
              name="co-trash"
              scale="1.5"
              class="p-1 box-content bg-red-400 text-white rounded-lg cursor-pointer hover:bg-black"
              @click="hanldeClickDelete(book.id)"
            />
            <v-icon
              name="px-edit-box"
              scale="1.5"
              class="p-1 box-content bg-yellow-600 text-white rounded-lg cursor-pointer hover:bg-black"
              @click="hanldeClickEdit(book.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <Modal
    :isModalOpen="isModalOpen"
    v-if="modal === 'ModalEditBook' || modal === 'ModalShowImage'"
  >
    <form @submit.prevent="handleSubmit" v-if="modal === 'ModalEditBook'">
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
            <option disabled>{{ book.category.name }}</option>
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
    <figure class="flex justify-center">
      <img
        class="p-5 box-border"
        v-bind:src="imageUrl"
        @error="imageUrlDefault"
        alt="Book image"
        v-if="modal === 'ModalShowImage'"
      />
    </figure>
  </Modal>
</template>
<script>
import axios from "axios";
import Modal from "./Modal.vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
export default {
  name: "Card",
  components: {
    Modal,
  },
  data() {
    return {
      imageUrl: null,
      title: null,
      description: null,
      release_year: null,
      price: null,
      total_page: null,
      file: null,
      category_id: "Category",
      book: {
        title: null,
        description: null,
        release_year: null,
        price: null,
        total_page: null,
        file: null,
        category: {
          id: null,
          name: null,
        },
      },
    };
  },
  computed: {
    ...mapGetters(["books", "isModalOpen", "categories", "modal"]),
  },
  methods: {
    imageUrlDefault(e) {
      const baseURL = process.env.VUE_APP_API_HOST;
      const imageUrlDefault = baseURL + "uploads/image-not-found.jpg";
      e.target.src = imageUrlDefault;
    },
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
      if (
        this.category_id !== "Category" &&
        this.category_id !== this.book.category.name
      ) {
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
        this.$store.dispatch("modal", null);
        this.$store.dispatch("isModalOpen", false);
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
          title: "Edit a book",
          text: error.response.data.message,
          icon: "error",
          confirmButtonText: "Oke",
        });
        if (
          error.response.data.message ===
          "Your's session has expired and must log in again."
        ) {
          localStorage.removeItem("token");
          this.$store.dispatch("books", null);
          this.$store.dispatch("isModalOpen", false);
          this.$store.dispatch("modal", null);
          this.$router.push("/login");
        }
      }
    },
    hanldeClickEdit(id) {
      this.$store.dispatch("modal", "ModalEditBook");
      this.id = id;
      const index = this.books.findIndex((book) => book.id === id);
      this.book = this.books[index];
      this.category_id = this.book.category.name;
      this.$store.dispatch("isModalOpen", true);
    },
    handleClickImage(imageUrl) {
      this.$store.dispatch("modal", "ModalShowImage");
      this.imageUrl = imageUrl;
      this.$store.dispatch("isModalOpen", true);
    },
    hanldeClickDelete(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const response = axios.delete(`books/${id}`);
          response
            .then((res) => {
              const books = this.books;
              const index = books.findIndex((book) => book.id === id);
              if (index !== -1) {
                books.splice(index, 1);
                Swal.fire({
                  position: "top-right",
                  icon: "success",
                  title: "Delete a book",
                  text: res.data.message,
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.$store.dispatch("books", books);
              }
            })
            .catch((error) => {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Delete a book",
                text: error.data.message,
                confirmButtonText: "Oke",
              });
            });
        }
      });
    },
  },
};
</script>
<style lang=""></style>
