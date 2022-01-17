<template>
  <div class="auth-container">
    <MainNav />
    <v-card
      class="auth-card"
      v-if="!appLocalStorage.isUserLogged"
      elevation="10"
      >
      <div class="error" v-if="error">{{error.message}}</div>
      <!-- <form @submit.prevent="pressed" class="auth-form">
        <h2 class="auth-title">Register a new account</h2>
        <div class="form-input">
          <input type="email" v-model="email" placeholder="Email" />
        </div>
        <div class="form-input">
          <input type="password" v-model="password" placeholder="Password" />
        </div>
        <button class="btn" type="submit">
          <span class="btn__text">
            Register
          </span>
        </button>
      </form> -->
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <h2 class="auth-title">Register a new account</h2>
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="12"
            >
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                required
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="12"
            >
            <v-text-field
              v-model="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[passwordRules.required, passwordRules.min]"
              :type="showPassword ? 'text' : 'password'"
              name="input-10-1"
              label="Password"
              hint="At least 8 characters"
              counter
              @click:append="showPassword = !showPassword"
            ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-btn
          color="primary"
          elevation="3"
          rounded
          text
          x-large
          @click="validate"
        >
        Register
        </v-btn>
      </v-form>
    </v-card>
    <v-card 
      v-else
      :elevation="11"
      class="primary"
    >
      <v-card-title>
        You are logged in
      </v-card-title>
      <v-card-actions>
        <v-btn
          color="secondary"
          class="ma-2 white--text"
          elevation="2"
          @click="goToHomepage()"
        >
        Go to homepage
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>

</template>

<script>
import * as firebase from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "@firebase/auth";

import MainNav from '../components/MainNav'

require('firebase/auth');
export default {
  components: {
    MainNav
  },
  data() {
    return {
      email: "",
      password: "",
      error: "",
      valid: true,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        emailMatch: () => (`The email and password you entered don't match`),
      },
      showPassword: false,
    };
  },
  methods: {
    pressed() {

    },
    validate () {
      this.$refs.form.validate()
      if(this.$refs.form.validate()) {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, this.email, this.password).then(() => {
            this.$router.push('/')
          })
          .catch(error => {
            console.log(error)
          });
      }
    },
    goToHomepage () {
      this.$router.push('/')
    }
  },
  computed: {
    userInfo: {
      get() {
        return this.$store.getters['getUserInfo']()
      }
    },
    appLocalStorage: {
      get() {
        return this.$store.getters['getAppLocalStorage']()
      }
    }
  }
};
</script>

<style lang="scss">

</style>