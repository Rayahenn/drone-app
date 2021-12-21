<script>
  import { getFirestore, collection, addDoc, getDa} from "firebase/firestore";
  import axios from "axios";
  // import { getDatabase, } from "@firebase/firestore";
  import { getDatabase} from '@firebase/database'
  import { getStorage, ref, uploadBytes } from 'firebase/storage';
  import "@firebase/firestore";

  export default {
    name: 'LogoutModal',
    data () {
      return {}
    },
    computed: {
      isModalVisible: {
        get() {
          return this.$store.getters['getLogoutModalVisible']()
        }
      },
      appLocalStorage: {
        get() {
          return this.$store.getters['getAppLocalStorage']()
        }
      }
    },
    created() {
      this.$store.commit('setLogoutModalVisible', false);
    },
    methods: {
      closeModal() {
        this.$store.commit('setLogoutModalVisible', false);
      },
      logout() {
        let self = this;
        localStorage.clear()
        this.$store.commit('setAppLocalStorage', {});
        this.$store.commit('setLogoutModalVisible', false);
        this.$store.commit('setAlertVisible', true);
        setTimeout(function() {
          self.$store.commit('setAlertVisible', false);
        }, 5000)
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
          Are you sure you want to logout?
        </v-card-title>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            color="primary"
            class="ma-2 white--text"
            elevation="2"
            @click="logout()"
          >
            Logout
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
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
</style>