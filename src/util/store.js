import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loading: 0
  },
  mutations: {
    SET_LOADING: (state, loading) => {
      loading ? ++state.loading : --state.loading
    },
    CLEAN_LOADING: (state) => {
      state.loading = 0
    }
  },
  actions: {
    SetLoding({
      commit
    }, boolean) {
      commit('SET_LOADING', boolean)
    },
    CLEANLOADING({
      commit
    }) {
      commit('CLEAN_LOADING')
    }
  },
  getters: {
    loading(state) {
      return state.loading
    }
  }
})
export default store
