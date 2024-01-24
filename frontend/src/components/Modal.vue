<template lang="">
  <dialog class="modal" :class="{ 'modal-open': isModalOpen }">
    <div class="modal-box">
      <form method="dialog">
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          @click="closeModal(isModalOpen)"
        >
          ✕
        </button>
      </form>
      <slot />
    </div>
  </dialog>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "Modal",
  computed: {
    ...mapGetters(["isModalOpen"]),
  },
  methods: {
    closeModal(isModalOpen) {
      this.$store.dispatch("modal", null);
      this.$store.dispatch("isModalOpen", !isModalOpen);
    },
  },
};
</script>
