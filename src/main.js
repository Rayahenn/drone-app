import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import VueGeolocation from "vue-browser-geolocation";
import * as VueGoogleMaps from "vue2-google-maps";
import axios from "axios";

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
Vue.use(VueGeolocation);

Vue.use(VueGoogleMaps, {
  load: {
    key: "",
  },
  installComponents: false,
});
Vue.config.productionTip = false;

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
