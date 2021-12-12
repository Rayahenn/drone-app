import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isModalVisible: false,
    newMarkerInfo: {
      lat: 0,
      lng: 0,
      title: '',
      description: '',
      drone: '',
      photo: '',
    }
  },
  mutations: {
    setMarkerModalVisible (state, val) {
      state.isModalVisible = val;
    },
    setMarkerInfo (state, val) {
      if(val.lat) {
        state.newMarkerInfo.lat = val.lat;
      }
      if(val.lng) {
        state.newMarkerInfo.lng = val.lng;
      }
      if(val.title) {
        state.newMarkerInfo.title = val.title;
      }
      if(val.description) {
        state.newMarkerInfo.description = val.description;
      }
      if(val.drone) {
        state.newMarkerInfo.drone = val.drone;
      }
      if(val.photo) {
        state.newMarkerInfo.vaphotol = val.photo;
      }
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
