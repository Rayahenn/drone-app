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
            // console.log(self)
        }, 500)
        console.log(this)
        // console.log(Bar)
        // console.log(this)
        // console.log(this.chartData)
        // console.log(this.options)

    },
    watch: {
        chartData() {
            // console.log('jest zmiana')
            // console.log(this)
        }
    }
}
</script>

<style>
</style>