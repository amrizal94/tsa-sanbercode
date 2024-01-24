import { createStore } from 'vuex'

export default createStore({
  state: {
    books: null,
    categories: null,
    isModalOpen: false,
    modal: null,
  },
  getters: {
    books: (state) => {
      return state.books
    },
    categories: (state) => {
      return state.categories
    },
    isModalOpen: (state) => state.isModalOpen,
    modal: (state) => state.modal
  },
  mutations: {
    books(state, books) {
      state.books = books
    },
    categories(state, categories) {
      state.categories = categories
    },
    isModalOpen: (state, isModalOpen) => state.isModalOpen = isModalOpen,
    modal: (state, modal) => state.modal = modal
  },
  actions: {
    books(context, books) {
      context.commit('books', books)
    },
    categories(context, categories) {
      context.commit('categories', categories)
    },
    isModalOpen(context, isModalOpen) { context.commit('isModalOpen', isModalOpen) },
    modal(context, modal) { context.commit('modal', modal) }
  },
  modules: {
  }
})
