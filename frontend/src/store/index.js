import { createStore } from 'vuex'

export default createStore({
  state: {
    books: null,
    categories: null,
    isModalOpen: false
  },
  getters: {
    books: (state) => {
      return state.books
    },
    categories: (state) => {
      return state.categories
    },
    isModalOpen: (state) => state.isModalOpen
  },
  mutations: {
    books(state, books) {
      state.books = books
    },
    categories(state, categories) {
      state.categories = categories
    },
    isModalOpen: (state, isModalOpen) => state.isModalOpen = isModalOpen
  },
  actions: {
    books(context, books) {
      context.commit('books', books)
    },
    categories(context, categories) {
      context.commit('categories', categories)
    },
    isModalOpen(context, isModalOpen) { context.commit('isModalOpen', isModalOpen) }
  },
  modules: {
  }
})
