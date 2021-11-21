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
  </v-container>
</template>

<script>
  import { initializeApp } from "firebase/app";
  import * as firebase from "@firebase/app";
  import { getFirestore, collection, doc, addDoc, setDoc, Firestore, getDocs, firestore, updateDoc, getDoc } from "firebase/firestore";
  import axios from "axios";
  import "@firebase/firestore";

  export default {
    name: 'Map',
    data () {
      return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
            '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        zoom: 8,
        markers: [
          // [47.313220, -1.319482],
          // [50.0254674, 50.0254674],
          // [50.0554674, 21.9755859]
        ],
        coordinates: {
            lat: 0,
            lng: 0
        },
        markerCoordinates: [this.coordinates, this.coordinates],
      };
    },
    created() {
      
      // console.log(this.markers)
        this.$getLocation({})
        .then(coordinates => {
            this.coordinates = coordinates
        })
        .catch(error => alert(error))


        
          axios.get('https://firestore.googleapis.com/v1/projects/drone-app-1cd2e/databases/(default)/documents/coordinates')
          .then((response) => {
            // console.log(response)
            // console.log(response.data)
            let firestoreCoordinates = response.data.documents
            // console.log(typeof firestoreCoordinates)
            firestoreCoordinates.map(item => {
              let coordinatesArr = []
              for(let coordinate in item.fields) {
                coordinatesArr.push(item.fields[coordinate].doubleValue)
              }
              this.markers.push(coordinatesArr)
            })
            // for(let item in firestoreCoordinates) {
            //   let coordinatesArr = []
            //   console.log(item)

            //     // firestoreCoordinates[item].arrayValue.values.map(singleCoordinate => {
            //     //   coordinatesArr.push(singleCoordinate.doubleValue)
            //     // })
              
            // }

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
        const db = getFirestore();

        await addDoc(collection(db, 'coordinates'), {
          0: event.latlng.lat,
          1: event.latlng.lng
        })
        this.refreshMarkers();
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
}
</style>
