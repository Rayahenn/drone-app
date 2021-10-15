<template>
  <div class="auth-container">
    <div class="error" v-if="error">{{error.message}}</div>
    <form @submit.prevent="pressed" class="auth-form">
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
    </form>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "@firebase/auth";
require('firebase/auth');
export default {
  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },
  methods: {
    pressed() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password).then(() => {
          this.$router.replace({ name: "secret" });
        })
        .catch(error => {
          console.log(error)
        });
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
    background: linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(108,165,242,1) 100%);
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