<template>
  <div v-show="Order.orderStatus" class="content">
    <el-row>
      <el-col :span="12">
        <el-card class="info">
          <div slot="header">
            <span>订单信息
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
                v-if="Order.isLock == LockEnum.Lock && Order.lockUserId === sysUser.userId"
                type="primary"
                size="mini"
                class="btn-opt"
                icon="el-icon-unlock"
                @click="unlockOrder"
              >解锁</el-button>
              <el-button
                v-if="showOpt && Order.orderHandleStatus !== OrderHandlerStatus.handling && Order.orderStatus === OrderStatusEnum.WaitConfirm"
                type="success"
                size="mini"
                class="btn-opt"
                icon="el-icon-check"
                @click="confirmOrder"
              >确认</el-button>
              <el-button
                v-if="showOpt && Order.orderHandleStatus !== OrderHandlerStatus.handling && Order.orderStatus === OrderStatusEnum.WaitConfirm"
                type="danger"
                size="mini"
                class="btn-opt"
                icon="el-icon-close"
                @click="rejectOrder"
              >拒单</el-button>
              <!-- <el-button
                v-if="showOpt && Order.orderHandleStatus !== OrderHandlerStatus.handling && Order.paymentStatus === OrderPaymentStatusEnum.PAYSUCCESS && (Order.orderStatus === OrderStatusEnum.WaitConfirm)"
                type="warning"
                size="mini"
                class="btn-opt"
                icon="el-icon-money"
                @click="lunchRefund"
              >退款</el-button> -->
            </span>
          </div>
          <div class="order-status">
            <el-row>
              <el-col :xl="4" :sm="8" class="right-align">
                <el-link :underline="false">订单号：</el-link>
              </el-col>
              <el-col :xl="8" :sm="16">
                <el-link :underline="false">{{ Order.orderNo }}</el-link>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xl="4" :sm="8" class="right-align">
                <el-link :underline="false">订单金额：</el-link>
              </el-col>
              <el-col :xl="8" :sm="16">
                <el-link :underline="false">{{ Order.orderAmount }}</el-link>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xl="4" :sm="8" class="right-align">
                <el-link :underline="false">订单状态：</el-link>
              </el-col>
              <el-col :xl="8" :sm="16">
                <el-link :underline="false">{{ Order.orderStatusDesc }}</el-link>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xl="4" :sm="8" class="right-align">
                <el-link :underline="false">支付状态：</el-link>
              </el-col>
              <el-col :xl="8" :sm="16">
                <el-link :underline="false">{{ Order.paymentStatusDesc }}</el-link>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col :xl="4" :sm="8" class="right-align">
                <el-link :underline="false">开票方：</el-link>
              </el-col>
              <el-col :xl="8" :sm="16">
                <el-link :underline="false">{{ Order.invoiceDrawerDesc }}</el-link>
              </el-col>
            </el-row> -->
            <el-row>
              <el-col :xl="4" :sm="8" class="right-align">
                <el-link :underline="false">开票状态：</el-link>
              </el-col>
              <el-col :xl="8" :sm="16">
                <el-link :underline="false">{{ Order.invoiceStatusDesc }}</el-link>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xl="4" :sm="8" class="right-align">
                <el-link :underline="false">下单时间：</el-link>
              </el-col>
              <el-col :xl="8" :sm="16">
                <el-link :underline="false">{{ Order.orderDate }}</el-link>
              </el-col>
            </el-row>
            <el-divider />
            <!-- <el-row class="order-setp">
              <el-steps :space="200" :active="orderSetp" finish-status="success">
                <el-step title="下单" :description="Order.orderDate" />
                <el-step title="支付" :description="Order.paymentOrder.paymentTime" />
                <el-step title="确认" :status="orderConfirmSetpStatus" :description="Order.confirmTime" />
                <el-step v-if="Order.refundStatus!=OrderRefundStatusEnum.ORIGINAL" title="售后/退款中" :description="Order.refundApplyOrder.auditTime" />
                <el-step v-if="Order.refundStatus===OrderRefundStatusEnum.ORIGINAL" title="入住" />
                <el-step title="完成" />
              </el-steps>
            </el-row> -->
            <el-row class="order-setp">
              <el-steps v-if="Order.orderStatus" :space="200" :active="orderSetp" finish-status="success">
                <el-step title="下单" :description="Order.orderDate" />
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
      </el-col>
      <el-col :span="12">
        <el-card
          v-if="Order.paymentStatus === OrderPaymentStatusEnum.PAYSUCCESS && Order.orderStatus!=OrderStatusEnum.Service"
          class="info"
        >
          <div slot="header">
            <span>采购订单信息</span>
            <span class="opt">
              <el-button
                v-if="showOpt &&Order.orderHandleStatus===OrderHandlerStatus.handling"
                type="danger"
                size="mini"
                class="btn-opt"
                icon="el-icon-s-promotion"
                @click="purchaseFail"
              >采购失败</el-button>
              <el-button
                v-if="showOpt &&Order.confirmStatus===OrderConfirmStatusEnum.WAITCONFIRM"
                type="warning"
                size="mini"
                class="btn-opt"
                icon="el-icon-s-promotion"
                @click="rePurchase"
              >系统重新采购</el-button>
              <el-button
                v-if="showOpt &&Order.confirmStatus===OrderConfirmStatusEnum.WAITCONFIRM"
                type="primary"
                size="mini"
                class="btn-opt"
                icon="el-icon-lock"
                @click="lunchPurchase"
              >人工采购</el-button>
            </span>
          </div>
          <div class="order-status">
            <el-row>
              <el-col :xl="4" :sm="8" class="right-align">
                <el-link :underline="false">订单采购状态：</el-link>
              </el-col>
              <el-col :xl="8" :sm="16">
                <el-link>{{ Order.orderHandleStatusDesc }}</el-link>
              </el-col>
            </el-row>
            <el-divider />
            <div v-if="Order.purchaseOrder">
              <el-row>
                <el-col :xl="4" :sm="8" class="right-align">
                  <el-link :underline="false">采购订单号：</el-link>
                </el-col>
                <el-col :xl="8" :sm="16">
                  <el-link>{{ Order.purchaseOrder.purchaseOrderNo }}</el-link>
                </el-col>
              </el-row>
              <el-row>
                <el-col :xl="4" :sm="8" class="right-align">
                  <el-link :underline="false">采购订单状态：</el-link>
                </el-col>
                <el-col :xl="8" :sm="16">
                  <el-link :underline="false">{{ Order.purchaseOrder.purchaseStatusDesc }}</el-link>
                </el-col>
              </el-row>
              <el-row>
                <el-col :xl="4" :sm="8" class="right-align">
                  <el-link :underline="false">采购订单金额：</el-link>
                </el-col>
                <el-col :xl="8" :sm="16">
                  <el-link :underline="false">{{ Order.purchaseOrder.purchasePrice }}</el-link>
                </el-col>
              </el-row>
              <!-- <el-row>
                <el-col :xl="4" :sm="8" class="right-align">
                  <el-link :underline="false">采购状态：</el-link>
                </el-col>
                <el-col :xl="8" :sm="16">
                  <el-link :underline="false">{{ Order.orderStatusDesc }}</el-link>
                </el-col>
              </el-row> -->
              <el-row>
                <el-col :xl="4" :sm="8" class="right-align">
                  <el-link :underline="false">采购平台：</el-link>
                </el-col>
                <el-col :xl="8" :sm="16">
                  <el-link :underline="false">{{ Order.purchaseOrder.platform }}</el-link>
                </el-col>
              </el-row>
              <el-row>
                <el-col :xl="4" :sm="8" class="right-align">
                  <el-link :underline="false">采购时间：</el-link>
                </el-col>
                <el-col :xl="8" :sm="16">
                  <el-link :underline="false">{{ Order.purchaseOrder.orderDate }}</el-link>
                </el-col>
              </el-row>
              <el-row>
                <el-col :xl="4" :sm="8" class="right-align">
                  <el-link :underline="false">采购更新时间：</el-link>
                </el-col>
                <el-col :xl="8" :sm="16">
                  <el-link :underline="false">{{ Order.purchaseOrder.orderUpdateDate }}</el-link>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-card
        v-if="Order.orderStatus===OrderStatusEnum.Service || Order.refundStatus!=OrderRefundStatusEnum.ORIGINAL"
        class="info"
      >
        <div slot="header">
          <span>退款状态</span>
        </div>
        <div class="order-status">
          <el-row>
            <el-col :xl="4" :sm="8" class="right-align">
              <el-link :underline="false">退款单号：</el-link>
            </el-col>
            <el-col :xl="8" :sm="16">
              <el-link :underline="false">{{ Order.refundApplyOrder.refundNo }}</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xl="4" :sm="8" class="right-align">
              <el-link :underline="false">退款金额：</el-link>
            </el-col>
            <el-col :xl="8" :sm="16">
              <el-link :underline="false">{{ Order.refundApplyOrder.refundAmount }}</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xl="4" :sm="8" class="right-align">
              <el-link :underline="false">退款单状态：</el-link>
            </el-col>
            <el-col :xl="8" :sm="16">
              <el-link :underline="false">{{ Order.refundApplyOrder.refundStatusDesc }}</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xl="4" :sm="8" class="right-align">
              <el-link :underline="false">退款审核状态：</el-link>
            </el-col>
            <el-col :xl="8" :sm="16">
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
    </el-row>
    <el-card class="info">
      <div slot="header">
        <el-tooltip class="item" effect="dark" content="取消规则" placement="right">
          <span>入住信息 <i class="header-icon el-icon-info" /></span>
        </el-tooltip>
      </div>
      <el-table :data="checkInOrders">
        <el-table-column label="酒店名">
          <template slot-scope="scope">
            <el-col :underline="false" type="info">{{ scope.row.hotelName }}</el-col>
          </template>
        </el-table-column>
        <el-table-column prop="hotelCode" label="酒店编号" width="100" />
        <el-table-column label="房型名称" width="150">
          <template slot-scope="scope">
            <el-col :underline="false" type="info">{{ scope.row.roomTypeName }}</el-col>
          </template>
        </el-table-column>
        <el-table-column label="房间数量" width="100">
          <template slot-scope="scope">
            <el-col :underline="false" type="info">{{ scope.row.roomCount }} 间</el-col>
          </template>
        </el-table-column>
        <el-table-column label="早餐" width="100">
          <template slot-scope="scope">
            <el-link :underline="false" type="info">{{ scope.row.breakFastNum }} 份</el-col>
          </template>
        </el-table-column>
        <el-table-column label="入离日期">
          <template slot-scope="scope">
            <el-col :underline="false">{{ dateTimeToDate(scope.row.checkInDate) }}/{{ dateTimeToDate(scope.row.checkOutDate) }}</el-col>
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
        <el-table-column prop="paymentTime" label="支付时间" />
      </el-table>
    </el-card>
    <el-dialog :visible.sync="refundFormVisiable" label-position="right" :close-on-click-modal="false" :inline="true" title="退款申请">
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
            <el-col :offset="1" :span="3">支付状态：</el-col>
            <el-col :span="3">
              <el-link :underline="false">{{ Order.paymentStatusDesc }}</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">支付金额：</el-col>
            <el-col :span="3">
              <el-link :underline="false">{{ Order.paymentOrder.paymentAmount }}</el-link>
            </el-col>
            <el-col :offset="1" :span="3">支付方式：</el-col>
            <el-col :span="3">
              <el-link :underline="false">{{ Order.paymentOrder.paymentTypeDesc }}</el-link>
            </el-col>
            <el-col :offset="1" :span="3">支付时间：</el-col>
            <el-col :span="4">
              <el-link :underline="false">{{ Order.paymentOrder.paymentTime }}</el-link>
            </el-col>
          </el-row>
        </div>
        <el-form>
          <el-form-item label="退款金额">
            <el-col :span="5">
              <el-input v-model="Refund.refundAmount" readonly disabled>
                <template slot="prepend">￥</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="退款方式">
            <el-select v-model="Refund.refundType" disabled>
              <el-option :key="0" label="原路返回" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="退款原因">
            <el-select v-model="Refund.refundReason">
              <el-option v-for="reason in RefundReason" :key="reason.value" :label="reason.text" :value="reason.value" />
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
    <el-dialog :visible.sync="refundRequestVisiable" title="退款" :close-on-click-modal="false">
      <el-card>
        <div slot="header" class="refund-header">
          <el-row>
            <el-col :span="3">订单编号：</el-col>
            <el-col :span="3">
              <el-tag size="mini">{{ Order.orderNo }}</el-tag>
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
              <el-tag size="mini">{{ Order.paymentOrder.paymentNo }}</el-tag>
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
          <el-row>
            <el-col :span="8">
              <el-form-item label="退款数量">
                <el-input-number v-model="Refund.refundCount" size="small" :min="1" :max="Order.roomCount" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="退款天数">
                <el-col :span="10">
                  <el-input-number v-model="Refund.refundDays" readonly size="small" :min="1" :max="Order.bookingDays" />
                </el-col>
                <el-col :span="10">
                  <el-checkbox-group v-model="Refund.refundDate" size="mini">
                    <el-checkbox-button v-for="i in canRefundDates" :key="i" :label="i">{{ i }}</el-checkbox-button>
                  </el-checkbox-group>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="退款金额">
                <el-col :span="12">
                  <el-input v-model="Refund.refundAmount" size="small" readonly disabled>
                    <template slot="prepend">￥</template>
                  </el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="退款原因">
                <el-select v-model="Refund.refundReason" size="small">
                  <el-option v-for="reason in RefundReason" :key="reason.value" :label="reason.text" :value="reason.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="退款方式">
            <el-select v-model="Refund.refundType" size="small" disabled>
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
        <el-button size="small" @click="refundRequestVisiable=false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitRefund()">提交申请</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="purchaseFormVisiable" :close-on-click-modal="false" label-position="right" :inline="true">
      <div slot="title">
        <el-tooltip class="item" effect="dark" content="如操作未提交请重新系统采购" placement="right">
          <span>采购订单 <i class="header-icon el-icon-info" /></span>
        </el-tooltip>
      </div>
      <el-form>
        <el-row>
          <el-col :span="8">
            <el-form-item label="采购平台">
              <el-select v-model="PurchaseOrder.PlatformId" size="small">
                <el-option label="美团" :value="6" />
                <el-option label="携程" :value="9" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购金额">
              <el-col :span="12">
                <el-input-number v-model="PurchaseOrder.purchasePrice" size="small" placeholder="金额" :precision="2" :step="100" :max="100000" style="width:220px">
                  <template slot="prepend">￥</template>
                </el-input-number>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="支付方式">
              <el-select v-model="PurchaseOrder.PayType" size="small">
                <el-option label="银行卡" :value="6" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付账号">
              <el-col :span="12">
                <el-input v-model="PurchaseOrder.PayAccount" size="small" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="采购账号">
              <el-col :span="14">
                <el-input v-model="PurchaseOrder.account" placeholder="请输入采购账号" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购密码">
              <el-col :span="12">
                <el-input v-model="PurchaseOrder.password" placeholder="请输入采购账号密码" maxlength="30" show-word-limit />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="采购平台单号">
          <el-input v-model="PurchaseOrder.platformOrderNo" placeholder="请输入采购平台单号" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="订单备注">
          <el-col :span="12">
            <el-input v-model="PurchaseOrder.remark" type="textarea" :rows="9" placeholder="请输入采购描述" maxlength="900" show-word-limit />
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="purchaseFormVisiable=false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitPurchase">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetOrder,
  ConfirmOrder,
  RejectOrder,
  LockOrder,
  UnlockOrder,
  GetOrderLogs,
  PurchaseRequest,
  Purchase,
  PurchaseOrderFromPlatform,
  PurchaseFail
} from '@/api/order/order'
import {
  ApplyRefound,
  CancelRefoundApply
} from '@/api/refund/refund'
import moment from 'moment'
import {
  mapGetters
} from 'vuex'
export default {
  data() {
    return {
      Order: {
        paymentOrder: {},
        refundApplyOrder: {},
        purchaseOrder: {}
      },
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
      OrderRefundStatusEnum: {
        ORIGINAL: 0,
        SUBMIT: 2,
        PROCESSING: 4,
        COMPLETE: 6
      },
      RefundApplyOrderStatusEnum: {
        CLOSE: -1,
        SUBMIT: 2,
        PROCESSING: 4,
        COMPLETE: 6
      },
      OrderPaymentStatusEnum: {
        WAITPAY: 0,
        PAYSUCCESS: 2,
        PAYFAILTURE: 4
      },
      OrderConfirmStatusEnum: {
        CONFIRMSSUCCESS: 1,
        CONFIRMFAIL: 2,
        WAITCONFIRM: 0
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
      LockEnum: {
        NoLock: 0,
        Lock: 1
      },
      showOpt: false,
      orderSetp: 1,
      refundSetp: 1,
      orderPaymentSetpStatus: 'wait',
      orderConfirmSetpStatus: 'wait',
      orderCancelSetpStatus: 'wait',
      orderComplateSetpStatus: 'wait',
      refundFormVisiable: false,
      Refund: {
        refundCount: 1,
        refundDays: 1,
        refundDate: []
      },
      RefundTypeEnum: {
        ORIGINAL: 0
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
      orderLogs: [],
      // 退款
      refundRequestVisiable: false,
      canRefundDates: [],
      purchaseFormVisiable: false,
      PurchaseOrder: {

      }
    }
  },
  computed: {
    ...mapGetters([
      'sysUser'
    ])
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
              path: '/supply/orderlist'
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

      const loading = this.$loading({
        lock: true,
        text: '正在加载订单',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      GetOrder(this.Order.orderNo).then(res => {
        const order = res.data
        if (order.orderStatus === this.OrderStatusEnum.WaitConfirm ||
            order.orderStatus === this.OrderStatusEnum.Service) {
          if (order.isLock && order.isLock === this.LockEnum.Lock) {
            if (order.lockUserId === this.sysUser.userId) {
              this.showOpt = true

              this.lunchOrder(order)
            } else {
              this.$confirm('当前订单已被<strong style="color:red;font-size:large">' + order.lockUserName +
                  '</strong>锁定,是否解锁并重新锁定', '提示', {
                confirmButtonText: '锁定',
                cancelButtonText: '不锁定',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                dangerouslyUseHTMLString: true
              }).then(() => {
                this.lockOrder(order)
              }).catch(action => {
                this.lunchOrder(order)
              })
            }
          } else {
            this.$confirm('是否锁定订单,订单不锁定将只能查看无法操作', '提示', {
              confirmButtonText: '锁定',
              cancelButtonText: '不锁定',
              type: 'warning',
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false
            }).then(() => {
              this.lockOrder(order)
            }).catch(action => {
              this.lunchOrder(order)
            })
          }
        } else {
          this.lunchOrder(order)

          this.showOpt = true
        }

        loading.close()
      })
    },
    unlockOrder() {
      const loading = this.$loading({
        lock: true,
        text: '正在解锁订单',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      UnlockOrder(this.Order.orderNo).then(res => {
        if (res.data) {
          this.showOpt = false

          this.Order.isLock = this.LockEnum.NoLock

          this.$message('订单解锁成功')
        } else {
          this.$message('订单解锁失败,请刷新重试')
        }

        loading.close()
      })
    },
    lockOrder(order) {
      const loading = this.$loading({
        lock: true,
        text: '正在锁定订单',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      LockOrder(order.orderNo).then(res => {
        if (res.data) {
          order.isLock = this.LockEnum.Lock

          this.showOpt = true

          this.lunchOrder(order)
        } else {
          this.$message('订单锁定失败,请刷新重试')
        }
        loading.close()
      })
    },
    lunchOrder(order) {
      this.Order = order

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
        case this.OrderPaymentStatusEnum.WAITPAY:
          this.orderPaymentSetpStatus = 'process'
          this.Order.paymentOrder = {}
          break
        case this.OrderPaymentStatusEnum.PAYSUCCESS:
          this.orderPaymentSetpStatus = 'success'

          this.orderSetp = 2
          if (this.Order.paymentOrder) {
            this.paymentOrders.push(this.Order.paymentOrder)
          }
          break
        case this.OrderPaymentStatusEnum.PAYFAILTURE:
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
            case this.OrderPaymentStatusEnum.WAITPAY:
            case this.OrderPaymentStatusEnum.PAYFAILTURE:
              this.orderConfirmSetpStatus = 'wait'
              break
            case this.OrderPaymentStatusEnum.PAYSUCCESS:
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

      // // 订单处理流程
      // if (this.Order.orderHandleStatus === this.OrderHandlerStatus.handling ||
      //     this.Order.orderHandleStatus === this.OrderHandlerStatus.success ||
      //     this.Order.orderHandleStatus === this.OrderHandlerStatus.fail) {
      //   this.orderSetp = 3
      // }

      // // 订单确认流程
      // switch (this.Order.confirmStatus) {
      //   case this.OrderConfirmStatusEnum.CONFIRMSSUCCESS:
      //     this.orderConfirmSetpStatus = 'success'
      //     break
      //   case this.OrderConfirmStatusEnum.CONFIRMFAIL:
      //     this.orderConfirmSetpStatus = 'error'
      //     break
      //   case this.OrderConfirmStatusEnum.WAITCONFIRM:
      //     this.orderConfirmSetpStatus = 'process'
      //     break
      // }

      // // 支付单流程
      // if (this.Order.orderStatus >= this.OrderStatusEnum.WaitConfirm) {
      //   this.orderSetp = 2
      //   if (this.Order.paymentOrder) {
      //     this.paymentOrders.push(this.Order.paymentOrder)
      //   }
      // }
      // if (!this.Order.paymentOrder) {
      //   this.Order.paymentOrder = {}
      // }

      // // 退款流程
      // if (!this.Order.refundApplyOrder) {
      //   this.Order.refundApplyOrder = {}
      // }
      // if (this.Order.refundStatus !== this.OrderRefundStatusEnum.ORIGINAL) {
      //   this.orderSetp = 3
      //   this.refundSetp = 2
      // }
      // if (this.Order.refundStatus === this.OrderRefundStatusEnum.PROCESSING) {
      //   if (this.Order.confirmStatus !== this.OrderConfirmStatusEnum.WAITCONFIRM) {
      //     this.orderSetp = 4
      //   }
      //   this.refundSetp = 3
      // }
      // if (this.Order.refundStatus === this.OrderRefundStatusEnum.COMPLETE) {
      //   if (this.Order.confirmStatus !== this.OrderConfirmStatusEnum.WAITCONFIRM) {
      //     this.orderSetp = 5
      //   } else {
      //     this.orderSetp = 4
      //   }

      //   this.refundSetp = 4
      // }
      // if (this.Order.refundApplyOrder.refundStatus === this.RefundApplyOrderStatusEnum.CLOSE) {
      //   this.refundSetp = 4
      // }
    },
    fetchOrderLog() {
      const orderNo = this.Order.orderNo
      GetOrderLogs(orderNo).then(res => {
        this.orderLogs = res.data
      })
    },
    lunchRefund() {
      this.getCanRefundDate()

      this.Refund.orderNo = this.Order.orderNo
      this.Refund.paymentOrderNo = this.Order.paymentOrder.paymentNo
      this.Refund.refundType = this.RefundTypeEnum.ORIGINAL
      this.Refund.refundAmount = this.Order.orderAmount

      this.refundRequestVisiable = true
    },
    getCanRefundDate() {
      this.canRefundDates = []

      // 如果只有一天
      const today = moment(moment().format('YYYY-MM-DD'))
      if (this.Order.bookingDays === 1) {
        const checkInDate = moment(moment(this.Order.checkInDate).format('YYYY-MM-DD'))
        if (checkInDate > today) {
          this.canRefundDates.push(today.format('YYYY-MM-DD'))
          return
        }
      }

      for (let dayIndex = 1; dayIndex < this.Order.bookingDays; dayIndex++) {
        const checkInDate = moment(moment(this.Order.checkInDate).format('YYYY-MM-DD'))
        const checkDate = checkInDate.add(dayIndex, 'day')

        if (checkDate > today) {
          this.canRefundDates.push(checkDate.format('YYYY-MM-DD'))
        }
      }
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
      ApplyRefound(param).then(res => {
        if (res.data) {
          this.fetchOrder()

          this.Refund = {}
          this.refundFormVisiable = false
          this.$message({
            type: 'success',
            message: '退款申请成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: '退款申请失败'
          })
        }
      })
    },
    confirmOrder() {
      this.$confirm('是否要确认订单?', '提示', {
        confirmButtonText: '已确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const orderNo = this.Order.orderNo
        ConfirmOrder(orderNo).then(res => {
          if (res.data) {
            this.fetchOrder()
            this.$message({
              message: '订单确认成功',
              type: 'success'
            })
          } else {
            this.$message.error('订单确认失败')
          }
        })
      }).catch(() => {})
    },
    rejectOrder() {
      this.$confirm('确定要拒单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const orderNo = this.Order.orderNo
        RejectOrder(orderNo).then(res => {
          if (res.data) {
            this.fetchOrder()
            this.$message({
              message: '拒单成功',
              type: 'success'
            })
          } else {
            this.$message.error('拒单失败')
          }
        })
      }).catch(() => {})
    },
    dateTimeToDate(val) {
      return moment(val).format('YYYY-MM-DD')
    },
    lunchPurchase() {
      this.$confirm('确定要手动采购?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        PurchaseRequest(this.Order.orderNo).then(res => {
          if (res.data) {
            this.purchaseFormVisiable = true
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        })
      }).catch(() => {})
    },
    submitPurchase() {
      var data = { ...this.PurchaseOrder,
        orderNo: this.Order.orderNo
      }
      Purchase(data).then(res => {
        if (res.data) {
          this.purchaseFormVisiable = false
          this.PurchaseOrder = {}
          this.fetchOrder()
          this.$message({
            message: '订单采购成功',
            type: 'info'
          })
        } else {
          this.$message.error('订单确认失败')
        }
      })
    },
    rePurchase() {
      this.$confirm('确定要系统重新采购?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        PurchaseOrderFromPlatform(this.Order.orderNo).then(res => {
          this.fetchOrder()
          this.$message({
            type: 'info',
            message: '提交成功，系统正在重新采购'
          })
        })
      }).catch(() => {})
    },
    purchaseFail() {
      PurchaseFail(this.Order.purchaseOrder.purchaseOrderNo).then(res => {
        if (res.data) {
          this.fetchOrder()
          this.$message({
            message: '订单采购状态设置成功',
            type: 'info'
          })
        } else {
          this.$message.error('订单采购状态设置失败')
        }
      })
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
	::v-deep .el-table th.el-table__cell{
  background-color: #fff ;
}
</style>
