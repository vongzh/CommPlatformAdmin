<template>
  <div class="dashboard-editor-container">
    <panel-group />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <area-line-chart :chart-data="lineChartData" />
    </el-row>
    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
// import PieChart from './components/PieChart'
import LineChart from './components/LineChart'
import AreaLineChart from './components/AreaLineChart'
import { OrderStatistics } from '@/api/statistics/statistics'
export default {
  name: 'AdminDashboard',
  components: {
    PanelGroup,
    // PieChart,
    LineChart,
    AreaLineChart
  },
  data() {
    return {
      lineChartData: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      OrderStatistics().then(res => {
        this.lineChartData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
