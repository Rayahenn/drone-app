<template>
  <div class="auth-container">
    <MainNav />
    <v-card
      class="auth-card" 
      v-if="!appLocalStorage.isUserLogged"
      elevation="10"
    >
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
          elevation="3"
          rounded
          text
          x-large
          @click="validate"
        >
        Login
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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "@firebase/auth";
require('firebase/auth');

    import MainNav from '../components/MainNav'

export default {
  name: "Login",
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
    submit() {
    },
    validate () {
      let self = this;
      this.$refs.form.validate()
      if(this.$refs.form.validate()) {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          this.$store.commit('setUserInfo', userCredential);
          this.$store.commit('setAppLocalStorage', localStorage);
          this.$router.push('/')
          this.$store.commit('setAlertVisible', true);
          setTimeout(function() {
            self.$store.commit('setAlertVisible', false);
          }, 5000)
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
        return this.$store.getters['getAppLocalStorage']()
      }
    }
  }
};
</script>

<style lang="scss">
.auth {
  &-container {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    .v-btn {
      background-color: #fff;
    }
    .v-input {
      color: #fff !important;
      &__slot {
        &::before {
          border-color: #fff !important;
        }
        &::after {
          border-color: #8ec5fc !important;
        }
      }
      .v-label {
        color: #fff !important;
      }
      input {
        color: #fff;
      }
      button {
        &::before {
          color: #fff;
        }
      }
      .v-counter {
        color: #fff;
      }
      &:not(.error--text) {
        .v-messages__wrapper {
          color: #fff;
        }
      }

    }
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
    color: #fff;
  }
  &-card {
    border-radius: 12px;
    padding: 16px;
    background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
}

</style>