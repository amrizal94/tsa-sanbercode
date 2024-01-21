import { createStore } from 'vuex'

export default createStore({
  state: {
    books: null
  },
  getters: {
    books: (state) => {
      return state.books
    }
  },
  mutations: {
    books(state, books) {
      state.books = books
    }
  },
  actions: {
    books(context, books) {
      context.commit('books', books)
    }
  },
  modules: {
  }
})
