<template>
    <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
            <router-link :to='path'>
                <v-btn
                rounded
                fab
                class="mx-2"
                :color="color"
                v-bind="attrs"
                v-on="on"
                v-if="action !== 'logout'">
                    <v-icon>
                        {{icon}}
                    </v-icon>
                </v-btn>
                <v-btn
                rounded
                fab
                class="mx-2"
                :color="color"
                v-bind="attrs"
                v-on="on"
                @click="logout()"
                v-else
                >
                    <v-icon>
                        
                        {{icon}}
                    </v-icon>
                </v-btn>
            </router-link>
        </template>
        <span>{{tooltip}}</span>

    </v-tooltip>


</template>

<script>

export default {
    name: 'RounedButton',
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
        logout() {
            localStorage.clear()
        }
    },
    computed: {}
};
</script>

<style lang="scss" scoped>
a {
    margin-bottom: 16px;
}

.v-icon {
    color: #fff !important;
    display: inline
}

</style>