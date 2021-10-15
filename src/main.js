import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import VueGeolocation from "vue-browser-geolocation";
import * as VueGoogleMaps from "vue2-google-maps";
import axios from "axios";
import * as firebase from "@firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "@firebase/auth";
import "@firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { firestorePlugin } from 'vuefire'

Vue.config.productionTip = false;

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

Vue.prototype.$axios = axios;
Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);
Vue.component("l-popup", LPopup);
Vue.use(VueGeolocation);
Vue.use(firebase)
Vue.use(firestorePlugin)

console.log(firebase)


const firebaseConfig = {
  apiKey: "AIzaSyBPmJAyB6gypZSOc50SdX13uiCKSYVu-xE",
  authDomain: "drone-app-1cd2e.firebaseapp.com",
  projectId: "drone-app-1cd2e",
  storageBucket: "drone-app-1cd2e.appspot.com",
  messagingSenderId: "564477671036",
  appId: "1:564477671036:web:a99cc7e79ed2fc92807bf9",
  measurementId: "G-HDVM68REFV"
};

firebase.initializeApp(firebaseConfig);

const db = getFirestore();
// console.log(db)
let app;

// const querySnapshot = await getDocs(collection(db, "coordinates"));
// querySnapshot.forEach((doc) => {
//   console.log('ok');
// });

Vue.use(VueGoogleMaps, {
  load: {
    key: "",
  },
});
Vue.config.productionTip = false;

// firebase.auth().onAuthStateChanged(user => {
//   console.log("user", user);
//   if (!app) {
//     app = new Vue({
//       router,
//       store,
//       render: h => h(App)
//     }).$mount("#app");
//   }
// });

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

// import Vue from 'vue'
// import App from './App.vue'
// import vuetify from './plugins/vuetify'
// import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
// import 'leaflet/dist/leaflet.css';
// import { Icon } from 'leaflet';
// import VueGeolocation from 'vue-browser-geolocation';
// import * as VueGoogleMaps from 'vue2-google-maps'

// delete Icon.Default.prototype._getIconUrl;
// Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

// Vue.component('l-map', LMap);
// Vue.component('l-tile-layer', LTileLayer);
// Vue.component('l-marker', LMarker);
// Vue.use(VueGeolocation)

// Vue.use(VueGoogleMaps, {
//   load: {
//     key: ''
//   },
//   installComponents: false
// })
// Vue.config.productionTip = false

// new Vue({
//   vuetify,
//   render: h => h(App)
// }).$mount('#app')
