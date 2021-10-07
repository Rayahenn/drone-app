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
