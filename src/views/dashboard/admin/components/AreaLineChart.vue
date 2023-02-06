<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    getCountDays() {
      var curDate = new Date()
      var curMonth = curDate.getMonth()
      curDate.setMonth(curMonth + 1)
      curDate.setDate(0)
      return curDate.getDate()
    },
    getEveryDay() {
      var dayArry = []
      var day = this.getCountDays()
      for (var k = 1; k <= day; k++) {
        dayArry.push(k)
      }
      return dayArry
    },
    setOptions({ totalOrderAmount, totalRefundOrderAmount } = {}) {
      if (totalOrderAmount && totalOrderAmount.length > 0) {
        const month = new Date().getMonth() + 1
        var oArr = totalOrderAmount.map((value, index, array) => {
          return [month + '-' + value.date, value.amount]
        })
        this.totalOrderAmount = oArr
        this.totalOrderAmount.sort((a, b) => a[0].replace('-', '') - b[0].replace('-', ''))
      }
      if (totalRefundOrderAmount && totalRefundOrderAmount.length > 0) {
        const month = new Date().getMonth() + 1
        var roArr = totalRefundOrderAmount.map((value, index, array) => {
          return [month + '-' + value.date, value.amount]
        })
        this.totalRefundOrderAmount = roArr
        this.totalRefundOrderAmount.sort((a, b) => a[0].replace('-', '') - b[0].replace('-', ''))
      }

      const month = new Date().getMonth() + 1
      const keys = this.getEveryDay()
      const dates = keys.map((v, i, a) => {
        return month + '-' + v
      })

      this.chart.setOption({
        xAxis: {
          data: dates,
          interval: 0,
          type: 'category',
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 15,
          right: 50,
          bottom: 15,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          name: '金额（元）',
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['订单金额', '退款金额']
        },
        series: [{
          name: '订单金额',
          smooth: true,
          type: 'line',
          data: oArr,
          areaStyle: {},
          animationDuration: 1000,
          animationEasing: 'cubicInOut'
        },
        {
          name: '退款金额',
          smooth: true,
          type: 'line',
          areaStyle: {},
          data: roArr,
          animationDuration: 1000,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
