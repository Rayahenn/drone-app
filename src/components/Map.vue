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
  import { getFirestore, collection, doc, setDoc, Firestore, getDocs, firestore } from "firebase/firestore";
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
            console.log(response.data)
            let firestoreCoordinates = response.data.documents[0].fields;
            for(let item in firestoreCoordinates) {
              let coordinatesArr = []
                firestoreCoordinates[item].arrayValue.values.map(singleCoordinate => {
                  coordinatesArr.push(singleCoordinate.doubleValue)
                })
              this.markers.push(coordinatesArr)
            }

            return response
          });
    },

    methods: {
      async addMarker(event) {
        const db = getFirestore();
        // axios.get('https://firestore.googleapis.com/v1/projects/drone-app-1cd2e/databases/(default)/documents/coordinates')
        // .then((response) => {
        //   console.log(response.data)
        // });
        console.log(firebase);
        console.log(collection)
        console.log(getFirestore)

        await setDoc(doc(db, 'coordinates', 'test'), {
          3: 'test'
        })

        axios.post('https://firestore.googleapis.com/v1/projects/drone-app-1cd2e/databases/(default)/documents/coordinates', {
          fields: {
            3: {
              arrayValue: {
                values: {
                  doubleValue: 'test'
                }
              }
            },
          }
        }).then (response => {
          console.log('done!')
        },
        (error) => {
          console.log(error)
        }
        )

          //Add Marker
        // this.markers.push(event.latlng);
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
