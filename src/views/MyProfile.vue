<template>
  <div>
    <UserInfo />
    <UserMarkers />
    <MainNav />
  </div>

  <!-- <v-container>
  </v-container> -->
</template>

<script>
// import Map from '../components/Map';
import UserInfo from '../components/UserInfo.vue';
import UserMarkers from '../components/UserMarkers.vue';
import MainNav from '../components/MainNav'

export default {
  name: "MyProfile",

  components: {
    // Map,
    UserInfo,
    UserMarkers,
    MainNav
  },
    data: () => ({
      test: null,
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
