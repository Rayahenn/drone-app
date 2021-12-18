<template>
  <v-container class="main-container">
    <l-map class="map" :zoom="zoom" :center="coordinates" @click="setMarkerCoords">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker
      v-if="markers.length > 0"
      v-for="(marker, index) in markers"
      :key="'marker-' + index"
      :lat-lng="marker">
        <l-popup>TEST</l-popup>
      </l-marker>
    </l-map>
    <Modal :lat="markerCoordinates.lat" :lng="markerCoordinates.lng"/>
    <div class="main-nav">
      <RounedButton tooltip="Login" icon="mdi-login" color="light-blue darken-4" path="/login" v-if="!appLocalStorage.isUserLogged" />
      <RounedButton tooltip="Register" icon="mdi-account-plus" color="light-blue darken-4" path="/register" v-if="!appLocalStorage.isUserLogged" />
      <RounedButton tooltip="My profile" icon="mdi-account" color="light-blue darken-4" path="/my-profile" v-if="appLocalStorage.isUserLogged"/>
      <RounedButton tooltip="My markers" icon="mdi-map-marker" color="light-blue darken-4" path="/my-markers" v-if="appLocalStorage.isUserLogged"/>
      <RounedButton tooltip="My markers" icon="mdi-map-marker" color="light-blue darken-4" path="/" action="logout" v-if="appLocalStorage.isUserLogged"/>
    </div>

  </v-container>
</template>

<script>
  import { getFirestore, collection, addDoc} from "firebase/firestore";
  import axios from "axios";
  import "@firebase/firestore";
  import Modal from './Modal'
  import RounedButton from './RoundedButton.vue'

  export default {
    name: 'Map',
    components: {
      Modal,
      RounedButton
    },
    data () {
      return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
            '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        zoom: 8,
        markers: [],
        coordinates: {
            lat: 0,
            lng: 0
        },
        markerCoordinates: {
          lat: null,
          lng: null,
        },
        isModalVisible: false,
        droneModels: []
      };
    },
    updated() {
      // this.isModalVisible = this.$store.getters['getMarkerModalVisible']()
    },
    created() {
      console.log(this.$store)
      // console.log(this.markers)
        this.$getLocation({})
        .then(coordinates => {
            this.coordinates = coordinates
        })
        .catch(error => alert(error))


        
          axios.get('https://firestore.googleapis.com/v1/projects/drone-app-1cd2e/databases/(default)/documents/coordinates')
          .then((response) => {
            let firestoreCoordinates = response.data.documents
            firestoreCoordinates.map(item => {
              let coordinatesArr = []
              for(let coordinate in item.fields) {
                coordinatesArr.push(item.fields[coordinate].doubleValue)
              }
              this.markers.push(coordinatesArr)
            })

            return response
          });
    },

    methods: {
      refreshMarkers: function() {
          axios.get('https://firestore.googleapis.com/v1/projects/drone-app-1cd2e/databases/(default)/documents/coordinates')
          .then((response) => {
            this.markers = [];
            let firestoreCoordinates = response.data.documents
            firestoreCoordinates.map(item => {
              let coordinatesArr = []
              for(let coordinate in item.fields) {
                coordinatesArr.push(item.fields[coordinate].doubleValue)
              }
              this.markers.push(coordinatesArr)
            })
          });
      },
      async setMarkerCoords(event) {
        console.log(event)
        this.markerCoordinates.lat = event.latlng.lat
        this.markerCoordinates.lng = event.latlng.lng
        
        // this.$store.commit('setMarkerInfo', {
        //   lat: event.latlng.lat,
        //   lng: event.latlng.lng,
        // });
        this.isModalVisible = true;
        this.$store.commit('setMarkerModalVisible', true);
        this.$store.getters['getMarkerModalVisible']()
        // console.log(this.$store.getters['getMarkerModalVisible']())
        // const db = getFirestore();

        // await addDoc(collection(db, 'coordinates'), {
        //   0: event.latlng.lat,
        //   1: event.latlng.lng
        // })
        // this.refreshMarkers();
      }
    },
    computed: {
      isModalRendered: {
        get() {
          // if(drone
          console.log(this.droneModels)
          // return this.$store.getters['getMarkerModalVisible']()
        }
      },
      appLocalStorage: {
        get() {
          console.log(localStorage)
          return localStorage
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
.map {
    width: 100vw;
    height: 100vh;
}
.main-container {
  margin: 0;
  padding: 0;
  max-width: unset;
  position: relative;
}
.main-nav {
  position: absolute;
  display: flex;
  padding: 16px 8px;
  flex-direction: column;
  right: 0%;
  top: 0;
  height: 100%;
  z-index: 401;
}
</style>
