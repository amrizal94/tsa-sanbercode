<template lang="">
  <div class="overflow-x-auto flex flex-col gap-5 p-5 box-border">
    <button class="btn btn-warning w-full" @click="showModalAddCategory">
      Add category
    </button>
    <table class="table">
      <!-- head -->
      <thead>
        <tr class="bg-slate-200 font-bold text-lg">
          <th>Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categories" :key="index">
          <td class="w-11/12">{{ category.name }}</td>
          <td class="flex gap-5">
            <v-icon
              name="co-trash"
              scale="1.5"
              class="p-1 box-content bg-red-400 text-white rounded-lg cursor-pointer hover:bg-black"
              @click="hanldeClickDelete(category.id)"
            />
            <v-icon
              name="px-edit-box"
              scale="1.5"
              class="p-1 box-content bg-yellow-600 text-white rounded-lg cursor-pointer hover:bg-black"
              @click="hanldeClickEdit(category.id)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <Modal v-if="modalChildren" :modalChildren="modalChildren">
      <AddCategory />
    </Modal>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Modal from "./Modal.vue";
import AddCategory from "./AddCategory.vue";
export default {
  name: "Category",
  data() {
    return {
      modal: null,
    };
  },
  computed: {
    ...mapGetters(["categories", "modalChildren"]),
  },
  components: {
    Modal,
    AddCategory,
  },
  methods: {
    showModalAddCategory() {
      this.modal = "ModalAddCategory";
      this.$store.dispatch("modalChildren", true);
    },
    hanldeClickDelete(id) {
      console.log(id);
    },
    hanldeClickEdit(id) {
      console.log(id);
    },
  },
};
</script>
<style lang=""></style>
