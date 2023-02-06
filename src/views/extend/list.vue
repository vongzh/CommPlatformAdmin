<template>
  <div style="padding-left:10%;padding-right:10%;padding-top:3%;">
    <div style="padding-bottom:3%">
      <!-- <h2 @click="onSetting">分组{{ setting.group }}</h2> -->
      <el-link style="font-weight:blod;font-size:2rem" @click="onSetting">分组 {{ setting.group }}</el-link>
    </div>

    <el-card class="box-card">
      <div slot="header">
        <el-link :underline="false" type="warning">待支付</el-link>
        <div style="float:right">
          <el-button type="primary" size="mini" @click="init">刷新</el-button>
        </div>
      </div>
      <el-table
        :data="waitpaylinks"
        :row-class-name="linkRepeat"
      >
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-bank-card" @click="toPay(scope.row)">支付</el-button>
            <!-- <el-link type="primary" @click="toPay(scope.row)">支付</el-link> -->
          </template>
        </el-table-column>
        <el-table-column
          label="编号"
        >
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
        > <template slot-scope="scope">
          <div @click="removePay(scope.row)">
            {{ scope.row.name }}
            <br>
            【{{ scope.row.orderNo?scope.row.orderNo.substring(scope.row.orderNo.length - 4):'' }}】
          </div>
        </template>
        </el-table-column>
        <el-table-column
          prop="orderNo"
          label="订单号"
        >
          <template slot-scope="scope">
            <el-link type="primary" @click="removePay(scope.row)">{{ scope.row.orderNo?scope.row.orderNo.substring(scope.row.orderNo.length - 4):'' }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="金额"
        >
          <template slot-scope="scope">
            ￥{{ scope.row.amount }}
          </template>
        </el-table-column>
        <el-table-column
          prop="payLink"
          label="支付连接"
        >
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="hover" width="450" :content="scope.row.payLink">
              <el-link
                slot="reference"
              >{{ scope.row.payLink?scope.row.payLink.length <= 45?scope.row.payLink:scope.row.payLink.substring(0,45)+'...':'' }}</el-link>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="时间"
        />
      </el-table>
    </el-card>

    <el-card style="margin-top:5%">
      <div slot="header">
        <el-link :underline="false" type="success">已支付</el-link>
      </div>
      <el-table
        :data="paylinks"
      >
        <el-table-column
          label="编号"
        >
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
        />
        <el-table-column
          prop="orderNo"
          label="订单号"
        />
        <el-table-column
          prop="amount"
          label="金额"
        >
          <template slot-scope="scope">
            ￥{{ scope.row.amount }}
          </template>
        </el-table-column>
        <el-table-column
          prop="payLink"
          label="支付连接"
        >
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="hover" width="450" :content="scope.row.payLink">
              <el-link
                slot="reference"
              >{{ scope.row.payLink?scope.row.payLink.length <= 45?scope.row.payLink:scope.row.payLink.substring(0,45)+'...':'' }}</el-link>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="时间"
        />
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { GetWaitPayLink, GetPayLink, Pay, RemovePay } from '@/api/order/order'
export default {
  data() {
    return {
      waitpaylinks: [],
      paylinks: [],
      itemKey: 'paylinklist_setting',
      setting: {
        group: ''
      }
    }
  },
  watch: {
    'setting.group': {
      handler(val, oldVal) {
        this.loadData()
      },
      deep: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (window.localStorage) {
        const settingStorage = localStorage.getItem(this.itemKey)
        if (settingStorage) {
          this.setting = JSON.parse(settingStorage)

          this.loadData()
        } else {
          this.onSetting()
        }
      }
    },
    onSetting() {
      this.$prompt('请输入分组', '设置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const setting = { group: value }
        localStorage.setItem(this.itemKey, JSON.stringify(setting))

        this.setting.group = setting.group

        this.$message({
          type: 'success',
          message: `设置成功，当前分组：${value}`
        })
      }).catch(() => {
        // this.$message({
        //   type: 'warning',
        //   message: '未设置分组无法查询'
        // })
      })
    },
    loadData() {
      GetWaitPayLink(this.setting.group).then(res => {
        this.waitpaylinks = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })

      GetPayLink(this.setting.group).then(res => {
        this.paylinks = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    toPay(payLink) {
      Pay(payLink.orderNo, this.setting.group).then(res => {
        if (res.data) {
          window.open(payLink.payLink, '_blank')

          this.init()
        } else {
          this.$message.info('支付失败')
        }
      })
    },
    removePay(payLink) {
      RemovePay(payLink.orderNo, this.setting.group).then(res => {
        if (res.data) {
          this.init()
        }
      })
    },
    linkRepeat({ row, rowIndex }) {
      console.log(row)
      if (row.repeat) {
        return 'warning-row'
      }
      return ''
    }
  }
}
</script>

<style>
  .el-table .warning-row {
    background: #e6a23c;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
