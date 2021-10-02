<template>
  <v-container class="main-container">
    <l-map class="map" :zoom="zoom" :center="coordinates">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker :v-for="marker in markers" :lat-lng="marker"></l-marker>

    </l-map>
            <!-- <GmapMap
          :center="{lat:10, lng:10}"
          :zoom="7"
          style="width: 640px; height: 480px">
        </GmapMap> -->
  </v-container>
</template>

<script>
  export default {
    name: 'Map',
        data () {
          let L = window.L;
        return {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution:
                '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            zoom: 8,
            center: [47.313220, -1.319482],
            coordinates: {
                lat: 0,
                lng: 0
            },
            markers: [
              L.latLng(0, 0),
              L.latLng(50.0254674, 21.9795859),
              L.latLng(50.0554674, 21.9755859)
            ],
            markerCoordinates: [this.coordinates, this.coordinates],
        };
    },
    created() {
        this.$getLocation({

        })
        .then(coordinates => {
            console.log(coordinates)
            console.log(this.coordinates)
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
.main-container {
  margin: 0;
  padding: 0;
  max-width: unset;
}
</style>
