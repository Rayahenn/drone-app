<script>
  import { getFirestore, collection, addDoc, getDa} from "firebase/firestore";
  import axios from "axios";
  // import { getDatabase, } from "@firebase/firestore";
  import { getDatabase} from '@firebase/database'
  import { getStorage, ref, uploadBytes } from 'firebase/storage';
  import "@firebase/firestore";

  export default {
    name: 'MarkerInfoModal',
    data () {
      return {
        isModalRendered: false,
      }
    },
    props: {
      imageURL: null,
      markerCategories: null,
      isLoaderVisible: null,
      selectedMarkerId: null,
    },
    computed: {
        markers: {
            get() {
            return this.$store.getters['getMarkers']()
            }
        },
        markersFullInfo: {
            get() {
            return this.$store.getters['getMarkersFullInfo']()
            }
        },
        appLocalStorage: {
            get() {
            return this.$store.getters['getAppLocalStorage']()
            }
        },
        isMarkerInfoModalVisible: {
            get() {
            if(!this.isModalRendered) {
                this.isModalRendered = true;
            }
            return this.$store.getters['getMarkerInfoModalVisible']()
            }
        },
    },
    watch: {
    },
    created() {
      this.$store.commit('setMarkerInfoModalVisible', false);
    },
    methods: {
      closeModal() {
        this.$store.commit('setMarkerInfoModalVisible', false);
      },
    }
  }
</script>

<template>
    <div class="text-center">
        <v-dialog
        v-model="isMarkerInfoModalVisible"
        width="500"
        persistent
        >
            <v-card v-if="appLocalStorage.isUserLogged">
                <v-card-title class="text-h5 grey lighten-2">
                Marker info
                </v-card-title>
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
                    <span>- {{markersFullInfo[selectedMarkerId].drone.stringValue}}</span>
                    </div>

                    <img :src="photo" alt="" class="marker__photo" v-for="(photo, photoIndex) in imageURL" :key="photoIndex">
                    
                </div>
                <v-card-actions>
                    <v-btn
                        color="error"
                        elevation="2"
                        @click="closeModal()"
                        class="btn-danger"
                    >
                    <span>Close</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<style lang="scss" scoped>
.marker {
  &__container {
    display: flex;
    flex-direction: column;
    padding: 16px;
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
    margin-top: 16px;
  }
}
</style>