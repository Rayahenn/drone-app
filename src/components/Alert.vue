<template>
    <div class="alert-container" v-if="isVisible">
        <v-alert
            transition="slide-x-transition"
            dismissible
            :type="type"
            >{{text}}
        </v-alert>
    </div>
</template>

<script>

export default {
    name: "Alert",
    data() {
        return {};
    },
    props: {
        type: null,
        text: null,
    },
    methods: {

    },
    computed: {
        userInfo: {
            get() {
                return this.$store.getters['getUserInfo']()
            }
        },
        appLocalStorage: {
            get() {
                return this.$store.getters['getAppLocalStorage']()
            }
        },
        isVisible: {
            get() {
                return this.$store.getters['getAlertVisible']()
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.alert {
    &-container {
        position: absolute;
        display: flex;
        top: 16px;
        z-index: 1000;
        right: 100px;
    }
}
</style>