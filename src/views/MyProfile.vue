<template>
  <v-container>
    <!-- <v-row>
      <v-col
        cols="12"
        md="12"
      >
      <v-card elevation="10">
        
      </v-card>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script>
// import Map from '../components/Map';

export default {
  name: "MyProfile",

  components: {
    // Map,
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
<style scoped>

</style>
