<template>
    <v-container>
        <v-card>
            <v-card-title class="text-h5 lighten-2">
                Markers by drone type
            </v-card-title>
            <BarChart :labels="droneTypes" />
        </v-card>
    </v-container>
</template>

<script>
import BarChart from "./BarChart.vue"
import axios from "axios";
import "@firebase/firestore";
import Bar from './BarChart.vue'

export default {
    name: 'UserMarkers',
    components: {
        BarChart
    },
    data() {
        return {
            chartData: null,
            droneTypes: [],
            // barChartConfig: {
            //     type: 'bar',
            //     data: data,
            //     options: {
            //         responsive: true,
            //         plugins: {
            //         legend: {
            //             position: 'top',
            //         },
            //         title: {
            //             display: true,
            //             text: 'Chart.js Bar Chart'
            //         }
            //         }
            //     },
            // },
            // droneTypeChartData: {
            //     labels: labels,
            //     datasets: [
            //         {
            //         label: 'Dataset 1',
            //         data: Utils.numbers(NUMBER_CFG),
            //         borderColor: Utils.CHART_COLORS.red,
            //         backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
            //         },
            //         {
            //         label: 'Dataset 2',
            //         data: Utils.numbers(NUMBER_CFG),
            //         borderColor: Utils.CHART_COLORS.blue,
            //         backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
            //         }
            //     ]
            // }
        };
    },
    // props: {
    //     data: null,
    // },
    methods: {
        // openLogoutModal() {
        //     this.$store.commit('setLogoutModalVisible', true);
        // }
    },
    created() {
        let self = this;

        //get Drone types
        axios.get('https://firestore.googleapis.com/v1/projects/drone-app-1cd2e/databases/(default)/documents/drones')
          .then((response) => {
            let drones = response.data.documents[0].fields
            Object.keys(drones).forEach(function(key) {
                self.droneTypes.push(drones[key].stringValue)
            })

            return response
        });

        // get logged user coords
        axios.get('https://firestore.googleapis.com/v1/projects/drone-app-1cd2e/databases/(default)/documents/coordinates')
          .then((response) => {
            // console.log(response)
             let firestoreCoordinates = response.data.documents
            firestoreCoordinates.map(item => {
              for(let coordinate in item.fields) {
                //   console.log(localStorage.userId)
                //   console.log(item.fields[coordinate])
                if(item.fields[coordinate].stringValue == localStorage.userId) {
                    console.log(item.fields[2])
                //   coordinatesArr.push(item.fields[coordinate].doubleValue)
                }
                
              }
            //   this.markers.push(coordinatesArr)

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