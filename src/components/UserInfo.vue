<template>
    <v-container>
        <v-card class="user">
            <v-avatar 
            color="primary"
            size="70"
            class="user__avatar">
                <v-icon large>
                    mdi-account
                </v-icon>
            </v-avatar>
            <div class="user__info">
                <span>
                    E-mail address: {{appLocalStorage.userEmail}}
                </span>
                <span>
                    Last time logged in: {{appLocalStorage.userLastLogin}}
                </span>
            </div>
        </v-card>
    </v-container>
</template>

<script>

export default {
    name: 'UserInfo',
    data() {
        return {
        };
    },
    props: {
        icon: null,
        color: null,
        path: null,
        tooltip: null,
        action: null,
    },
    methods: {
        openLogoutModal() {
            this.$store.commit('setLogoutModalVisible', true);
        }
    },
    computed: {
        appLocalStorage: {
            get() {
                return this.$store.getters['getAppLocalStorage']()
            }
        },
    }
};
</script>

<style lang="scss" scoped>
a {
    margin-bottom: 16px;
}

.v-icon {
    color: #fff !important;
}

.user {
    display: flex;
    padding: 24px;
    &__avatar {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &__info {
        display: flex;
        flex-direction: column;
        margin-left: 16px;
        justify-content: center;
        span {
            margin-bottom: 8px;
        }
    }
}
</style>