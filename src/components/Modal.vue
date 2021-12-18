<script>
  import { getFirestore, collection, addDoc, getDa} from "firebase/firestore";
  import axios from "axios";
  // import { getDatabase, } from "@firebase/firestore";
  import { getDatabase} from '@firebase/database'
  import { getStorage, ref, uploadBytes } from 'firebase/storage';
  import "@firebase/firestore";

  export default {
    name: 'Modal',
    data () {
      return {
        // isModalVisible: false,
        isSpinnerVisible: false,
        isModalRendered: false,
        droneModels: [],
        categories: [],
        selectedDrone: '',
        selectedCategories: ['Spring'],
        loader: null,
        isButtonLoading: false,
        valid: true,
        picture: null,
        imageData: null,
        uploadValue: 0
      }
    },
    props: {
      lat: null,
      lng: null,
    },
    computed: {
      isModalVisible: {
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
          console.log(localStorage)
          return localStorage
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
        //TODO save photo with coords
        this.picture = null;
        const storage = getStorage();
        const imagesRef = ref(storage, 'images/' + file.name)
        this.picture = null;
        uploadBytes(imagesRef, file).then((snapshot) => {
          console.log('file uploaded')
        })
      },
      previewImage(event) {
        this.uploadValue = 0;
        this.picture = null;
        this.imageData = event
        console.log(event)
        console.log(this.imageData)
        this.onUpload(event)
      },
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
        console.log(this.$props)
        this.$store.commit('setMarkerInfo', {
          lat: this.$props.lat,
          lng: this.$props.lng,
        });
        // this.isModalVisible = true;
        // this.$store.commit('setMarkerModalVisible', true);
        // this.$store.getters['getMarkerModalVisible']()
        // console.log(this.$store.getters['getMarkerModalVisible']())
        const db = getFirestore();
        console.log(localStorage)

        await addDoc(collection(db, 'coordinates'), {
          0: this.$props.lat,
          1: this.$props.lng,
          2: this.imageData.name,
          3: localStorage.userId,
          4: localStorage.userEmail,

        })
        this.closeModal()
        this.refreshMarkers();
      }
    }
  }
</script>

<template>
  <div class="text-center">
    <v-dialog
      v-model="isModalVisible"
      width="500"
      persistent
    >
      <v-card v-if="appLocalStorage.isUserLogged">
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
</style>