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

    <div v-if="books" class="flex justify-between m-2 gap-5">
      <div class="flex gap-5">
        <button class="btn btn-success" @click="showModal">Add book</button>
        <button class="btn btn-info" @click="showModalCategory">
          Category
        </button>
      </div>

      <Filtering />
    </div>
    <Modal :isModalOpen="isModalOpen">
      <AddBook v-if="modal === 'ModalAddBook'" />
      <Category v-if="modal === 'ModalShowCategories'" />
    </Modal>
    <Card :books="books" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Card from "./Card.vue";
import Modal from "./Modal.vue";
import AddBook from "./AddBook.vue";
import Category from "./Category.vue";
import Filtering from "./Filtering.vue";
export default {
  name: "Home",
  components: {
    Card,
    Modal,
    AddBook,
    Filtering,
    Category,
  },
  computed: {
    ...mapGetters(["books", "isModalOpen", "modal"]),
  },
  methods: {
    handleClick() {
      this.$router.push("/login");
    },
    showModal() {
      this.$store.dispatch("modal", "ModalAddBook");
      this.$store.dispatch("isModalOpen", true);
    },

    showModalCategory() {
      this.$store.dispatch("modal", "ModalShowCategories");
      this.$store.dispatch("isModalOpen", true);
    },
  },
};
</script>
<style lang=""></style>
