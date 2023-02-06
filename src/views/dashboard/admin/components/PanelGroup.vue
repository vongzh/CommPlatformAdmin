<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="success" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            成功订单
          </div>
          <count-to :start-val="0" :end-val="dashboard.successOrderCount" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="fail" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            失败订单
          </div>
          <count-to :start-val="0" :end-val="dashboard.failOrderCount" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="amount" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            订单金额
          </div>
          <span style="font-size:20px">￥</span><count-to :start-val="0" :end-val="dashboard.totalOrderAmt" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-task">
          <svg-icon icon-class="refunds" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            退款金额
          </div>
          <span style="font-size:20px">￥</span><count-to :start-val="0" :end-val="dashboard.totalRefundOrderAmt" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { Dashboard } from '@/api/statistics/statistics'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      dashboard: {
        orderCount: 0,
        noticeCount: 0,
        totalOrderAmt: 0,
        totalRefundOrderAmt: 0,
        failOrderCount: 0,
        successOrderCount: 0
      }
    }
  },
  created() {
    this.fetchDashboard()
  },
  methods: {
    fetchDashboard() {
      Dashboard().then(res => {
        if (res.result) {
          this.dashboard = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
      text-align: right;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      // &:hover {
      //   .card-panel-icon-wrapper {
      //     color: #fff;
      //   }

      //   .icon-task {
      //     background: #EDEDED;
      //   }

      //   .icon-message {
      //     background: #EDEDED;
      //   }

      //   .icon-money {
      //     background: #EDEDED;
      //   }

      //   .icon-shopping {
      //     background: #EDEDED
      //   }
      // }

      .icon-task {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width:550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: none;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
