<template>
  <div class="auth-container">
    <div v-if="!appLocalStorage.isUserLogged">
      <div class="error" v-if="error">{{error.message}}</div>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <h2 class="auth-title">Login</h2>
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
        Login
        </v-btn>
      </v-form>
    </div>
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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "@firebase/auth";
require('firebase/auth');


export default {
  name: "Login",
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
  created () {
    console.log(localStorage)
  },
  methods: {
    submit() {
    },
    validate () {
      this.$refs.form.validate()
      if(this.$refs.form.validate()) {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          this.$store.commit('setUserInfo', userCredential);
          this.$router.push('/')
        })
        .catch(error => {
          console.log(error)
          this.$store.commit('setUserInfo', false);
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
        return localStorage
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.auth {
  &-container {
    display: flex;
    height: 100%;
    width: 100%;
    background: #fff;
    align-items: center;
    justify-content: center;
  }
  &-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    .btn {
      margin-top: 16px;
    }
  }
  &-title {
    margin-bottom: 16px;
  }
}

</style>