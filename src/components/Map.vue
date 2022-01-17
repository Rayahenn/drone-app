<template>
  <v-container class="main-container">
    <l-map class="map" :zoom="zoom" :center="coordinates" @click="setMarkerCoords">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker
      v-if="markers.length > 0"
      v-for="(marker, index) in markers"
      :key="'marker-' + index"
      :lat-lng="marker"
      @click="showMarkerDetails(index)">
        <l-popup>
          <v-progress-circular
            indeterminate
            color="primary"
            v-if="isLoaderVisible"
          >
          </v-progress-circular>
          <div v-else>
            <h3>
              Categories:
              <span v-for="(category, categoryIndex) in markerCategories" :key="categoryIndex">
                {{category.stringValue}}
              </span>
            </h3>
            <h3>
              Drone: 
              <span>{{this.markersFullInfo[index].drone.stringValue}}</span>
            </h3>
            <img :src="imageURL" alt="">
            
          </div>
        </l-popup>
      </l-marker>
    </l-map>
    <AddMarkerModal :lat="markerCoordinates.lat" :lng="markerCoordinates.lng"/>
    <LogoutModal />
    <Alert type="success" text="Success!"/>
    <MainNav />

  </v-container>
</template>

<script>
  import { getFirestore, collection, addDoc} from "firebase/firestore";
  import { getStorage, ref, getDownloadURL  } from "firebase/storage";
  import axios from "axios";
  import "@firebase/firestore";
  import AddMarkerModal from './AddMarkerModal'
  import RounedButton from './RoundedButton.vue'
  import LogoutModal from './LogoutModal'
  import Alert from './Alert'
  import MainNav from './MainNav'

  export default {
    name: 'Map',
    components: {
      AddMarkerModal,
      RounedButton,
      LogoutModal,
      Alert,
      MainNav
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
        isLoaderVisible: true,
        selectedMarkerImageId: null,
        selectedMarkerImageExtension: null,
        imageURL: null,
        markerCategories: []
      };
    },
    updated() {
      // this.isMarkerModalVisible = this.$store.getters['getMarkerModalVisible']()
    },
    created() {
        this.$getLocation({})
        .then(coordinates => {
            this.coordinates = coordinates
            this.$store.commit('setCurrentLocation', coordinates);
        })
        .catch(error => console.log(error))


        
          axios.get('https://firestore.googleapis.com/v1/projects/drone-app-1cd2e/databases/(default)/documents/coordinates')
          .then((response) => {
            let firestoreCoordinates = response.data.documents
            firestoreCoordinates.map(item => {
              let coordinatesArr = []
                  coordinatesArr.push(item.fields.lat.doubleValue)
                  coordinatesArr.push(item.fields.lng.doubleValue)
              // for(let coordinate in item.fields) {
              //   if(item.fields[coordinate].doubleValue) {
              //     coordinatesArr.push(item.fields.lat.doubleValue)
              //     coordinatesArr.push(item.fields.lng.doubleValue)
              //   }
              // }
              this.markers.push(coordinatesArr)
            })

            return response
          });
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
              coordinatesArr.push(item.fields.lat.doubleValue)
              coordinatesArr.push(item.fields.lng.doubleValue)
              // for(let coordinate in item.fields) {
                
              //   if(item.fields[coordinate].doubleValue) {
              //     coordinatesArr.push(item.fields[coordinate].doubleValue)
              //   }
              // }
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
      },
      showMarkerDetails(index) {
        this.markersFullInfo[index].categories.arrayValue.values.map(singleCategory => {
          this.markerCategories.push(singleCategory.stringValue)
        })
        console.log(this.markersFullInfo[index])
        console.log(index)
        this.selectedMarkerImageId = this.markersFullInfo[index].imageId.integerValue
        this.imageExtension = this.markersFullInfo[index].imageExtension.stringValue
        const storage = getStorage();
        getDownloadURL(ref(storage, 'images/'+ this.selectedMarkerImageId + '.' + this.imageExtension))
        .then((url) => {
          console.log(url)
          this.imageURL = url
          this.isLoaderVisible = false

          // const img = document.getElementById('myimg');
          // img.setAttribute('src', url);
        })

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
