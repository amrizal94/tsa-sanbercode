<template lang="">
  <div class="flex flex-wrap justify-evenly gap-5 p-5">
    <div
      class="card w-96 bg-base-100 shadow-xl"
      v-for="(book, index) in books"
      :key="index"
    >
      <figure>
        <img
          v-bind:src="book.image_url"
          @error="imageUrlDefault"
          alt="Book image"
          width="200"
          height="300"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">
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
            />
            <v-icon
              name="px-edit-box"
              scale="1.5"
              class="p-1 box-content bg-yellow-600 text-white rounded-lg cursor-pointer hover:bg-black"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Card",
  props: ["books"],
  methods: {
    imageUrlDefault(e) {
      const baseURL = process.env.VUE_APP_API_HOST;
      const imageUrlDefault = baseURL + "uploads/image-not-found.jpg";
      e.target.src = imageUrlDefault;
    },
  },
};
</script>
<style lang=""></style>
