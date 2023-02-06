<template>
  <div class="content">
    <el-card class="info">
      <div slot="header">
        <span>订单状态
          <el-popover placement="right-start" trigger="hover" title="订单日志" width="500" @show="fetchOrderLog">
            <el-timeline>
              <el-timeline-item v-for="(log,index) in orderLogs" :key="index" :timestamp="log.operTime" placement="top">
                <el-card>
                  <el-link :underline="false">{{ log.operContent }}</el-link>
                </el-card>
              </el-timeline-item>
            </el-timeline>
            <!-- <el-table :data="orderLogs">
              <el-table-column prop="operContent" label="操作内容" />
              <el-table-column prop="operUserTypeDesc" label="操作人" />
              <el-table-column prop="operTime" label="操作时间"/>
            </el-table> -->
            <i slot="reference" class="header-icon el-icon-info" />
          </el-popover>
        </span>
        <span class="opt">
          <el-button
            v-if="Order.orderStatus === OrderStatusEnum.WaitPay"
            type="danger"
            size="mini"
            class="btn-opt"
            icon="el-icon-goods"
            @click="goPay()"
          >去支付</el-button>
          <el-button
            v-if="Order.orderStatus === OrderStatusEnum.WaitConfirm"
            type="primary"
            size="mini"
            class="btn-opt"
            icon="el-icon-bell"
            @click="remind"
          >{{ Order.isReminder === YNEnum.Y?'已':'' }}催单</el-button>
          <el-button
            v-if="Order.orderStatus === OrderStatusEnum.WaitConfirm"
            type="danger"
            size="mini"
            class="btn-opt"
            icon="el-icon-document-delete"
            @click="applyRefound"
            :disabled=isDisabled
          >申请退款</el-button>
          <el-button
            v-if="Order.orderStatus === OrderStatusEnum.Done && Order.invoiceStatus === OrderInvoiceStatus.ORIGINAL "
            type="primary"
            size="mini"
            class="btn-opt"
            icon="el-icon-tickets"
            @click="invoiceRequest"
          >申请发票</el-button>
        </span>
      </div>
      <div class="order-status">
        <el-row>
          <el-col :xl="2" :sm="4" class="right-align">
            <el-link :underline="false">订单号：</el-link>
          </el-col>
          <el-col :xl="4" :sm="12">
            <el-link :underline="false">{{ Order.orderNo }}</el-link>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xl="2" :sm="4" class="right-align">
            <el-link :underline="false">订单金额：</el-link>
          </el-col>
          <el-col :xl="4" :sm="12">
            <el-link :underline="false">{{ Order.orderAmount }}</el-link>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xl="2" :sm="4" class="right-align">
            <el-link :underline="false">下单时间：</el-link>
          </el-col>
          <el-col :xl="4" :sm="12">
            <el-link :underline="false">{{ Order.orderDate }}</el-link>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xl="2" :sm="4" class="right-align">
            <el-link :underline="false">订单状态：</el-link>
          </el-col>
          <el-col :xl="4" :sm="12">
            <el-link :underline="false">{{ Order.orderStatusDesc }}</el-link>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xl="2" :sm="4" class="right-align">
            <el-link :underline="false">支付状态：</el-link>
          </el-col>
          <el-col :xl="4" :sm="12">
            <el-link :underline="false">{{ Order.paymentStatusDesc }}</el-link>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :xl="2" :sm="4" class="right-align">
            <el-link :underline="false">开票方：</el-link>
          </el-col>
          <el-col :xl="4" :sm="12">
            <el-link :underline="false">{{ Order.invoiceDrawerDesc }}</el-link>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :xl="2" :sm="4" class="right-align">
            <el-link :underline="false">开票状态：</el-link>
          </el-col>
          <el-col :xl="4" :sm="12">
            <el-link :underline="false">{{ Order.invoiceStatusDesc }}</el-link>
          </el-col>
        </el-row>
        <el-divider />
        <el-row class="order-setp">
          <el-steps v-if="Order.orderStatus" :space="200" :active="orderSetp" finish-status="success">
            <el-step title="下单" :description="Order.orderDate" status="success" />
            <el-step title="支付" :description="Order.paymentOrder.paymentTime" :status="orderPaymentSetpStatus" />
            <el-step v-if="Order.orderStatus===OrderStatusEnum.Cancel" title="取消" :status="orderCancelSetpStatus" />
            <el-step v-if="Order.refundStatus===OrderRefundStatusEnum.ORIGINAL" title="确认" :status="orderConfirmSetpStatus" :description="Order.confirmTime" />
            <el-step v-if="Order.refundStatus!==OrderRefundStatusEnum.ORIGINAL" title="售后/退款中" :description="Order.refundApplyOrder.auditTime" />
            <el-step v-if="Order.refundStatus===OrderRefundStatusEnum.ORIGINAL" title="入住" :status="orderComplateSetpStatus" />
            <el-step title="完成" :status="orderComplateSetpStatus" />
          </el-steps>
        </el-row>
      </div>
    </el-card>
    <el-card
      v-if="Order.orderStatus===OrderStatusEnum.Service || (Order.refundApplyOrder.refundStatus===RefundApplyOrderStatusEnum.COMPLETE || Order.refundApplyOrder.refundStatus===RefundApplyOrderStatusEnum.CLOSE)"
      class="info"
    >
      <div slot="header">
        <span>退款状态</span>
        <span class="opt">
          <el-button
            v-if="Order.orderStatus === OrderStatusEnum.Service && Order.refundApplyOrder.refundStatus === RefundApplyOrderStatusEnum.SUBMIT"
            type="danger"
            size="mini"
            class="btn-opt"
            @click="cancelRefoundApply"
          >取消退款申请</el-button>
        </span>
      </div>
      <div class="order-status">
        <el-row>
          <el-col :xl="2" :sm="4" class="right-align">
            <el-link :underline="false">退款单号：</el-link>
          </el-col>
          <el-col :xl="4" :sm="12">
            <el-link :underline="false">{{ Order.refundApplyOrder.refundNo }}</el-link>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xl="2" :sm="4" class="right-align">
            <el-link :underline="false">退款金额：</el-link>
          </el-col>
          <el-col :xl="4" :sm="12">
            <el-link :underline="false">{{ Order.refundApplyOrder.refundAmount }}</el-link>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xl="2" :sm="4" class="right-align">
            <el-link :underline="false">退款单状态：</el-link>
          </el-col>
          <el-col :xl="4" :sm="12">
            <el-link :underline="false">{{ Order.refundApplyOrder.refundStatusDesc }}</el-link>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xl="2" :sm="4" class="right-align">
            <el-link :underline="false">退款审核状态：</el-link>
          </el-col>
          <el-col :xl="4" :sm="12">
            <el-link :underline="false">{{ Order.refundApplyOrder.auditStatusDesc }}</el-link>
            <el-link v-if="Order.refundApplyOrder.auditStatus===RefundApplyOrderAuditStatus.REJECT" :underline="false">(原因:{{ Order.refundApplyOrder.auditDesc }})</el-link>
          </el-col>
        </el-row>
        <el-divider />
      </div>
      <el-steps :space="200" :active="refundSetp" finish-status="success" class="order-setp">
        <el-step title="提交申请" :description="Order.refundApplyOrder.applyTime" />
        <el-step title="等待审核" :description="Order.refundApplyOrder.auditTime" />
        <el-step
          v-if="Order.refundApplyOrder.auditStatus === RefundApplyOrderAuditStatus.ORIGINAL"
          title="审核完成"
          :description="Order.refundApplyOrder.auditTime"
        />
        <el-step
          v-if="Order.refundApplyOrder.auditStatus !== RefundApplyOrderAuditStatus.ORIGINAL"
          :title="Order.refundApplyOrder.auditStatus === RefundApplyOrderAuditStatus.PASS?'退款中':'未通过'"
          :status="Order.refundApplyOrder.auditStatus === RefundApplyOrderAuditStatus.PASS?'success':'error'"
          :description="Order.refundApplyOrder.auditTime"
        />
        <el-step
          v-if="Order.refundApplyOrder.auditStatus !== RefundApplyOrderAuditStatus.ORIGINAL"
          :title="Order.refundApplyOrder.auditStatus === RefundApplyOrderAuditStatus.PASS?'退款完成':'完成'"
          :description="Order.refundApplyOrder.refundTime"
          :status="Order.refundStatus===RefundApplyOrderStatusEnum.COMPLETE?'success':'process'"
        />
        <el-step
          v-if="Order.refundApplyOrder.auditStatus === RefundApplyOrderAuditStatus.ORIGINAL"
          title="完成"
          :description="Order.refundApplyOrder.refundTime"
        />
      </el-steps>
    </el-card>
    <el-card class="info">
      <div slot="header">
        <el-tooltip class="item" effect="dark" content="取消规则" placement="right">
          <span>入住信息 <i class="header-icon el-icon-info" /></span>
        </el-tooltip>
      </div>
      <el-table :data="checkInOrders">
        <el-table-column label="酒店名">
          <template slot-scope="scope">
            <el-link :underline="false" type="info">{{ scope.row.hotelName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="房型名称" width="150">
          <template slot-scope="scope">
            <el-link :underline="false" type="info">{{ scope.row.roomTypeName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="房间数量" width="100">
          <template slot-scope="scope">
            <el-link :underline="false" type="info">{{ scope.row.roomCount }} 间</el-link>
          </template>
        </el-table-column>
        <el-table-column label="早餐" width="100">
          <template slot-scope="scope">
            <el-link :underline="false" type="info">{{ scope.row.breakFastNum }} 份</el-link>
          </template>
        </el-table-column>
        <el-table-column label="入离日期">
          <template slot-scope="scope">
            <el-link :underline="false">{{ dateTimeToDate(scope.row.checkInDate) }}/{{ dateTimeToDate(scope.row.checkOutDate) }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="checkInName" label="入住人" />
        <el-table-column prop="checkInName" label="联系人" />
        <el-table-column prop="checkInPhone" label="入住人电话" />
      </el-table>
    </el-card>
    <el-card v-if="paymentOrders.length>0" class="info">
      <div slot="header">
        <el-tooltip class="item" effect="dark" content="退款流程" placement="right">
          <span>支付信息 <i class="header-icon el-icon-info" /></span>
        </el-tooltip>
      </div>
      <el-table :data="paymentOrders">
        <el-table-column prop="paymentNo" label="支付单号" />
        <el-table-column prop="paymentAmount" label="支付金额" />
        <el-table-column prop="paymentStatusDesc" label="支付状态" />
        <el-table-column prop="paymentTypeDesc" label="支付方式" />
        <el-table-column prop="paymentOrderDate" label="支付时间" />
      </el-table>
    </el-card>

    <el-dialog :visible.sync="refundFormVisiable" label-position="right" :inline="true">
      <div slot="title">
        <el-tooltip class="item" effect="dark" content="特殊退款情况请联系客服" placement="right">
          <span>退款申请 <i class="header-icon el-icon-info" /></span>
        </el-tooltip>
      </div>
      <el-card class="refund">
        <div slot="header" class="refund-header">
          <el-row>
            <el-col :span="3">订单编号：</el-col>
            <el-col :span="3">
              <el-link :underline="false">{{ Order.orderNo }}</el-link>
            </el-col>
            <el-col :offset="1" :span="3">订单状态：</el-col>
            <el-col :span="3">
              <el-link :underline="false">{{ Order.orderStatusDesc }}</el-link>
            </el-col>
            <el-col :offset="1" :span="3">订单时间：</el-col>
            <el-col :span="4">
              <el-link :underline="false">{{ Order.orderDate }}</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">支付单号：</el-col>
            <el-col :span="3">
              <el-link :underline="false">{{ Order.paymentOrder.paymentNo }}</el-link>
            </el-col>
            <el-col :offset="1" :span="3">支付状态：</el-col>
            <el-col :span="3">
              <el-link :underline="false">{{ Order.paymentStatusDesc }}</el-link>
            </el-col>
            <el-col :offset="1" :span="3">支付时间：</el-col>
            <el-col :span="4">
              <el-link :underline="false">{{ Order.paymentOrder.paymentTime }}</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">支付方式：</el-col>
            <el-col :span="3">
              <el-link :underline="false">{{ Order.paymentOrder.paymentTypeDesc }}</el-link>
            </el-col>
            <el-col :offset="1" :span="3">支付金额：</el-col>
            <el-col :span="3">
              <el-link :underline="false">{{ Order.paymentOrder.paymentAmount }}</el-link>
            </el-col>
            <!-- <el-col :offset="1" :span="3">预订数量：</el-col>
            <el-col :span="3">
              <el-link :underline="false">{{ Order.roomCount }} 间</el-link>
            </el-col>
            <el-col :offset="1" :span="3">预订天数：</el-col>
            <el-col :span="3">
              <el-link :underline="false">{{ Order.bookingDays }} 天</el-link>
            </el-col> -->
          </el-row>
        </div>
        <el-form>
          <!-- <el-form-item label="退款数量">
            <el-col :span="5">
              <el-input-number v-model="Refund.refundCount" size="small" :min="1" :max="Order.roomCount" />
            </el-col>
          </el-form-item>
          <el-form-item label="退款天数">
            <el-col :span="5">
              <el-checkbox-group v-model="Refund.refundDate" size="small">
                <el-checkbox-button v-for="i in Refund.bookingDays" :key="i" :label="i">{{ i }}</el-checkbox-button>
              </el-checkbox-group>
              <el-input-number v-model="Refund.refundDays" readonly size="small" :min="1" :max="Order.bookingDays" />
            </el-col>
          </el-form-item> -->
          <el-form-item label="退款金额">
            <el-col :span="5">
              <el-input v-model="Refund.refundAmount" readonly disabled>
                <template slot="prepend">￥</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="退款原因">
            <el-select v-model="Refund.refundReason">
              <el-option v-for="reason in RefundReason" :key="reason.value" :label="reason.text" :value="reason.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="退款方式">
            <el-select v-model="Refund.refundType" disabled>
              <el-option :key="0" label="原路返回" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="原因描述">
            <el-col :span="12">
              <el-input v-model="Refund.refundDesc" type="textarea" :rows="2" placeholder="请输入退款描述" />
            </el-col>
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refundFormVisiable=false">取 消</el-button>
        <el-button type="primary" @click="submitRefund()">提交申请</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetOrder,
  Reminder,
  GetOrderLogs
} from '@/api/order/order'
import {
  ApplyRefound,
  CancelRefoundApply
} from '@/api/refund/refund'
import { InvoiceRequest } from '@/api/invoice/invoice'
import moment from 'moment'
export default {
  data() {
    return {
      Order: {
        paymentOrder: {},
        refundApplyOrder: {}
      },
      isDisabled:false,
      checkInOrders: [],
      paymentOrders: [],
      OrderStatusEnum: {
        WaitPay: 2,
        WaitConfirm: 4,
        WaitIn: 5,
        Service: 6,
        Cancel: 12,
        Done: 24
      },
      OrderInvoiceStatus: {
        ORIGINAL: 0
      },
      OrderPaymentStatus: {
        WAITPAY: 0,
        PAYSUCCESS: 2,
        PAYFAILTURE: 4
      },
      OrderRefundStatusEnum: {
        ORIGINAL: 0,
        SUBMIT: 2,
        PROCESSING: 4,
        COMPLETE: 6
      },
      OrderConfirmStatusEnum: {
        CONFIRMSSUCCESS: 1,
        CONFIRMFAIL: 2,
        WAITCONFIRM: 0
      },
      RefundApplyOrderStatusEnum: {
        CLOSE: -1,
        SUBMIT: 2,
        PROCESSING: 4,
        COMPLETE: 6
      },
      OrderHandlerStatus: {
        waitHandler: 0,
        handling: 2,
        success: 4,
        fail: 8
      },
      RefundApplyOrderAuditStatus: {
        ORIGINAL: 0,
        PASS: 1,
        REJECT: 2
      },
      orderSetp: 1,
      refundSetp: 1,
      orderPaymentSetpStatus: 'wait',
      orderConfirmSetpStatus: 'wait',
      orderCancelSetpStatus: 'wait',
      orderComplateSetpStatus: 'wait',
      refundFormVisiable: false,
      Refund: {
        refundCount: 1,
        refundDays: 1
      },
      RefundTypeEnum: {
        ORIGINAL: 0
      },
      YNEnum: {
        Y: 1,
        N: 0
      },
      RefundReason: [{
        value: 1,
        text: '平台'
      },
      {
        value: 2,
        text: '酒店'
      }
      ],
      orderLogs: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.getUrlParams()) {
        this.fetchOrder()
      }
    },
    getUrlParams() {
      const query = this.$route.query
      if (!query || !query.orderNo) {
        this.$alert('请返回重试', '订单查询失败', {
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
      this.Order.orderNo = query.orderNo
      return true
    },
    fetchOrder() {
      this.checkInOrders = []
      this.paymentOrders = []

      const orderNo = this.Order.orderNo
      GetOrder(orderNo).then(res => {
        this.Order = res.data

        var checkInName = this.Order.checkInName.split(',')
        for (var i = 1; i <= checkInName.length; i++) {
          const checkInOrder = { ...this.Order
          }
          checkInOrder.roomCount = 1
          checkInOrder.checkInName = checkInName[i - 1]
          this.checkInOrders.push(checkInOrder)
        }

        // 支付单流程
        switch (this.Order.paymentStatus) {
          case this.OrderPaymentStatus.WAITPAY:
            this.orderPaymentSetpStatus = 'process'
            this.Order.paymentOrder = {}
            break
          case this.OrderPaymentStatus.PAYSUCCESS:
            this.orderPaymentSetpStatus = 'success'

            this.orderSetp = 2
            if (this.Order.paymentOrder) {
              this.paymentOrders.push(this.Order.paymentOrder)
            }
            break
          case this.OrderPaymentStatus.PAYFAILTURE:
            this.orderPaymentSetpStatus = 'error'
            this.Order.paymentOrder = {}
            break
        }

        // 订单确认流程
        switch (this.Order.confirmStatus) {
          case this.OrderConfirmStatusEnum.CONFIRMSSUCCESS:
            this.orderSetp = 3
            this.orderConfirmSetpStatus = 'success'
            break
          case this.OrderConfirmStatusEnum.CONFIRMFAIL:
            this.orderConfirmSetpStatus = 'error'
            break
          case this.OrderConfirmStatusEnum.WAITCONFIRM:
            switch (this.Order.paymentStatus) {
              case this.OrderPaymentStatus.WAITPAY:
              case this.OrderPaymentStatus.PAYFAILTURE:
                this.orderConfirmSetpStatus = 'wait'
                break
              case this.OrderPaymentStatus.PAYSUCCESS:
                this.orderConfirmSetpStatus = 'process'
                break
            }
            break
        }

        // 退款流程
        switch (this.Order.refundStatus) {
          case this.OrderRefundStatusEnum.ORIGINAL:
            this.Order.refundApplyOrder = {}
            break
          case this.OrderRefundStatusEnum.PROCESSING:
            this.refundSetp = 3

            this.orderSetp = 3
            if (this.Order.confirmStatus !== this.OrderConfirmStatusEnum.WAITCONFIRM) {
              this.orderSetp = 4
            }
            break
          case this.OrderRefundStatusEnum.COMPLETE:
            this.refundSetp = 4

            if (this.Order.confirmStatus === this.OrderConfirmStatusEnum.WAITCONFIRM) {
              this.orderSetp = 4
            } else {
              this.orderSetp = 5
            }
            break
          case this.RefundApplyOrderStatusEnum.CLOSE:
            this.refundSetp = 4
            break
        }

        switch (this.Order.orderStatus) {
          case this.OrderStatusEnum.Done:
            this.orderSetp = 5
            this.orderComplateSetpStatus = 'success'
            break
          case this.OrderStatusEnum.Cancel:
            this.orderPaymentSetpStatus = 'error'
            this.orderCancelSetpStatus = 'success'
            break
        }
      })
    },
    fetchOrderLog() {
      const orderNo = this.Order.orderNo
      GetOrderLogs(orderNo).then(res => {
        this.orderLogs = res.data
      })
    },
    applyRefound() {
      this.Refund.orderNo = this.Order.orderNo
      this.Refund.paymentOrderNo = this.Order.paymentOrder.paymentNo
      this.Refund.refundType = this.RefundTypeEnum.ORIGINAL
      this.Refund.refundAmount = this.Order.orderAmount
      this.refundFormVisiable = true
    },
    cancelRefoundApply() {
      this.$confirm('确定要取消退款申请吗？', '确认提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          const refundNo = this.Order.refundApplyOrder.refundNo
          CancelRefoundApply(refundNo).then(res => {
            if (res.data) {
              this.fetchOrder()
              this.$message({
                type: 'success',
                message: '取消退款申请成功'
              })
            } else {
              this.$message({
                type: 'error',
                message: '取消退款申请失败'
              })
            }
          })
        })
        .catch(action => {

        })
    },
    submitRefund() {
      const param = this.Refund
                const loading = this.$loading({
              lock: true,
              text: '正在申请退款',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            this.isDisabled = true
      ApplyRefound(param).then(res => {
        if (res.data) {
          this.fetchOrder()
          this.Refund = {}
          this.refundFormVisiable = false
          this.$message({
            type: 'success',
            message: '退款申请成功'
          })
                        this.isDisabled = false
        } else {
          this.$message({
            type: 'error',
            message: '退款申请失败'
          })
                        this.isDisabled = false
        }
                    loading.close()
      })
    },
    remind() {
      const orderNo = this.Order.orderNo
      Reminder(orderNo).then(res => {
        if (res.data) {
          this.Order.isReminder = this.YNEnum.Y

          this.$message({
            type: 'success',
            message: '催单成功，正在加急处理'
          })
        } else {
          this.$message({
            type: 'error',
            message: '催单失败，请稍后再试'
          })
        }
      })
    },
    invoiceRequest() {
      InvoiceRequest(this.Order.orderNo).then(res => {
        if (res.data) {
          this.$message({
            type: 'success',
            message: '发票申请成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: '发票申请失败，请稍后再试'
          })
        }
      })
    },
    goPay() {
      const orderNo = this.Order.orderNo
      this.$router.push({
        path: '/payment',
        query: {
          orderNo
        }
      })
    },
    dateTimeToDate(val) {
      return moment(val).format('YYYY-MM-DD')
    }
  }
}
</script>

<style scoped>
  .info {
    margin: 15px;
  }

  .refund-header {
    padding: 0.625rem;
    padding-bottom: 0;
  }

  .refund-header .el-row {
    font-size: small;
    height: 2.5rem;
  }

  .right-align {
    font-size: 13px;
    padding-right: 15px;
    text-align: right;
          color: #606266;
  }

  .opt {
    float: right;
  }

  .order-setp {
    margin-left: 3%;
    margin-top: 1.5rem;
  }

  .el-link {
    cursor: default;
  }

.el-link.el-link--default:hover {
  color: #606266;
  }
</style>
