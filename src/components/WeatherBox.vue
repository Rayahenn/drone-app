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
        <slot></slot>
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
        padding: 24px 16px;
        background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 0px 64px -31px rgba(66, 68, 90, 1) !important;
        color: #fff;
        border-radius: 20px;
        > * {
            + * {
                margin-top: 8px;
            }
        }
        &__title {

        }
        span {
            font-size: 24px;
        }
        .v-icon {
            color: #fff;
            font-size: 72px;
        }
    }
</style>
