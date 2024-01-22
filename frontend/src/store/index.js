import { createStore } from 'vuex'

export default createStore({
  state: {
    books: null,
    isModalOpen: false
  },
  getters: {
    books: (state) => {
      return state.books
    },
    isModalOpen: (state) => state.isModalOpen
  },
  mutations: {
    books(state, books) {
      state.books = books
    },
    isModalOpen: (state, isModalOpen) => state.isModalOpen = isModalOpen
  },
  actions: {
    books(context, books) {
      context.commit('books', books)
    },
    isModalOpen(context, isModalOpen) { context.commit('isModalOpen', isModalOpen) }
  },
  modules: {
  }
})
