<template>
    <v-container>
        <v-card class="chart-card">
            <v-card-title class="text-h5 lighten-2">
                Markers by drone type
            </v-card-title>
            <BarChart :labels="droneTypes" :chartData="droneTypeChartData" :options="barChartConfig" :height="100" :width="400" class="chart-container"/>
        </v-card>
        <v-card class="chart-card">
            <v-card-title class="text-h5 lighten-2">
                Markers by categories
            </v-card-title>
            <BarChart :labels="markerCategories" :chartData="categoriesChartData" :options="barChartConfig" :height="100" :width="400" class="chart-container"/>
        </v-card>
    </v-container>
</template>

<script>
import BarChart from "./BarChart.vue"
import axios from "axios";
import "@firebase/firestore";


export default {
    name: 'UserMarkers',
    components: {
        BarChart
    },
    data: () => ({
        test: null,
        chartData: null,
        droneTypes: [],
        barChartConfig: {
            type: 'bar',
            // data: data,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                    x: {
                        beginAtZero: true,
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Chart.js Bar Chart'
                    }
                },
                aspectRatio: 500/600,
                maintainAspectRatio: false,
                beginAtZero: true,
            },
        },
        droneTypeChartData: {
            labels: null,
            datasets: [],
        },
        droneCounter: [],
        markerCategories: [],
        markerCategoryCounter: [],
        categoriesChartData: {
            labels: null,
            datasets: []
        }
    }),
    methods: {
        // openLogoutModal() {
        //     this.$store.commit('setLogoutModalVisible', true);
        // }
    },
    async beforeCreate() {
        let self = this;

        //get Drone types
        await axios.get('https://firestore.googleapis.com/v1/projects/drone-app-1cd2e/databases/(default)/documents/drones')
          .then((response) => {
            let drones = response.data.documents[0].fields
            Object.keys(drones).forEach(function(key) {
                self.droneCounter.push(0)
                self.droneTypes.push(drones[key].stringValue)
            })
            self.droneTypeChartData.labels = self.droneTypes
            self.droneTypeChartData.datasets.push({
                label: 'Markers',
                backgroundColor: '#f87979',
                data: self.droneCounter
            })

            return response
        });

        // get categories
        await axios.get('https://firestore.googleapis.com/v1/projects/drone-app-1cd2e/databases/(default)/documents/categories')
        .then((response) => {
            for(const [key,value] of Object.entries(response.data.documents[0].fields)) {
                self.markerCategories.push(value.stringValue)
                self.markerCategoryCounter.push(0)
            }
            self.categoriesChartData.labels = self.markerCategories
            self.categoriesChartData.datasets.push({
                label: 'Categories',
                backgroundColor: '#4287f5',
                data: self.markerCategoryCounter
            })
        });

        // get logged user coords
        await axios.get('https://firestore.googleapis.com/v1/projects/drone-app-1cd2e/databases/(default)/documents/coordinates')
          .then((response) => {
             let firestoreCoordinates = response.data.documents
            firestoreCoordinates.map(item => {
                    if(item.fields.userId.stringValue == localStorage.userId) {
                        self.droneTypes.map((singleDrone, index) => {
                            if(item.fields.drone.stringValue == singleDrone) {
                                self.droneCounter[index]++
                            }
                        })
                        self.markerCategories.map((singleCategory, singleCategoryIndex) => {
                            item.fields.categories.arrayValue.values.map((singleMarkerCategory, singleMarkerCategoryIndex) => {
                                if(singleMarkerCategory.stringValue == singleCategory) {
                                    self.markerCategoryCounter[singleCategoryIndex]++
                                }
                            })
                        })
                    }
            return response
            });
        });
    },
    computed: {
        markers: {
            get() {
                return this.$store.getters['getMarkers']()
            }
        },
        markersFullInfo: {
            get() {
                return this.$store.getters['getMarkersFullInfo']()
            }
        },
        userInfo: {
            get() {
                return this.$store.getters['getUserInfo']()
            }
        }
    },
    mounted () {
        // this.renderChart(this.droneTypeChartData, this.barChartConfig)
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

.chart-container {
    max-height: 600px;
}

.chart-card {
    + .chart-card {
        margin-top: 24px;
    }
}
</style>