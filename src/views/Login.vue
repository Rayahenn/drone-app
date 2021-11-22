<template>
  <div class="auth-container">
      <div class="error" v-if="error">{{error.message}}</div>
    <!-- <form action="#" @submit.prevent="submit" class="auth-form">
        <h2 class="auth-title">Login to existing account</h2>
        <div class="form-input">
            <input type="email" v-model="email" placeholder="Email" />
        </div>
        <div class="form-input">
            <input type="password" v-model="password" placeholder="Password" />
        </div>
      <button class="btn" type="submit">
        <span class="btn__text">
          Login
        </span>
      </button>
    </form> -->
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
            label="Normal with hint text"
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
  methods: {
    submit() {

      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
          console.log(userCredential)
        //   this.$router.replace({ name: "secret" });
        })
        .catch(error => {
          console.log(error)
        });
    },
    validate () {
      console.log('tuu')
      console.log(this.$refs.form.validate())
      this.$refs.form.validate()
    },
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