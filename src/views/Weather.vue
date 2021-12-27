<template>
    <v-container class="weather-container">
        <h1>Weather Forecast</h1>
        <input type="text" v-model="city" placeholder="Enter town..." />
        <button @click="getWeather()">Szukaj</button>
    </v-container>
</template>

<script>
import axios from "axios";
// import Map from '../components/Map';

export default {
  name: "Weather",

//   components: {
//     Map,
//   },
    data: () => ({
        city: null,
        humidity: null,
        windSpeed: null,
        pressure: null,
        temperature: null,
        cloudiness: null,
        description: null,
        locality: null,
        dailyTemp: null
    //
  }),
    methods: {
        getWeather() {
            console.log(this.$weatherApiKey)
            axios.get("https://api.openweathermap.org/data/2.5/weather?q=" + this.city + "&appid=" + this.$weatherApiKey + "&units=metric&lang=en").then(response => {
                axios.get("https://api.openweathermap.org/data/2.5/onecall?lat=" + response.data.coord.lat + "&lon=" + response.data.coord.lon +  "&appid=" + this.$weatherApiKey + "&units=metric&lang=en").then(responseSecondary => {
                console.log(responseSecondary);
                this.dailyTemp = responseSecondary.data.daily;
                });
                console.log(response)
                this.city = null;
                this.humidity = response.data.main.humidity;
                this.windSpeed = response.data.wind.speed;
                this.pressure = response.data.main.pressure;
                this.temperature = response.data.main.temp.toFixed(0);
                this.cloudiness = response.data.weather[0].main;
                this.description = response.data.weather[0].description;
                this.locality = response.data.name;
            });
        }
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

<style lang="scss">
.v-main {
    &__wrap {
        background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
    }
}
</style>
