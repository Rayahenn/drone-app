<template>
  <v-container class="main-container">
    <l-map class="map" :zoom="zoom" :center="coordinates" @click="addMarker">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker 
      v-for="(marker, index) in markers"
      :key="'marker-' + index"
      :lat-lng="marker">
        <l-popup>TEST</l-popup>
      </l-marker>
    </l-map>
  </v-container>
</template>

<script>
  export default {
    name: 'Map',
    data () {
      return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
            '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        zoom: 8,
        markers: [
          [47.313220, -1.319482],
          [50.0254674, 21.9795859],
          [50.0554674, 21.9755859]
        ],
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
            console.log(coordinates)
            console.log(this.coordinates)
            this.coordinates = coordinates
        })
        .catch(error => alert(error))
    },
    methods: {
      addMarker(event) {
        this.markers.push(event.latlng);
      }
    }
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
