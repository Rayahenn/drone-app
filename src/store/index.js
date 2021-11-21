import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isModalVisible: false,
  },
  mutations: {
    setMarkerModalVisible (state, val) {
      state.isModalVisible = val;
    }
  },
  actions: {},
  modules: {},
  getters: {
    getMarkerModalVisible: (state) => function() {
      return state.isModalVisible;
    }
  },
});
