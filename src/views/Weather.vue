<template>
    <v-container class="weather-container">
        <div class="weather-container__header">
            <h1>Weather Forecast</h1>
            <v-text-field
                v-model="city"
                label="Town"
              ></v-text-field>
            <v-btn
                color="accent"
                elevation="2"
                large
                block
                @click="getWeather()"
            >
                Search
            </v-btn>
        </div>
        <div class="weather-container__content">
            <v-row>
                <v-col
                    lg="4"
                >
                    <WeatherBox icon="mdi-map-marker" title="Location" :text="city"/>
                </v-col>
                <v-col
                    lg="4"
                >
                    <WeatherBox icon="mdi-thermometer" title="Temperature" :text="temperature + '°C'"/>
                </v-col>
                <v-col
                    lg="4"
                >
                    <WeatherBox icon="mdi-weather-windy" title="Wind Speed" :text="windSpeed + ' km/h'"/>
                </v-col>
                <v-col
                    lg="4"
                >
                    <WeatherBox icon="mdi-water" title="Humidity" :text="humidity + '%'"/>
                </v-col>
                <v-col
                    lg="4"
                >
                    <WeatherBox icon="mdi-speedometer" title="Pressure" :text="pressure + ' hPa'"/>
                </v-col>
                <v-col
                    lg="4"
                >
                    <WeatherBox icon="mdi-weather-cloudy" title="Cloudiness" :text="cloudiness"/>
                </v-col>
                <v-col
                    lg="12"
                >
                    <WeatherBox icon="mdi-calendar-month" title="7 day temperature forecast"/>
                </v-col>

                <v-col
                    v-for="(day, index) in dailyTemp"
                    :key="index"
                    lg="6"
                >
                    <WeatherBox icon="mdi-calendar-month" :title="dates[index]">
                        <span v-html="'Temperature: ' + day.temp.day.toFixed(2) + '°C'"></span>
                        <span v-html="'Wind Speed: ' + day.wind_speed + ' km/h'"></span>
                        <span v-html="'Humidity: ' + day.humidity + '%'"></span>
                        <span v-html="'Pressure: ' + day.pressure + ' hPa'"></span>
                        <span v-html="'Cloudiness: ' + day.weather[0].main"></span>
                    </WeatherBox>
                </v-col>

                
            </v-row>
        </div>
    </v-container>
</template>

<script>
import axios from "axios";
import WeatherBox from '../components/WeatherBox.vue';

export default {
  name: "Weather",

  components: {
    WeatherBox,
  },
    data: () => ({
        city: null,
        humidity: null,
        windSpeed: null,
        pressure: null,
        temperature: null,
        cloudiness: null,
        description: null,
        locality: null,
        dailyTemp: null,
        currentLocation: null,
        dates: [],
  }),
    methods: {
        getWeather() {
            axios.get("https://api.openweathermap.org/data/2.5/weather?q=" + this.city + "&appid=" + this.$weatherApiKey + "&units=metric&lang=en").then(response => {
                axios.get("https://api.openweathermap.org/data/2.5/onecall?lat=" + response.data.coord.lat + "&lon=" + response.data.coord.lon +  "&appid=" + this.$weatherApiKey + "&units=metric&lang=en").then(responseSecondary => {
                    this.dailyTemp = responseSecondary.data.daily;
                });
                this.city = null;
                this.humidity = response.data.main.humidity;
                this.windSpeed = response.data.wind.speed;
                this.pressure = response.data.main.pressure;
                this.temperature = response.data.main.temp.toFixed(0);
                this.cloudiness = response.data.weather[0].main;
                this.description = response.data.weather[0].description;
                this.locality = response.data.name;
            });
        },
        setLocalTime() {
            this.dailyTemp.map(singleTemp => {
                let miliseconds = singleTemp.dt * 1000
                let date = new Date(miliseconds).toLocaleDateString('en-GB')
                this.dates.push(date)
            })
        }
    },
    computed: {
        userInfo: {
            get() {
                return this.$store.getters['getUserInfo']()
            }
        },

    },
    created() {
        let self = this;
        this.$getLocation({})
        .then(coordinates => {
            this.currentLocation = coordinates
        })
        .catch(error => alert(error))
        
        setTimeout(function() {
            if(self.currentLocation.lat && self.currentLocation.lng) {
                axios.get("https://api.openweathermap.org/data/2.5/weather?lat=" + self.currentLocation.lat + "&lon=" + self.currentLocation.lng + "&appid=" + self.$weatherApiKey + "&units=metric&lang=en").then(response => {
                    axios.get("https://api.openweathermap.org/data/2.5/onecall?lat=" + self.currentLocation.lat + "&lon=" + self.currentLocation.lng +  "&appid=" + self.$weatherApiKey + "&units=metric&lang=en").then(responseSecondary => {
                        self.dailyTemp = responseSecondary.data.daily;
                        self.setLocalTime()
                    });

                    self.city = response.data.name;
                    self.humidity = response.data.main.humidity;
                    self.windSpeed = response.data.wind.speed;
                    self.pressure = response.data.main.pressure;
                    self.temperature = response.data.main.temp.toFixed(0);
                    self.cloudiness = response.data.weather[0].main;
                    self.description = response.data.weather[0].description;
                    self.locality = response.data.name;
                    
                })
            }
        },300)
    }
};
</script>

<style lang="scss">
.v-main {
    &__wrap {
        background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
    }
}
.weather-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    &__header {
        margin-bottom: 32px;
    }
}
</style>
