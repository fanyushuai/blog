import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLogin:"false",
    user:{},
    loading: 0,
    formDatas: null,
    token: ""//定义全局变量 token
  },
  mutations: {
    //全局加载中
    SET_LOADING: (state, loading) => {
      loading ? ++state.loading : --state.loading
    },
    CLEAN_LOADING: (state) => {
      state.loading = 0
    },
    getFormData(state, data) {
      state.formDatas = data;
    },
    saveToken(state, data) {
      //将 token 保存
      state.token = data;
      window.sessionStorage.setItem("token", data);
    },
    login(state,user){
      state.user = user;
    }
  },
  actions: {
    SetLoding({}, boolean) {
      commit('SET_LOADING', boolean)
    },
    CLEANLOADING({ commit}) {
      commit('CLEAN_LOADING')
    }
  },
  getters: {
    loading(state) {
      return state.loading;
    },
    loginUser(state){
      return state.user;
    }
  }
})
export default store
