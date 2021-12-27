<template>
  <div>
    <UserInfo />
    <UserMarkers />
  </div>

  <!-- <v-container>
  </v-container> -->
</template>

<script>
// import Map from '../components/Map';
import UserInfo from '../components/UserInfo.vue';
import UserMarkers from '../components/UserMarkers.vue';

export default {
  name: "MyProfile",

  components: {
    // Map,
    UserInfo,
    UserMarkers,
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
