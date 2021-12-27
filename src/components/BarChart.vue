<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  name: "BarChart",
    props: {
        labels: null,
        chardData: null,
        options: null,
    },
    mounted () {
        // this.renderChart(this.chartdata, this.options)
    }
}
</script>

<style>
</style>