<template>
  <v-container class="main-container">
    <l-map class="map" :zoom="zoom" :center="coordinates" @click="addMarker">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker 
      v-for="(marker, index) in markers"
      :key="'marker-' + index"
      :lat-lng="marker">
        <l-popup>TEST</l-popup>
      </l-marker>
    </l-map>
    <Modal :isModalVisible="isModalVisible"/>
  </v-container>
</template>

<script>
  import { getFirestore, collection, addDoc} from "firebase/firestore";
  import axios from "axios";
  import "@firebase/firestore";
  import Modal from './Modal'

  export default {
    name: 'Map',
    components: {
      Modal
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
        markerCoordinates: [this.coordinates, this.coordinates],
        isModalVisible: false,
        
      };
    },
    updated() {
      this.isModalVisible = this.$store.getters['getMarkerModalVisible']()
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
      async addMarker(event) {
        this.$store.commit('setMarkerModalVisible', true);
        this.$store.getters['getMarkerModalVisible']()
        const db = getFirestore();

        await addDoc(collection(db, 'coordinates'), {
          0: event.latlng.lat,
          1: event.latlng.lng
        })
        this.refreshMarkers();
      }
    },
    computed: {
      // isModalVisible: {
      //   get() {
      //     return this.$store.getters['getMarkerModalVisible']()
      //   }
      // }
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
}
</style>
