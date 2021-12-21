<template>
  <v-app>
    <v-main>
      <Map/>
    </v-main>
  </v-app>
</template>

<script>
import Map from '../components/Map';

export default {
  name: "Home",

  components: {
    Map,
  },
    data: () => ({
    //
  }),
  computed: {
    userInfo: {
      get() {
        return this.$store.getters['getUserInfo']()
      }
    }
  }
};
</script>
