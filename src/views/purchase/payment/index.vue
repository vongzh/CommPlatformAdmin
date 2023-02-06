<template>
  <div class="content">
    <el-col :span="20" :offset="2">
    <el-card class="order-info">
      <el-col :xl="6" :sm="10">
        <el-row>
          <el-col :xl="6" :sm="6">
            <el-link type="info" :underline="false">应付金额：</el-link>
          </el-col>
          <el-col :xl="16" :sm="14">
            <el-link type="info" class="price" :underline="false">￥{{ OrderPayment.orderAmount }}</el-link>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xl="6" :sm="6">
            <el-link type="info" :underline="false">购买项目：</el-link>
          </el-col>
          <el-col :xl="16" :sm="14">
            <el-link type="info" :underline="false">{{ OrderPayment.productName }}</el-link>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xl="{ span:12,offset:1}" :sm="{span:12,offset:2}">
        <el-row class="tips">
          <el-link :underline="false">请在<span class="timer"> {{ SurplusTime }} </span>内完成支付，超时订单会自动取消</el-link>
        </el-row>
      </el-col>
    </el-card>
    <el-card class="pay">
      <el-tabs type="card" @tab-click="onChangeTab" v-model="activeName">
        <el-tab-pane :lazy="true"  v-for = "(item,index) in PayType" :key="index"  :label="item.group" :name="item.index">
          <el-row  v-for="iitem in item.patTypes" :class="['pay-method',{'active':CurrentPayMethod === iitem.code} ]"  @click.native="onChangePayMethod(iitem.code)"
          :key="iitem.code">
            <el-col :span="5"  >
              <div class="logo" v-if="iitem.code==PayMethodEnum.WECHAT">
                <svg-icon icon-class="weixin" /><span class="text">{{iitem.name}}</span>
              </div>
            </el-col>
            <el-col :span="5"  >
              <div class="logo" v-if="iitem.code==PayMethodEnum.ALIPAY">
                <svg-icon icon-class="zhifubaozhifu_1" /><span class="text">{{iitem.name}}</span>
              </div>
            </el-col>
            <el-col :span="5"  >
              <div class="logo" v-if="iitem.code==PayMethodEnum.BALANCE">
                <svg-icon icon-class="balance" /><span class="text">{{iitem.name}}</span>
              </div>
            </el-col>
            <el-col :offset="3" :span="7" class="pay-tip mt10">{{iitem.desc}}</el-col>
          </el-row>
        </el-tab-pane>
          <!-- <el-row :class="['pay-method',{'active':CurrentPayMethod === PayMethodEnum.ALIPAY} ]" @click.native="onChangePayMethod(PayMethodEnum.ALIPAY)">
            <el-col :span="1" />
            <el-col :span="5">
              <div class="logo">
                <svg-icon icon-class="zhifubaozhifu_1" /><span class="text">支付宝</span>
              </div>
            </el-col>
            <el-col :offset="3" :span="7" class="pay-tip mt10">登录支付宝或支付宝扫码付款</el-col>
          </el-row> -->

        <!-- <el-tab-pane  label="银行卡支付" :lazy="true">
          <el-row :class="['pay-method',{'active':CurrentPayMethod === PayMethodEnum.YOP} ]" @click.native="onChangePayMethod(PayMethodEnum.YOP)">
            <el-col :span="1" />
            <el-col :span="4">
              <div class="logo">
                <el-image style="height:50px;width:100px;margin-top:10px" src="" />
              </div>
            </el-col>
            <el-col :offset="3" :span="12" class="pay-tip mt10">登录网银支付</el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="账户余额" :lazy="true" >
          <el-row :class="['pay-method',{'active':CurrentPayMethod === PayMethodEnum.BALANCE} ]" @click.native="onChangePayMethod(PayMethodEnum.BALANCE)">
            <el-col :span="1" />
            <el-col :span="4">
              <span>&nbsp;&nbsp;
                <svg-icon icon-class="balance" /></span>余额
            </el-col>
            <el-col :offset="3" :span="12" class="pay-tip">当前账户余额：<span class="price">0.00</span>元</el-col>
          </el-row>
        </el-tab-pane> -->
      </el-tabs>
    </el-card>
  </el-col>
    <div class="confirm-pay" v-if="this.PayType&&this.PayType.length>0">
      <el-col style="display: flex;justify-content: center;">
        <el-link class="back" @click="goBack()">返回</el-link>
        <el-button v-if="WaitPaymentOrder.paymentNo" type="danger" @click="cancalPaymentOrder(WaitPaymentOrder.paymentNo)">重选支付方式</el-button>
        <el-button v-if="WaitPaymentOrder.paymentNo" type="warning" @click="continuePay()">继续支付</el-button>
        <el-button v-if="!WaitPaymentOrder.paymentNo" :loading="paying" :disabled="paying" type="primary" @click="submitPay">付款</el-button>
      </el-col>
    </div>

    <el-dialog title="扫码支付" :visible.sync="payWindowVisiable" :close-on-click-modal="false" width="25%" center>
      <div class="qrcode-continer">
        <el-row>
          <el-image class="qrcode" :src="`data:image/gif;base64,${WaitPaymentOrder.waitPayForm}`" />
        </el-row>
        <el-row>
          <el-image src="data:image/png;base64,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" />
        </el-row>
      </div>
      <el-divider />
      <span slot="footer">
        <el-button type="danger" @click="momentPay()">先不支付</el-button>
        <el-button type="success" @click="iamPay()">我已支付</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetPayment,
  GetWaitPaymentOrder,
  CreatePaymentOrder,
  CancelPaymentOrder,
  GetPaymentOrder,
  GetUseable,
  BalancePayment
} from '@/api/order/order'
import moment from 'moment'
import md5 from 'js-md5'
export default {
  data: function() {
    return {
      payBalanceVisiable:false,
      PayType:{},
      activeName:"0",
      timer: null,
      SurplusTime: '00:00',
      OrderPayment: {
        orderAmount: 0
      },
      CurrentPayMethod: 50,
      PayMethodEnum: {
        WECHAT: 1,
        ALIPAY: 5,
        YOP: 10,
        BALANCE: 50
      },
      paymentOrderStatusEnum: {
        WAITPAY: 0,
        PAYING: 1,
        PAYSUCCESS: 2
      },
      payWindowVisiable: false,
      WaitPaymentOrder: {},
      payResult: false,
      paying: false,
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
        this.GetUseablePayType()
      if (this.getUrlParams()) {
        this.fetchOrderPayment()
      }
    },
    GetUseablePayType(){
      GetUseable().then(res=>{
				console.log(res)
        this.PayType = res.data
        //取到group
        var payGroups = this.PayType.map(x=>{
            return x.group
        });
        //去重
        payGroups = Array.from(new Set(payGroups))
        let groupPayTypes = []
        payGroups.forEach(group => {
          var payTypes =  this.PayType.filter(x=>x.group === group)
          groupPayTypes.push({
            group:group,
            patTypes : payTypes
          })
        });
        this.PayType= groupPayTypes.filter(item => {
					return item.group == "钱包"
				})
      })
    },
    getUrlParams() {
      const query = this.$route.query
      if (!query || !query.orderNo) {
        this.$alert('请返回重试', '查询订单支付失败', {
          confirmButtonText: '确定',
          type: 'error',
          callback: action => {
            this.$router.push({
              path: '/orderlist'
            })
          }
        })
        return false
      }
      this.OrderPayment.orderNo = query.orderNo
      return true
    },
    fetchOrderPayment() {
      const orderNo = this.OrderPayment.orderNo
      const that = this
      GetPayment(orderNo).then(res => {
        this.OrderPayment = res.data
        if (!this.OrderPayment) {
          this.OrderPayment = {}
          this.$alert('未找到待支付的订单', '提示', {
            type: 'warning',
            confirmButtonText: '返回',
            callback: action => {
              this.goBack()
            }
          })
          return
        }

        this.fetchWaitPay(() => {
          this.$confirm('当前订单存在未支付的支付单，是否继续支付？', '订单支付', {
            confirmButtonText: '继续支付',
            type: 'info',
            distinguishCancelAndClose: true,
            cancelButtonText: '重新选择支付方式',
            closeOnClickModal: false
          }).then(() => {
            that.continuePay()
          }).catch(action => {
            switch (action) {
              case 'cancel':
                that.cancalPaymentOrder(that.WaitPaymentOrder.paymentNo)
                break
              case 'close':
                break
            }
          })
        })
        this.calcSurplusTime()
      }).catch(err => {
        this.$confirm(err.message, '支付失败', {
          confirmButtonText: '去订单',
          cancelButtonText: '重新下单',
          type: 'error',
          closeOnClickModal: false
        }).then(() => {
          that.$store.dispatch('tagsView/delView', this.$route)
          that.goBack()
        }).catch(action => {
          this.$router.push({
            path: '/hotellist'
          })
        })
      })
    },
    fetchWaitPay(callback) {
      const that = this
      const orderNo = this.OrderPayment.orderNo
      GetWaitPaymentOrder(orderNo).then(res => {
        if (res.data && res.data.paymentNo) {
          that.WaitPaymentOrder = res.data
          that.CurrentPayMethod = res.data.paymentType
          if (callback && typeof callback === 'function') {
            callback()
          }
        }
      })
    },
    cancalPaymentOrder(paymentNo, callback) {
      const that = this
      CancelPaymentOrder(paymentNo).then(res => {
        if (res.data) {
          that.payWindowVisiable = false
          that.WaitPaymentOrder = {}

          if (callback && typeof callback === 'function') {
            callback()
          }
        } else {
          this.$message({
            message: '支付单取消失败，请稍后再试',
            type: 'warning'
          })
        }
      }).catch(err => {
        this.$alert(err.message, '支付单取消失败', {
          type: 'error',
          confirmButtonText: '重试',
          callback: action => {
            this.$router.go(0)
          }
        })
      })
    },
    continuePay() {
      if (!this.WaitPaymentOrder) {
        return
      }
      switch (this.CurrentPayMethod) {
        case this.PayMethodEnum.ALIPAY:
         if(!this.WaitPaymentOrder.waitPayForm)
         {
           return
         }
          this.goAliPay(this.WaitPaymentOrder.waitPayForm)
          this.iamPay()
          break
        case this.PayMethodEnum.WECHAT:
        if(!this.WaitPaymentOrder.waitPayForm)
         {
           return
         }
          this.payWindowVisiable = true
          this.WECHATPay()
        break
        case this.PayMethodEnum.BALANCE:
          this.payBalanceVisiable= true
          this.BalancePay()
          break
      }
    },
    momentPay() {
      this.payWindowVisiable = false
      clearInterval(this.timer)
    },
    BalancePay(){
      this.$prompt('请输入密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType:"password"
        }).then(({ value }) => {
        const paymentNo = this.WaitPaymentOrder.paymentNo
        const paymentPwd = md5(value)
        BalancePayment(paymentNo,paymentPwd).then(res => {
          if(res.result){
          this.$alert('支付成功', '支付完成', {
          confirmButtonText: '确定',
          callback: action => {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.goBack()
          }
        });
      }
          else{
            this.$alert('支付失败', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
          })
          }
        })
      }).catch(() => {})
    },
    WECHATPay() {
      const payComplate = (payResult) => {
        if (!payResult) {
          that.checkPayResult(this.WaitPaymentOrder.paymentNo, (ret) => {
            that.payResult = ret
          })
        }
        if (payResult) {
          this.$alert('支付成功', '支付完成', {
            confirmButtonText: '确定',
            type: 'success',
            callback: action => {
              clearInterval(this.timer)
              this.$store.dispatch('tagsView/delView', this.$route)
              that.goBack()
            }
          })
        } else {
          this.$alert('未查询到支付结果,请稍后刷新查看', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {
              clearInterval(this.timer)
            }
          })
        }
      }

      const that = this
      this.timer = setInterval(() => {
        that.checkPayResult(this.WaitPaymentOrder.paymentNo, (ret) => {
          that.payResult = ret
          if (ret) {
            payComplate(ret)
            clearInterval(this.timer)
          }
        })
      }, 3000)
    },

    iamPay() {
      clearInterval(this.timer)
      if (this.payWindowVisiable) {
        this.payWindowVisiable = false
      }

      const payComplate = (payResult) => {
        if (!payResult) {
          that.checkPayResult(this.WaitPaymentOrder.paymentNo, (ret) => {
            that.payResult = ret
          })
        }
        if (payResult) {
          clearInterval(this.timer)
          this.$alert('支付成功', '支付完成', {
            confirmButtonText: '确定',
            type: 'success',
            callback: action => {
              this.$store.dispatch('tagsView/delView', this.$route)
              that.goBack()
            }
          })
        } else {
          this.$alert('未查询到支付结果,请稍后刷新查看', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {
              clearInterval(this.timer)
            }
          })
        }
      }

      const that = this
      this.timer = setInterval(() => {
        that.checkPayResult(this.WaitPaymentOrder.paymentNo, (ret) => {
          that.payResult = ret
          if (ret) {
            payComplate(ret)
          }
        })
      }, 3000)

      this.$confirm('正在查询支付结果...', '支付中', {
        confirmButtonText: '我已支付',
        type: 'info',
        distinguishCancelAndClose: true,
        cancelButtonText: '支付遇到问题?',
        closeOnClickModal: false
      }).then(() => {
        clearInterval(this.timer)
        payComplate(that.payResult)
      }).catch(action => {
        if (action === 'cancel') {
          clearInterval(this.timer)
          this.$alert('请联系客服')
        } else {
          clearInterval(this.timer)
        }
      })
    },
    checkPayResult(paymentOrderNo, callback) {
      GetPaymentOrder(paymentOrderNo).then(res => {
        const paymentOrder = res.data
        const payRet = paymentOrder.paymentStatus === this.paymentOrderStatusEnum.PAYSUCCESS
        if (typeof callback === 'function') {
          callback(payRet)
        }
      })
    },
    // paymentCallback() {
    //   const paymentNo = this.WaitPaymentOrder.paymentNo
    //   PaymentCallback(paymentNo).then(res => {
    //     if (res.data) {
    //       this.goBack()
    //     } else {
    //       this.$message.error('支付失败')
    //     }
    //   })
    // },
    submitPay() {
      this.paying = true
      const that = this
      const orderNo = this.OrderPayment.orderNo
      const payType = this.CurrentPayMethod
      CreatePaymentOrder(orderNo, payType).then(res => {
        this.paying = false
        if (res.data.item1) {
          that.fetchWaitPay(() => {
            switch (payType) {
              case this.PayMethodEnum.WECHAT:
                break
              case this.PayMethodEnum.ALIPAY:
                break
              case this.PayMethodEnum.BALANCE:
                break
            }
            that.continuePay()
          })
        } else {
          this.$message({
            title: '支付失败',
            message: res.data.item2,
            type: 'warning'
          })
        }
      }).catch(err => {
        this.paying = false

        this.$confirm(err.message, '支付失败', {
          confirmButtonText: '返回订单',
          cancelButtonText: '稍后重试',
          closeOnClickModal: false
        })
          .then(() => {
            this.$router.push({
              path: '/order/' + orderNo,
              query: {
                orderNo
              }
            })
          })
          .catch(action => {

          })
      })
    },
    goAliPay(payForm) {
      if (!payForm) {
        return
      }
                      console.log('1');
      const routerData = this.$router.resolve({
        path: '/alipay',
        query: {
          param: payForm
        }
      })
      window.open(routerData.href, '_blank')
    },
    goBack() {
      const orderNo = this.OrderPayment.orderNo
      this.$router.push({
        path: `/order/${orderNo}`
      })
    },
    onChangePayMethod(method) {
      if (this.WaitPaymentOrder) {
        if (this.WaitPaymentOrder.paymentType !== method) {
          if (this.WaitPaymentOrder.paymentStatus === this.paymentOrderStatusEnum.PAYING) {
            const that = this
            this.$confirm('订单正在支付中，是否需要更改支付方式？', '订单支付', {
              confirmButtonText: '重新选择支付方式',
              type: 'info',
              distinguishCancelAndClose: true,
              cancelButtonText: '取消',
              closeOnClickModal: false
            }).then(() => {
              clearInterval(this.timer)
              that.cancalPaymentOrder(that.WaitPaymentOrder.paymentNo, () => {
                that.CurrentPayMethod = method
              })
            }).catch(action => {

            })
            return
          }
        }
      }

      this.CurrentPayMethod = method
    },
    onChangeTab(val) {
      if (val.label === '0') {
        this.onChangePayMethod(this.PayMethodEnum.WECHAT)
        this.CurrentPayMethod = this.PayMethodEnum.WECHAT
      }
      if (val.index === '1') {
        this.onChangePayMethod(this.PayMethodEnum.BALANCE)
        this.CurrentPayMethod = this.PayMethodEnum.BALANCE
      }
    },
    calcSurplusTime() {
      const that = this
      const endDate = moment(this.OrderPayment.orderDate).add(30, 'm')
      this.timer = setInterval(() => {
        let minute = parseInt(endDate.diff(moment(), 'seconds') / 60)
        let seconds = endDate.diff(moment(), 'seconds') % 60
        if (minute <= 0 && seconds <= 0) {
          clearInterval(this.timer)
          this.$router.go(0)
          return
        }
        if (minute < 10) {
          minute = '0' + minute
        }
        if (seconds < 10) {
          seconds = '0' + seconds
        }
        that.SurplusTime = minute + ':' + seconds
      }, 1000)
    }
  }
}
</script>

<style scoped>
.logo{
height:68px;width:300px;font-size:3.2rem;
padding-left: 2rem;
display: flex;
align-items:center;
}
.text{
font-size: 2rem;
margin-left: 1rem;
;
}

  .confirm-pay {
    margin: 15px;
  }

  .back {
    margin-right: 10px;
  }

  .content .order-info {
    padding-bottom: 15px;
    margin: 10px;
  }

  .content .order-info .el-row {
    font-size: x-large;
  }

  .content .pay {
    margin: 10px;
  }

  .tips {
    font-size: x-large;
    margin-top: 22px;
  }

  .tips .timer {
    font-size: xx-large;
    color: brown;
  }

  .pay-method {
    height: 70px;
    font-size: large;
    margin-bottom: 15px;
    border: 1px solid darkgrey;
  }

  .pay-md:hover {
    border: 1px solid #00BFFF;
  }

  .active {
    border: 1px solid #00BFFF;
  }

  .pay-method .el-col span {
    padding-right: 15px;
    font-size: 32px;
  }

  .mt10 {
    margin-top: 1.5rem;
  }

  .pay-tip {
    font-size: medium;
    text-align: left;
    color: darkgray;
  }

  .price {
    font-size: x-large;
    color: deepskyblue;
  }

  .qrcode {
    width: 300px;
    height: 300px;
  }

  .qrcode-continer {
    text-align: center;
  }
</style>
