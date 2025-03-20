<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps<{
  data: number[]
  labels: string[]
  color: string
}>()

const chartData = {
  labels: props.labels,
  datasets: [
    {
      data: props.data,
      fill: true,
      borderColor: props.color,
      backgroundColor: `${props.color}20`,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      display: false
    },
    y: {
      display: false
    }
  }
}
</script>

<template>
  <Line :data="chartData" :options="chartOptions" />
</template> 