import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: null,
    isLoggedIn: false,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setLoggedIn(state, status) {
      state.isLoggedIn = status;
    },
  },
  actions: {
    // Add any asynchronous actions here if needed
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    isLoggedIn(state) {
      return state.isLoggedIn;
    },
  },
});

export default store;