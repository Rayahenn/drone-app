<template>
    <v-card class="weather-box">
        <v-icon class="weather-box__icon">
            {{icon}}
        </v-icon>
        <span class="weather-box__title">
            {{title}}
        </span>
        <span class="weather-box__value">
            {{text}}
        </span>
    </v-card>
</template>

<script>

export default {
  name: "WeatherBox",

//   components: {
//     Map,
//   },
    data: () => ({
        //
    }),
    props: {
        icon: null,
        title: null,
        text: null,
    },
    computed: {
        userInfo: {
            get() {
                return this.$store.getters['getUserInfo']()
            }
        }
    }
};
</script>

<style lang="scss" scoped>
    .weather-box {
        display: flex;
        padding: 8px 16px;
        > * {
            + * {
                margin-top: 8px;
            }
        }
        &__title {

        }
    }
</style>
