<template>
    <v-container class="weather-container">
        <MainNav />
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
            <v-alert
                transition="slide-x-transition"
                :type="error"
                color="red"
                v-if="isErrorVisible"
                elevation="9"
                class="weather-alert"
                >{{errorMessage}}
            </v-alert>
            <v-row>
                <v-col
                    lg="4"
                >
                    <WeatherBox icon="mdi-map-marker" title="Location" :text="locality"/>
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
                    v-if="dates.length"
                >
                    <WeatherBox icon="mdi-calendar-month" title="7 day temperature forecast"/>
                </v-col>

                <v-col
                    v-for="(day, index) in dailyTemp"
                    :key="index"
                    lg="4"
                    v-if="dates.length"
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
    import MainNav from '../components/MainNav'

    export default {
    name: "Weather",

    components: {
        WeatherBox,
        MainNav
    },
        data: () => ({
            city: null,
            humidity: 0,
            windSpeed: 0,
            pressure: 0,
            temperature: 0,
            cloudiness: '---',
            description: null,
            locality: '---',
            dailyTemp: 0,
            currentLocation: null,
            dates: [],
            errorMessage: '',
            isErrorVisible: false,
    }),
        methods: {
            getWeather() {
                this.errorMessage = ''
                axios.get("https://api.openweathermap.org/data/2.5/weather?q=" + this.city + "&appid=" + this.$weatherApiKey + "&units=metric&lang=en").then(response => {
                    axios.get("https://api.openweathermap.org/data/2.5/onecall?lat=" + 
                    response.data.coord.lat + "&lon=" + 
                    response.data.coord.lon +  "&appid=" + 
                    this.$weatherApiKey + 
                    "&units=metric&lang=en")
                    .then(responseSecondary => {
                        this.dailyTemp = responseSecondary.data.daily;
                        this.setLocalTime();
                    });
                    this.isErrorVisible = false

                    this.city = null;
                    this.humidity = response.data.main.humidity;
                    this.windSpeed = response.data.wind.speed;
                    this.pressure = response.data.main.pressure;
                    this.temperature = response.data.main.temp.toFixed(0);
                    this.cloudiness = response.data.weather[0].main;
                    this.description = response.data.weather[0].description;
                    this.locality = response.data.name;
                    if(this.windSpeed > 20) {
                        this.isErrorVisible = true
                        this.errorMessage += 'Strong wind warning! '
                    }
                    if(this.temperature > 40) {
                        this.isErrorVisible = true
                        this.errorMessage += 'Temperature too high! '
                    }
                    if(parseInt(this.temperature) < 0) {
                        this.isErrorVisible = true
                        this.errorMessage += 'Temperature too low! '
                    }
                    if(this.cloudiness == 'Snow' || this.cloudiness == 'Rain') {
                        this.isErrorVisible = true
                        this.errorMessage += 'Bad weather!'
                    }
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
            .catch(error => console.log(error))
            
            setTimeout(function() {
                if(self.currentLocation) {
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
                        if(self.windSpeed > 20) {
                            self.isErrorVisible = true
                            self.errorMessage += 'Strong wind warning! '
                        }
                        if(self.temperature > 40) {
                            self.isErrorVisible = true
                            self.errorMessage += 'Temperature too high! '
                        }
                        if(parseInt(self.temperature) < 0) {
                            self.isErrorVisible = true
                            self.errorMessage += 'Temperature too low! '
                        }
                        if(self.cloudiness == 'Snow' || self.cloudiness == 'Rain') {
                            self.isErrorVisible = self
                            self.errorMessage += 'Bad weather!'
                        }
                    })
                }
                else {

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
    // display: flex;
    // align-items: center;
    // flex-direction: column;
    &__header {
        margin-bottom: 32px;
        max-width: 260px;
        margin-left: auto;
        margin-right: auto;
    }
}
.weather-alert {
    color: #fff !important;
}
</style>
