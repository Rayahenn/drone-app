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
    },
    userInfo: {
      isLogged: false,
      id: null,
      email: null,
      lastLogin: null,
    }
  },
  mutations: {
    setMarkerModalVisible (state, val) {
      state.isModalVisible = val;
    },
    setMarkerInfo (state, val) {
      // conosl
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
    },
    setUserInfo (state, val) {
      console.log(val)
      if(val) {
        state.userInfo.isLogged = true
        state.userInfo.email = val.user.email
        state.userInfo.id = val.user.uid
        state.userInfo.lastLogin = val.user.metadata.lastSignInTime
        localStorage.userInfo = {} 
        console.log(localStorage)
        localStorage.isUserLogged = true
        localStorage.userEmail = val.user.email
        localStorage.userId = val.user.uid
        localStorage.userLastLogin = val.user.metadata.lastSignInTime 
        // localStorage.userInfo = state.userInfo
        console.log(localStorage)
      }
    }
  },
  actions: {},
  modules: {},
  getters: {
    getMarkerModalVisible: (state) => function() {
      return state.isModalVisible;
    },
    getUserInfo: (state) => function() {
      console.log(state)
      return state.userInfo;
    }
  },
});
