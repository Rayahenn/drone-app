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
  import { getFirestore, collection, doc, setDoc, Firestore, getDocs } from "firebase/firestore";
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
          [47.313220, -1.319482],
          [50.0254674, 21.9795859],
          [50.0554674, 21.9755859]
        ],
        coordinates: {
            lat: 0,
            lng: 0
        },
        markerCoordinates: [this.coordinates, this.coordinates],
      };
    },
    created() {
        this.$getLocation({

        })
        .then(coordinates => {
            // console.log(coordinates)
            // console.log(this.coordinates)
            this.coordinates = coordinates
        })
        .catch(error => alert(error))

        const db = getFirestore();
        // const coordinates = collection(db, 'coordinates')
        setTimeout(function() {

        },2000)
        async function getCollections () {
        const response2 = await getDocs(collection(db, 'coordinates'))
        console.log(response2)
        }
        getCollections();

        // const response = doc(db, 'coordinates');
        // const getResponse = await getDoc(response)
        // console.log(response)
        // console.log(getResponse)
        // console.log(coordinates)
          // axios.get('https://firestore.googleapis.com/v1/projects/drone-app-1cd2e/databases/(default)/documents/coordinates')
          // .then((response) => {
          //   console.log(response.data);
          //   console.log(response.status);
          //   console.log(response.statusText);
          //   console.log(response.headers);
          //   console.log(response.config);
          //   return response
          // });
    },
    methods: {
      addMarker(event) {
        this.markers.push(event.latlng);
      }
    },
    computed: {
      databaseResponse: {
        get() {
        }
      }
    }
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
