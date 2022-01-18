<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  name: "BarChart",
    props: {
        labels: null,
        chartData: null,
        options: null,
    },
    mounted () {
        let self = this;
        setTimeout(function() {
            self.renderChart(self.chartData, self.options)
        }, 500)
    },
    watch: {
        chartData() {

        }
    }
}
</script>

<style>
</style>