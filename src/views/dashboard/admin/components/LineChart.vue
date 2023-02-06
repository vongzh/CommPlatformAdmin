<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
require('echarts/theme/macarons')
import echarts from 'echarts'
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
    setOptions({ successOrders, failOrders } = {}) {
      if (successOrders && successOrders.length > 0) {
        const month = new Date().getMonth() + 1
        var oArr = successOrders.map((value, index, array) => {
          return [month + '-' + value.date, value.count]
        })
        this.successOrders = oArr
        this.successOrders.sort((a, b) => a[0].replace('-', '') - b[0].replace('-', ''))
      }

      if (failOrders && failOrders.length > 0) {
        const month = new Date().getMonth() + 1
        var roArr = failOrders.map((value, index, array) => {
          return [month + '-' + value.date, value.count]
        })
        this.failOrders = roArr
        this.failOrders.sort((a, b) => a[0].replace('-', '') - b[0].replace('-', ''))
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
          name: '数量（个）',
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['成功订单数量', '失败订单数量']
        },
        series: [{
          name: '成功订单数量', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: oArr,
          animationDuration: 1000,
          animationEasing: 'cubicInOut'
        },
        {
          name: '失败订单数量',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: roArr,
          animationDuration: 1000,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
