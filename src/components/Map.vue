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
        <l-popup class="marker__popup">
          <v-progress-circular
            indeterminate
            color="primary"
            v-if="isLoaderVisible"
            
          >
          </v-progress-circular>
          <div class="marker__container" v-else>
            <div class="marker__info">
              <h3>
                Categories:
              </h3>
              <span v-for="(category, categoryIndex) in markerCategories" :key="categoryIndex">- {{category}}</span>
            </div>
            <div class="marker__info">
              <h3>
                Drone: 
              </h3>
              <span>- {{markersFullInfo[index].drone.stringValue}}</span>
            </div>

            <img :src="imageURL" alt="" class="marker__photo">
            
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
        isLoaderVisible: true,
        selectedMarkerImageId: null,
        selectedMarkerImageExtension: null,
        imageURL: null,
        markerCategories: []
      };
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
      },
      showMarkerDetails(index) {
        this.markerCategories = []
        this.imageURL = null
        this.isLoaderVisible = true
        this.selectedMarkerImageId = null
        this.selectedMarkerImageExtension = null
        this.markersFullInfo[index].categories.arrayValue.values.map(singleCategory => {
          this.markerCategories.push(singleCategory.stringValue)
        })

        this.selectedMarkerImageId = this.markersFullInfo[index].imageId.integerValue
        this.imageExtension = this.markersFullInfo[index].imageExtension.stringValue
        const storage = getStorage();
        getDownloadURL(ref(storage, 'images/'+ this.selectedMarkerImageId + '.' + this.imageExtension))
        .then((url) => {
          this.imageURL = url
          this.isLoaderVisible = false
        })

      }
    },
    computed: {
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

.marker {
  &__container {
    display: flex;
    flex-direction: column;
  }
  &__info {
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
  }
  &__popup {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__photo {
    max-width: 100%;
  }
}


</style>
