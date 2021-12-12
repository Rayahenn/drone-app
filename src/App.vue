<template>
  <v-app>
    <v-main>
      <router-view>
        <router-link to=/login>Login</router-link>
        <router-link to=/register>Register</router-link>
        <router-link to=/secret>Secret</router-link>
      </router-view>
      <!-- <Map/> -->
    </v-main>
  </v-app>
</template>

<script>
// import Map from './components/Map';

export default {
  name: 'App',

  components: {
    // Map,
  },

  data: () => ({
    //
  }),
};
</script>

<style lang="scss">
@import './assets/variables.scss';
.v-application--wrap {
  z-index: 5;
}
.error {
  color: red;
  font-size: 18px;
}
// input {
//   width: 400px;
//   padding: 30px;
//   margin: 20px;
//   font-size: 21px;
// }
.form-input {
  // color: #fff;

  
  width: 100%;
  input {
    width: 100%;
    border: 1px solid rgb(179, 179, 179);
    border-radius: 6px;
    margin: 0;
    padding: 8px 16px;
    color: #fff;
    transition: border-color 0.3s ease;
    &::placeholder {
      color: #fff;
    }
    &:focus {
      border-color: rgb(66, 148, 255);
      outline: none;
    }
  }
  + .form-input {
    margin-top: 16px;
  }
}
.btn {
  border-radius: 6px;
  width: 300px;
  height: 50px;
  // font-size: 100%;
  background-color: rgb(0, 67, 155);
  color: #fff;
  transition: background-color 0.3s ease;
  &__text {
    color: #fff;
  }
  &:hover {
    background-color: rgb(11, 110, 240)
  }

}
</style>