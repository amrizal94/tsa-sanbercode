<template lang="">
  <div>
    <div role="alert" class="alert alert-error text-4xl mt-28" v-if="!books">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Please login first.</span>
      <div class="flex">
        <button class="btn btn-sm btn-warning" @click="handleClick">OK</button>
      </div>
    </div>

    <div v-if="books" class="flex justify-between m-2">
      <div>
        <button class="btn btn-success" @click="showModal">Add book</button>
      </div>
      <div class="flex gap-5">
        <div data-tip="Sort By Title" class="tooltip">
          <select
            @change="handleCHangeSortByTitle"
            class="select select-bordered w-full max-w-xs"
            v-model="sortByTitle"
          >
            <option selected>Sort By Title</option>
            <option>Ascending</option>
            <option>Descending</option>
          </select>
        </div>
        <div data-tip="Title" class="tooltip">
          <input
            type="text"
            placeholder="Title"
            class="input input-bordered w-full max-w-xs"
            v-model="title"
            @change="handleCHange('title', title)"
          />
        </div>
        <div data-tip="Minimum Year" class="tooltip">
          <input
            type="text"
            placeholder="Minimum Year"
            class="input input-bordered w-full max-w-xs"
            v-model="minYear"
            @change="handleCHange('minYear', minYear)"
          />
        </div>
        <div data-tip="Maximum Year" class="tooltip">
          <input
            type="text"
            placeholder="Maximum Year"
            class="input input-bordered w-full max-w-xs"
            v-model="maxYear"
            @change="handleCHange('maxYear', maxYear)"
          />
        </div>
        <div data-tip="Minimum Page" class="tooltip">
          <input
            type="text"
            placeholder="Minimum Page"
            class="input input-bordered w-full max-w-xs"
            v-model="minPage"
            @change="handleCHange('minPage', minPage)"
          />
        </div>
        <div data-tip="Maximum Page" class="tooltip">
          <input
            type="text"
            placeholder="Maximum Page"
            class="input input-bordered w-full max-w-xs"
            v-model="maxPage"
            @change="handleCHange('maxPage', maxPage)"
          />
        </div>
        <button class="btn btn-active btn-ghost" @click="handleClickSearch">
          Search Book
        </button>
      </div>
    </div>
    <Modal :isModalOpen="isModalOpen">
      <AddBook />
    </Modal>
    <Card :books="books" />
  </div>
</template>
<script>
import axios from "axios";
import Swal from "sweetalert2";
import { mapGetters } from "vuex";
import Card from "./Card.vue";
import Modal from "./Modal.vue";
import AddBook from "./AddBook.vue";
export default {
  name: "Home",
  components: {
    Card,
    Modal,
    AddBook,
  },
  data() {
    return {
      title: null,
      minYear: null,
      maxYear: null,
      minPage: null,
      maxPage: null,
      sortByTitle: "Sort By Title",

      filter: {},
    };
  },
  computed: {
    ...mapGetters(["books", "isModalOpen"]),
  },
  methods: {
    handleClick() {
      this.$router.push("/login");
    },
    async showModal() {
      try {
        const response = await axios.get("categories");
        console.log(response.data.data.categories.length);
        if (response.data.data.categories.length < 0) {
          Swal.fire({
            title: "Please add a category",
            text: "Do you want to continue",
            icon: "error",
            confirmButtonText: "Cool",
          });
        }
        this.$store.dispatch("categories", response.data.data.categories);
      } catch (error) {
        Swal.fire({
          title: error.response.data.message,
          text: "Do you want to continue",
          icon: "error",
          confirmButtonText: "Cool",
        });
      }
      this.$store.dispatch("isModalOpen", true);
    },
    handleCHange(key, value) {
      this.filter[key] = value || value !== "" ? value : null;
    },
    handleCHangeSortByTitle() {
      this.filter.sortByTitle =
        this.sortByTitle === "Ascending"
          ? "asc"
          : this.sortByTitle === "Descending"
          ? "desc"
          : undefined;
    },
    async handleClickSearch() {
      let useFilter = "";
      Object.keys(this.filter).forEach((key) => {
        if (this.filter[key] !== null) {
          if (useFilter == "") {
            useFilter += "?" + key + "=" + this.filter[key];
          } else {
            useFilter += "&" + key + "=" + this.filter[key];
          }
        }
      });
      try {
        const response = await axios.get("books" + useFilter);
        this.$store.dispatch("books", response.data.data.books);
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
