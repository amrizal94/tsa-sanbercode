<template lang="">
  <form @submit.prevent="handleSubmitFilterBook" class="flex gap-5">
    <div data-tip="Filter By Category" class="tooltip">
      <select
        @change="handleCHangeSortByCategory"
        class="select select-bordered w-full max-w-xs"
        v-model="category_id"
      >
        <option disabled selected>{{ category_id }}</option>
        <option
          v-for="(category, index) in categories"
          :key="index"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
    </div>
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
    <button class="btn btn-active btn-ghost" type="submit">Search Book</button>
  </form>
</template>
<script>
import Swal from "sweetalert2";
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  name: "Filtering",
  data() {
    return {
      category_id: "Category",
      category: {
        id: null,
        name: null,
      },
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
    ...mapGetters(["categories"]),
  },
  methods: {
    handleCHange(key, value) {
      this.filter[key] = value || value !== "" ? value : null;
    },
    handleCHangeSortByCategory() {
      const index = this.categories.findIndex(
        (category) => category.id === this.category_id
      );
      if (index >= 0) {
        this.category = this.categories[index];
        this.category_id = this.category.name;
      }
    },
    handleCHangeSortByTitle() {
      this.filter.sortByTitle =
        this.sortByTitle === "Ascending"
          ? "asc"
          : this.sortByTitle === "Descending"
          ? "desc"
          : null;
    },
    async handleSubmitFilterBook() {
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
        const endpoint = this.category.id
          ? `categories/${this.category.id}/books`
          : "books";
        const response = await axios.get(endpoint + useFilter);
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
