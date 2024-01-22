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
      <button class="btn btn-success" onclick="my_modal_3.showModal()">
        Add book
      </button>
      <input
        type="text"
        placeholder="Type here"
        class="input input-bordered w-full max-w-xs"
      />
    </div>

    <dialog id="my_modal_3" class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        <h3 class="font-bold text-lg">Hello!</h3>
        <p class="py-4">Press ESC key or click on ✕ button to close</p>
      </div>
    </dialog>
    <Card :books="books" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Card from "./Card.vue";
export default {
  name: "Home",
  components: {
    Card,
  },
  computed: {
    ...mapGetters(["books"]),
  },
  methods: {
    handleClick() {
      this.$router.push("/login");
    },
  },
};
</script>
<style lang=""></style>
