<script>
  import { getFirestore, collection, addDoc, getDa} from "firebase/firestore";
  import axios from "axios";
  // import { getDatabase, } from "@firebase/firestore";
  import { getDatabase} from '@firebase/database'
  import { getStorage, ref, uploadBytes } from 'firebase/storage';
  import "@firebase/firestore";

  export default {
    name: 'AddMarkerModal',
    data () {
      return {
        // isMarkerModalVisible: false,
        isSpinnerVisible: false,
        isModalRendered: false,
        droneModels: [],
        categories: [],
        selectedDrone: null,
        selectedCategories: [],
        loader: null,
        isButtonLoading: false,
        valid: true,
        picture: null,
        imageData: null,
        error: false,
        imageId: [],
        imageExtension: [],
        imagesNames: [],
        isLoaderVisible: false,
      }
    },
    props: {
      lat: null,
      lng: null,
    },
    computed: {
      isMarkerModalVisible: {
        get() {
          if(!this.isModalRendered) {
            axios.get('https://firestore.googleapis.com/v1/projects/drone-app-1cd2e/databases/(default)/documents/drones')
            .then((response) => {
              for(const [key,value] of Object.entries(response.data.documents[0].fields)) {
                this.droneModels.push(value.stringValue)
              }
            });

            axios.get('https://firestore.googleapis.com/v1/projects/drone-app-1cd2e/databases/(default)/documents/categories')
            .then((response) => {
              for(const [key,value] of Object.entries(response.data.documents[0].fields)) {
                this.categories.push(value.stringValue)
              }
            });

            this.isModalRendered = true;
          }
          return this.$store.getters['getMarkerModalVisible']()
        }
      },
      appLocalStorage: {
        get() {
          return this.$store.getters['getAppLocalStorage']()
        }
      }
    },
    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 3000)

        this.loader = null
      },
    },
    created() {
      this.$store.commit('setMarkerModalVisible', false);
    },
    methods: {
      closeModal() {
        this.$store.commit('setMarkerModalVisible', false);
      },
      validate () {
        this.$refs.form.validate()
      },
      updateSelectedCategories(category) {
          if(this.selectedCategories.includes(category)) {
            this.selectedCategories.splice(this.selectedCategories.indexOf(category), 1)
          }
          else {
            this.selectedCategories.push(category)
          }
      },
      async onUpload(file) {
        const db = getFirestore();
        let self = this;
        let uploadedFileCounter = 0;
        file.map((singleFile, singleFileIndex) => {
          this.imageId.push(Date.now() + 1)
          this.imageExtension.push(singleFile.name.split('.')[1])
          this.picture = null;

          const storage = getStorage();
          const imagesRef = ref(storage, 'images/' + this.imageId[singleFileIndex] + '.' + this.imageExtension[singleFileIndex])
          this.picture = null;
          uploadBytes(imagesRef, singleFile).then((snapshot) => {
            uploadedFileCounter++
            if(uploadedFileCounter == self.imageData.length) {
              self.refreshMarkers();
              addDoc(collection(db, 'coordinates'), {
                'lat': this.$props.lat,
                'lng': this.$props.lng,
                'drone': this.selectedDrone,
                'image': self.imagesNames,
                'categories': this.selectedCategories,
                'userId': this.appLocalStorage.userId,
                'userEmail': this.appLocalStorage.userEmail,
                'imageId': this.imageId,
                'imageExtension': this.imageExtension
              })
              self.isLoaderVisible = false;
              self.closeModal()
              
              self.selectedDrone = null;
              self.selectedCategories = [];
              self.imageData = null;
              self.error = false
              self.imageId = []
              self.imageExtension = []
              self.imagesNames = []
              self.$refs.form.reset()
            }
          })
        })
      },
      previewImage(event) {
        this.picture = null;
        this.imageData = event
        // this.onUpload(event)
      },
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
      async addMarker(event) {
        this.isLoaderVisible = true
        let self = this;
        this.$store.commit('setMarkerInfo', {
          lat: this.$props.lat,
          lng: this.$props.lng,
        });

        

        if(!this.imageData || !this.selectedDrone || !this.selectedCategories.length) {
          self.error = true;
        }
        if(!this.error) {

        this.imageData.map(singleFile => {
          self.imagesNames.push(singleFile.name)
        })

        this.onUpload(this.imageData)
        }
      }
    }
  }
</script>

<template>
  <div class="text-center">
    <v-dialog
      v-model="isMarkerModalVisible"
      width="500"
      persistent
    >
      <v-card v-if="appLocalStorage.isUserLogged">
        <div class="loader-container" v-if="isLoaderVisible">
          <v-progress-circular
            indeterminate
            color="primary"
          >
          </v-progress-circular>
          <span>Uploading photos...</span>
        </div>

        <v-card-title class="text-h5 grey lighten-2">
          Add New Marker
        </v-card-title>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-container>
            <v-row>
              <v-col
                cols="12"
                md="12"
              >
                <v-alert
                  color="red"
                  type="success"
                  v-if="error"
                >Please check all fields</v-alert>
                <h4>Select drone type</h4>
                <v-select
                  v-model="selectedDrone"
                  :items="droneModels"
                  item-text="1"
                  :rules="[v => !!v || 'Item is required']"
                  label="Drone"
                  required
                ></v-select>
              </v-col>
              <v-col 
                cols="12"
                md="12">
                <h4>Select categories</h4>
              </v-col>
              <v-col
                cols="4"
                md="4"
                v-for="(category, index) in categories"
                :key=index
              >
                <v-checkbox
                  :label="category"
                  color="primary"
                  value="primary"
                  hide-details
                  @click="updateSelectedCategories(category)"
                ></v-checkbox>
              </v-col>

              
              <v-col
                cols="12"
                md="12">
                  <v-file-input
                    label="Upload Image"
                    filled
                    prepend-icon="mdi-camera"
                    @change="previewImage"
                    accept="image/png, image/jpeg, image/bmp"
                    required
                    multiple
                  ></v-file-input>
              </v-col>
            </v-row>
          </v-container>
        </v-form>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            :loading="isButtonLoading"
            color="primary"
            class="ma-2 white--text"
            elevation="2"
            @click="addMarker()"
          >
            Add Marker
          </v-btn>
          <v-spacer></v-spacer>
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
      <v-card v-else>
        <v-card-title class="text-h5 grey lighten-2">
          Add New Marker
        </v-card-title>
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="12"
            >
              <h4>You must be logged in</h4>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
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
  .loader-container {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 5;
    backdrop-filter: blur(2px);
    background-color: #00000014;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    span {
      margin-top: 8px
    }
  }
</style>