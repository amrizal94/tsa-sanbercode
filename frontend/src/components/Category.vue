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
    <!-- You can open the modal using ID.showModal() method -->
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
        <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
          <h3 class="font-bold text-lg">Edit Category</h3>
          <div class="flex gap-5">
            <input
              type="text"
              placeholder="Categoy Name"
              class="input input-bordered w-11/12"
              v-model="name"
              required
            />
            <button class="btn btn-warning" type="submit">Edit</button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Modal from "./Modal.vue";
import AddCategory from "./AddCategory.vue";
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: "Category",
  data() {
    return {
      isModalOpen: false,
      id: null,
      name: null,
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
    async getCategories() {
      try {
        const response = await axios.get("categories");
        if (response.data.data.categories.length < 0) {
          Swal.fire({
            title: "You don't have any categories",
            text: "Please add a new category",
            icon: "warning",
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
    },
    showModalAddCategory() {
      this.modal = "ModalAddCategory";
      this.$store.dispatch("modalChildren", true);
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
          const response = axios.delete(`categories/${id}`);
          response
            .then((res) => {
              const categories = this.categories;
              const index = categories.findIndex(
                (category) => category.id === id
              );
              if (index !== -1) {
                categories.splice(index, 1);
                Swal.fire({
                  position: "top-right",
                  icon: "success",
                  title: "Delete a category",
                  text: res.data.message,
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.getCategories();
              }
            })
            .catch((error) => {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Delete a category",
                text: error.data.message,
                confirmButtonText: "Oke",
              });
            });
        }
      });
    },
    hanldeClickEdit(id) {
      this.isModalOpen = true;
      this.id = id;
    },
    async handleSubmit() {
      try {
        const response = await axios.patch(`categories/${this.id}`, {
          name: this.name,
        });
        Swal.fire({
          position: "top-right",
          icon: "success",
          title: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        this.getCategories();
        this.isModalOpen = false;
      } catch (error) {
        Swal.fire({
          title: "Edit a Category",
          text: error.response.data.message,
          icon: "error",
          confirmButtonText: "Oke",
        });
        if (
          error.response.data.message ===
          "Your's session has expired and must log in again."
        ) {
          this.isModalOpen = false;
          localStorage.removeItem("token");
          this.$store.dispatch("books", null);
          this.$store.dispatch("isModalOpen", false);
          this.$store.dispatch("modal", null);
          this.$router.push("/login");
        }
      }
    },
    closeModal(isModalOpen) {
      this.isModalOpen = !isModalOpen;
    },
  },
};
</script>
<style lang=""></style>
