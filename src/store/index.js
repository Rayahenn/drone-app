import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isMarkerModalVisible: false,
    isMarkerInfoModalVisible: false,
    isLogoutModalVisible: false,
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
    },
    appLocalStorage: localStorage,
    isAlertVisible: false,
    markers: [],
    markerFullInfo: [],
    weatherApiKey: '749114619e76cd7adc5518a2fbbaa416',
    currentLocation: null,
  },
  mutations: {
    setMarkerModalVisible (state, val) {
      state.isMarkerModalVisible = val;
    },
    setLogoutModalVisible (state, val) {
      state.isLogoutModalVisible = val;
    },
    setAppLocalStorage (state, val) {
      state.appLocalStorage = val;
    },
    setAlertVisible (state, val) {
      state.isAlertVisible = val;
    },
    setMarkers (state, val) {
      state.markers = val;
    },
    setMarkerFullInfo (state, val) {
      state.markerFullInfo = val;
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
    },
    setUserInfo (state, val) {
      if(val) {
        state.userInfo.isLogged = true
        state.userInfo.email = val.user.email
        state.userInfo.id = val.user.uid
        state.userInfo.lastLogin = val.user.metadata.lastSignInTime
        localStorage.userInfo = {} 
        localStorage.isUserLogged = true
        localStorage.userEmail = val.user.email
        localStorage.userId = val.user.uid
        localStorage.userLastLogin = val.user.metadata.lastSignInTime 
      }
    },
    setCurrentLocation (state, val) {
      state.currentLocation = val;
    },
    setMarkerInfoModalVisible (state, val) {
      state.isMarkerInfoModalVisible = val;
    },
  },
  actions: {},
  modules: {},
  getters: {
    getMarkerModalVisible: (state) => function() {
      return state.isMarkerModalVisible;
    },
    getLogoutModalVisible: (state) => function() {
      return state.isLogoutModalVisible;
    },
    getUserInfo: (state) => function() {
      return state.userInfo;
    },
    getAppLocalStorage: (state) => function() {
      return state.appLocalStorage
    },
    getAlertVisible: (state) => function() {
      return state.isAlertVisible
    },
    getMarkers: (state) => function() {
      return state.markers
    },
    getMarkersFullInfo: (state) => function() {
      return state.markerFullInfo
    },
    getCurrentLocation: (state) => function() {
      return state.currentLocation
    },
    getMarkerInfoModalVisible: (state) => function() {
      return state.isMarkerInfoModalVisible;
    },
  },
});