<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps<{
  data: number[]
  labels: string[]
}>()

const chartData = {
  labels: props.labels,
  datasets: [
    {
      data: props.data,
      backgroundColor: '#E2E8F0',
      hoverBackgroundColor: '#94A3B8',
      borderRadius: 4,
      barThickness: 12
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
      grid: {
        display: false
      },
      ticks: {
        color: '#94A3B8'
      }
    },
    y: {
      grid: {
        color: '#E2E8F0'
      },
      ticks: {
        color: '#94A3B8'
      }
    }
  }
}
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template> 