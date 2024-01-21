<template lang="">
  <div>
    <div role="alert" class="alert alert-error text-lg" v-if="!books">
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
      <div>
        <router-link to="/login">
          <button class="btn btn-sm btn-primary">OK</button>
        </router-link>
      </div>
    </div>
    <div class="overflow-x-auto" v-if="books">
      <table class="table">
        <!-- head -->
        <thead class="text-lg bg-slate-200">
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Release Year</th>
            <th>Thickness</th>
            <th>Price</th>
            <th>Total Page</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr v-for="book in books" :key="book.id">
            <td>{{ book.title }}</td>
            <td>{{ book.description }}</td>
            <td>
              <div class="avatar">
                <div class="w-24 rounded">
                  <img v-bind:src="book.image_url" />
                </div>
              </div>
            </td>
            <td>{{ book.release_year }}</td>
            <td>{{ book.thickness }}</td>
            <td>{{ book.price }}</td>
            <td>{{ book.total_page }}</td>
            <td>{{ book.category.name }}</td>
            <td>
              <v-icon name="co-trash" scale="1.5" class="p-1 box-content" />
              <v-icon name="px-edit-box" scale="1.5" class="p-1 box-content" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "Home",
  computed: {
    ...mapGetters(["books"]),
  },
};
</script>
<style lang=""></style>
