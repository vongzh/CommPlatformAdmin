<template>
  <div style="padding-left:10%;padding-right:10%;padding-top:5%;">
    <el-form :model="payOrder">
      <!-- <el-form-item label="姓名">
        <el-input v-model.trim="payOrder.name" />
      </el-form-item> -->
      <el-form-item label="分组" label-width="90">
        <el-col :span="24">
          <el-col :span="12">
            <el-input v-model="payOrder.group" :disabled="true" />
          </el-col>
          <el-col :span="11" :offset="1">
            <el-button type="primary" size="mini" @click="onSetting">设置</el-button>
          </el-col>
        </el-col>
      </el-form-item>
      <el-form-item label="订单号">
        <el-col :span="24">
          <el-col :span="12">
            <el-input v-model.trim="payOrder.orderNo" placeholder="订单号" />
          </el-col>
        </el-col>
      </el-form-item>
      <el-form-item label="金额">
        <el-col :span="24">
          <el-col :span="12">
            <el-input v-model.trim="payOrder.amount" placeholder="金额">
              <template slot="prepend">￥</template>
            </el-input>
          </el-col>
        </el-col>
        <!-- <el-input v-model.trim="payOrder.amount" placeholder="金额" /> -->
      </el-form-item>
      <el-form-item label="支付链接">
        <el-input
          v-model.trim="payOrder.payLink"
          type="textarea"
          :rows="2"
          placeholder="支付链接"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PayLink } from '@/api/order/order'
export default {
  data() {
    return {
      payOrder: {
        orderNo: '',
        payLink: '',
        group: '',
        name: ''
      },
      itemKey: 'paylink_setting'
    }
  },
  computed: {
    ...mapGetters([
      'sysUser'
    ])
  },
  created() {
    const params = this.$route.params
    this.payOrder.group = params.group

    // if (window.localStorage) {
    //   const name = localStorage.getItem(this.itemKey)
    //   this.payOrder.name = name
    // }
    if (window.localStorage) {
      const settingStorage = localStorage.getItem(this.itemKey)
      if (settingStorage) {
        const setting = JSON.parse(settingStorage)
        this.payOrder.group = setting.group
      } else {
        this.onSetting()
      }
    }
  },
  methods: {
    onSetting() {
      this.$prompt('请输入分组', '设置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const setting = { group: value }
        localStorage.setItem(this.itemKey, JSON.stringify(setting))

        this.payOrder.group = setting.group

        this.$message({
          type: 'success',
          message: `设置成功，当前分组：${value}`
        })
      }).catch(() => {
        // this.$message({
        //   type: 'warning',
        //   message: '未设置分组将不能提交'
        // })
      })
    },
    onSubmit() {
      if (!this.payOrder) {
        this.$message.info('提交失败')
        return
      }
      if (!this.payOrder.group) {
        this.$message.warning('分组不能为空，请先设置分组')
        return
      }
      if (!this.payOrder.orderNo || !this.payOrder.payLink || !this.payOrder.amount) {
        this.$message.warning('订单号、金额、支付链接不能为空')
        return
      }

      PayLink(this.payOrder.orderNo, this.payOrder.payLink, this.payOrder.amount, this.payOrder.group).then(res => {
        if (res.data) {
          // if (window.localStorage) {
          //   localStorage.setItem(this.itemKey, this.payOrder.name)
          // }
          this.reset()

          this.$message.success('提交成功')
        } else {
          this.$message.warning('提交失败')
        }
      }).catch(err => {
        this.$message.error(err.message || '提交异常')
      })
    },
    reset() {
      this.payOrder.orderNo = ''
      this.payOrder.amount = ''
      this.payOrder.payLink = ''
    }
  }
}
</script>
