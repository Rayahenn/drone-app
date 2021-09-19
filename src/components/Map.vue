<template>
  <v-container>
    <l-map class="map" :zoom="zoom" :center="coordinates">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker :lat-lng="coordinates"></l-marker>
    </l-map>
  </v-container>
</template>

<script>
  export default {
    name: 'Map',
        data () {
        return {
            url: 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            attribution:
                '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            zoom: 8,
            center: [47.313220, -1.319482],
            coordinates: {
                lat: 0,
                lng: 0
            },
            markerCoordinates: [this.coordinates, this.coordinates],
        };
    },
    created() {
        this.$getLocation({

        })
        .then(coordinates => {
            this.coordinates = coordinates
        })
        .catch(error => alert(error))
    },
  }
</script>

<style lang="scss" scoped>
.map {
    width: 100vw;
    height: 100vh;
}
</style>
