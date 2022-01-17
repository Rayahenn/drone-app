<template>
    <div class="main-nav">
        <RounedButton class="nav-item" tooltip="Map" icon="mdi-map-outline"  path="/" />
        <RounedButton class="nav-item" tooltip="Login" icon="mdi-login" path="/login" v-if="!appLocalStorage.isUserLogged" />
        <RounedButton class="nav-item" tooltip="Register" icon="mdi-account-plus" path="/register" v-if="!appLocalStorage.isUserLogged" />
        <RounedButton class="nav-item" tooltip="My profile" icon="mdi-account"  path="/my-profile" v-if="appLocalStorage.isUserLogged"/>
        <RounedButton class="nav-item" tooltip="Weather" icon="mdi-weather-cloudy" path="/weather"/>
        <RounedButton class="nav-item" tooltip="Logout" icon="mdi-logout" path="/" action="logout" v-if="appLocalStorage.isUserLogged"/>
    </div>
</template>

<script>
  import RounedButton from './RoundedButton.vue'

  export default {
    name: 'MainNav',
    components: {
      RounedButton,
    },
    data () {
      return {};
    },

    computed: {
      appLocalStorage: {
        get() {
          return this.$store.getters['getAppLocalStorage']()
        }
      },
    },
  }
</script>

<style lang="scss">
.main-nav {
  position: absolute;
  display: flex;
  padding: 16px 8px;
  flex-direction: column;
  right: 0%;
  top: 0;
  height: 100%;
  z-index: 401;
  .v-btn {
    background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
}
</style>
