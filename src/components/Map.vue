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
    <AddMarkerModal :lat="markerCoordinates.lat" :lng="markerCoordinates.lng"/>
    <LogoutModal />
    <Alert type="success" text="Success!"/>
    <div class="main-nav">
      <RounedButton tooltip="Login" icon="mdi-login" color="light-blue darken-4" path="/login" v-if="!appLocalStorage.isUserLogged" />
      <RounedButton tooltip="Register" icon="mdi-account-plus" color="light-blue darken-4" path="/register" v-if="!appLocalStorage.isUserLogged" />
      <RounedButton tooltip="My profile" icon="mdi-account" color="light-blue darken-4" path="/my-profile" v-if="appLocalStorage.isUserLogged"/>
      <RounedButton tooltip="My markers" icon="mdi-map-marker" color="light-blue darken-4" path="/my-markers" v-if="appLocalStorage.isUserLogged"/>
      <RounedButton tooltip="Logout" icon="mdi-logout" color="light-blue darken-4" path="/" action="logout" v-if="appLocalStorage.isUserLogged"/>
    </div>

  </v-container>
</template>

<script>
  import { getFirestore, collection, addDoc} from "firebase/firestore";
  import axios from "axios";
  import "@firebase/firestore";
  import AddMarkerModal from './AddMarkerModal'
  import RounedButton from './RoundedButton.vue'
  import LogoutModal from './LogoutModal'
  import Alert from './Alert'

  export default {
    name: 'Map',
    components: {
      AddMarkerModal,
      RounedButton,
      LogoutModal,
      Alert
    },
    data () {
      return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
            '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        zoom: 8,
        coordinates: {
            lat: 0,
            lng: 0
        },
        markerCoordinates: {
          lat: null,
          lng: null,
        },
        isMarkerModalVisible: false,
        droneModels: [],
      };
    },
    updated() {
      // this.isMarkerModalVisible = this.$store.getters['getMarkerModalVisible']()
    },
    created() {
      // console.log(this.$store)
      // console.log(this.markers)
        this.$getLocation({})
        .then(coordinates => {
            this.coordinates = coordinates
        })
        .catch(error => alert(error))


        
          axios.get('https://firestore.googleapis.com/v1/projects/drone-app-1cd2e/databases/(default)/documents/coordinates')
          .then((response) => {
            // console.log(response)
            let firestoreCoordinates = response.data.documents
            firestoreCoordinates.map(item => {
              let coordinatesArr = []
              for(let coordinate in item.fields) {
                if(item.fields[coordinate].doubleValue) {
                  coordinatesArr.push(item.fields[coordinate].doubleValue)
                }
                
              }
              this.markers.push(coordinatesArr)
            })

            return response
          });
          // console.log('przeszlo')
          this.refreshMarkers()
    },

    methods: {
      refreshMarkers: function() {
          axios.get('https://firestore.googleapis.com/v1/projects/drone-app-1cd2e/databases/(default)/documents/coordinates')
          .then((response) => {
            let firestoreCoordinates = response.data.documents
            let markersArr = []
            let markersFullArr = [];
            firestoreCoordinates.map(item => {
              let coordinatesArr = []
              markersFullArr.push(item.fields)
              for(let coordinate in item.fields) {
                
                if(item.fields[coordinate].doubleValue) {
                  coordinatesArr.push(item.fields[coordinate].doubleValue)
                }
              }
              markersArr.push(coordinatesArr)
            })
            this.$store.commit('setMarkers', markersArr);
            this.$store.commit('setMarkerFullInfo', markersFullArr);
          });
      },
      async setMarkerCoords(event) {
        this.markerCoordinates.lat = event.latlng.lat
        this.markerCoordinates.lng = event.latlng.lng
        this.$store.commit('setMarkerInfo', {
          lat: event.latlng.lat,
          lng: event.latlng.lng,
        });
        this.isMarkerModalVisible = true;
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
          // return this.$store.getters['getMarkerModalVisible']()
        }
      },
      appLocalStorage: {
        get() {
          return this.$store.getters['getAppLocalStorage']()
        }
      },
      markers: {
        get() {
          return this.$store.getters['getMarkers']()
        }
      },
      markersFullInfo: {
        get() {
          return this.$store.getters['getMarkersFullInfo']()
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
