<template>
  <div v-show="Order.orderStatus" class="content">
    <el-col :xl="4" :lg="2"><br></el-col>
    <el-col  :xl="16" :lg="20">
      <el-card class="info" shadow="never">
        <div slot="header" class="info-header">
          <svg-icon icon-class="dingdan_1" />
          <span type="primary" class="titlecss">订单信息</span>
        </div>

        <el-row>
          <el-col :span="5">
            <el-row>
              <el-col :span="10" class="right-align">
                <span class="orderinfo">订单号：</span>
              </el-col>
              <el-col :span="14" class="left-align">{{ Order.orderNo }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="10" class="right-align">
                  <span class="orderinfo">订单金额：</span>
              </el-col>
              <el-col :span="14" class="left-align">
                <el-popover
                  width="350"
                  :fit="true"
                  placement="bottom"
                  title="价格日历"
                  trigger="hover"
                >
                  <el-table :data="Order.orderPriceCalendars">
                    <el-table-column label="日期" :width="140" header-align="center">
                      <template slot-scope="scope">
                        {{ scope.row.date | dateToStr }}
                      </template>
                    </el-table-column>
                    <el-table-column label="价格" :width="140" header-align="center">
                      <template slot-scope="scope">
                        ￥{{ scope.row.price }}
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-link slot="reference" :underline="false" style="border-bottom:1px dashed #ccc;">{{ Order.orderAmount }}</el-link>
                </el-popover>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" class="right-align">
                  <span class="orderinfo">订单状态：</span>
              </el-col>
              <el-col :span="14" class="left-align">{{ Order.orderStatusDesc }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="10" class="right-align">
                  <span class="orderinfo">下单时间：</span>
              </el-col>
              <el-col :span="14" class="left-align">{{ Order.orderDate }}</el-col>
            </el-row>
            <el-row>
							<el-col :span="12" class="right-align">
								<span class="orderinfo"> 订单总间/夜</span>
							</el-col>
							<el-col :span="12" class="left-align">{{  Order.bookingDaysShow }}</el-col>
						</el-row>
          </el-col>

          <el-col :span="18">
            <el-steps v-if="Order.orderStatus !== OrderStatusEnum.CANCEL" :active="orderSetp" :space="300" finish-status="finish" align-center style="margin-bottom:30px">
              <el-step title="下单" icon="el-icon-user-solid" :description="Order.orderDate" />
              <el-step :title="Order.paymentStatusDesc" icon="el-icon-bank-card" :description="Order.payTime" />
              <el-step v-if="Order.orderStatus !== OrderStatusEnum.CANCEL" :title="getOrderBookingStatus(Order)" icon="el-icon-shopping-cart-2" :description="Order.reserveingTime" />
              <!-- <el-step v-if="Order.orderStatus !== OrderStatusEnum.CANCEL && Order.orderStatus !== OrderStatusEnum.RESERVEFAIL" title="已确认" icon="el-icon-shopping-cart-full" :description="Order.confirmTime" /> -->
              <el-step v-if="Order.orderStatus !== OrderStatusEnum.CANCEL && Order.orderStatus !== OrderStatusEnum.RESERVEFAIL && Order.orderStatus !== OrderStatusEnum.WAITIN_REFUND" title="消费" icon="el-icon-office-building" :description="Order.consumeTime" />
              <el-step v-if="Order.orderStatus === OrderStatusEnum.WAITIN_REFUND || Order.orderStatus === OrderStatusEnum.RESERVEFAIL" :title="getOrderRefundStatus(Order)" icon="el-icon-wallet" :description="Order.refundTime" />
              <!-- <el-step v-if="Order.orderStatus === OrderStatusEnum.CANCEL" title="取消" icon="el-icon-s-promotion" :description="Order.cancelTime" />
          <el-step v-if="Order.orderStatus === OrderStatusEnum.CANCEL" :title="getOrderRefundStatus(Order)" icon="el-icon-wallet" :description="Order.refundTime" /> -->
            </el-steps>
            <el-steps v-else :active="orderSetp" :space="300" finish-status="finish" align-center style="margin-bottom:30px">
              <el-step title="下单" icon="el-icon-user-solid" :description="Order.orderDate" />
              <el-step :title="Order.paymentStatusDesc" icon="el-icon-bank-card" :description="Order.payTime" />
              <el-step v-if="Order.orderStatus === OrderStatusEnum.CANCEL" title="取消" icon="el-icon-s-promotion" :description="Order.cancelTime" />
              <el-step v-if="Order.orderStatus === OrderStatusEnum.CANCEL && Order.paymentStatus === OrderPaymentStatusEnum.PAYSUCCESS" :title="getOrderRefundStatus(Order)" icon="el-icon-wallet" :description="Order.refundTime" />
            </el-steps>
          </el-col>
        </el-row>
      </el-card>
      <!-- <el-row>
          <el-col :xl="2" :sm="4" class="right-align">
            <el-link :underline="false">开票方：</el-link>
          </el-col>
          <el-col :xl="2" :sm="6">
            <el-link :underline="false">{{ Order.invoiceDrawerDesc }}</el-link>
          </el-col>
        </el-row> -->

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
      <!-- <el-row class="order-setp">
              <el-steps v-if="Order.orderStatus" :space="200" :active="orderSetp" finish-status="success">
                <el-step title="下单" :description="Order.orderDate" />
                <el-step title="支付" :description="Order.paymentOrder.paymentTime" :status="orderPaymentSetpStatus" />
                <el-step v-if="Order.orderStatus===OrderStatusEnum.Cancel" title="取消" :status="orderCancelSetpStatus" />
                <el-step v-if="Order.refundStatus===OrderRefundStatusEnum.ORIGINAL" title="确认" :status="orderConfirmSetpStatus" :description="Order.confirmTime" />
                <el-step v-if="Order.refundStatus!==OrderRefundStatusEnum.ORIGINAL" title="售后/退款中" :description="Order.refundApplyOrder.auditTime" />
                <el-step v-if="Order.refundStatus===OrderRefundStatusEnum.ORIGINAL" title="入住" :status="orderComplateSetpStatus" />
                <el-step title="完成" :status="orderComplateSetpStatus" />
              </el-steps>
            </el-row> -->

      <!-- <el-col :span="12">
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
              <el-row>
                <el-col :xl="4" :sm="8" class="right-align">
                  <el-link :underline="false">采购状态：</el-link>
                </el-col>
                <el-col :xl="8" :sm="16">
                  <el-link :underline="false">{{ Order.orderStatusDesc }}</el-link>
                </el-col>
              </el-row>
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
    </el-row> -->
      <!-- <el-row>
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
    </el-row> -->
      <el-card class="info" shadow="never">
        <div slot="header" class="info-header">
          <svg-icon icon-class="ruzhu" />
          <span class="titlecss">入住信息</span>
        </div>

        <el-col :span="24">
          <el-table :data="checkInOrders">
            <el-table-column label="酒店名" min-width="15%">
              <template slot-scope="scope">
                {{ scope.row.hotelName }}
                <!-- <br> -->
                <!-- 【{{ scope.row.city }}】 -->
              </template>
            </el-table-column>
            <!-- <el-table-column prop="city" label="城市" min-width="5%" /> -->
            <el-table-column prop="hotelAddress" label="酒店地址" min-width="15%">
              <template slot-scope="scope">
                <div style="text-align:center">
                  {{ scope.row.city }}
                  {{ scope.row.hotelAddress }}
                  <br>
                  【{{ scope.row.hotelPhone }}】
                </div>
              </template>
            </el-table-column>
            <el-table-column label="房型名称" min-width="15%">
              <template slot-scope="scope">
                <div style="text-align:center">
                  {{ scope.row.roomTypeName }}
                  <br>
                  【{{ scope.row.bedTypeName }}/{{ scope.row.windowDesc }}/{{ scope.row.breakFastDesc }}】
                </div>
              </template>
            </el-table-column>
            <el-table-column label="间/夜" width="100" min-width="10%">
              <template slot-scope="scope">{{ scope.row.bookingDaysPersonShow }}</template>
            </el-table-column>
            <!-- <el-table-column label="早餐" width="100">
          <template slot-scope="scope">
            <el-link :underline="false" type="info">{{ scope.row.breakFastNum }} 份</el-link>
          </template>
            </el-table-column>-->
            <el-table-column label="入离日期" min-width="10%">
              <template slot-scope="scope">
                {{ dateTimeToDate(scope.row.checkInDate) }}/
                <br>
                {{ dateTimeToDate(scope.row.checkOutDate) }}
              </template>
            </el-table-column>
            <el-table-column prop="checkInName" label="入住人" min-width="10%" />
            <el-table-column prop="checkInPhone" label="入住人电话" min-width="10%" />
            <el-table-column prop="arrivalTime" label="预计到店" min-width="9%" />
          </el-table>
        </el-col>
      </el-card>
      <el-card class="info" shadow="never">
        <div slot="header" class="info-header">
          <svg-icon icon-class="zhifufangshi" />
          <span class="titlecss">
            支付信息
          </span>
        </div>
        <el-table :data="paymentOrders">
          <el-table-column prop="paymentNo" label="支付单号" />
          <el-table-column prop="paymentAmount" label="支付金额" />
          <el-table-column prop="paymentTypeDesc" label="支付方式" />
          <el-table-column prop="paymentStatusDesc" label="支付状态" />
          <el-table-column prop="paymentOrderDate" label="支付时间" />
        </el-table>
      </el-card>
<!--      <el-card class="info" shadow="never">
        <div slot="header" class="info-header">
          <svg-icon icon-class="lianxishouhou" />
          <span class="titlecss">售后信息</span>
        </div>
        <el-table :data="afterSaleApplies">
          <el-table-column prop="afterSaleNo" label="售后单号" min-width="8%"/>
          <el-table-column prop="typeDesc" label="售后类型" min-width="8%"/>
          <el-table-column prop="reasonDesc" label="售后原因" min-width="8%"/>
          <el-table-column prop="desc" label="情况说明" min-width="8%">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                trigger="hover"
                width="450"
                :content="scope.row.desc"
              >
                <el-link slot="reference">{{ scope.row.desc?scope.row.desc.length <= 10?scope.row.desc:scope.row.desc.substring(0,10)+'...':'' }}</el-link>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="statusDesc" label="处理状态" min-width="8%"/>
          <el-table-column prop="applyTime" label="申请时间" min-width="8%"/>
        </el-table>
      </el-card> -->
      <el-card v-if="refundApplyOrders && refundApplyOrders.length>0" class="info" shadow="never">
        <div slot="header" class="info-header">
          <svg-icon icon-class="tuikuan" />
          <span class="titlecss">退款信息</span>
        </div>
        <el-table :data="refundApplyOrders">
          <el-table-column prop="refundNo" label="退款单号" min-width="8%"/>
          <el-table-column prop="refundAmount" label="退款金额" min-width="8%"/>
          <el-table-column prop="refundWayDesc" label="退款方式" min-width="8%"/>
          <!-- <el-table-column prop="refundReasonDesc" label="退款原因" /> -->
          <el-table-column prop="refundTypeDesc" label="退款类型" min-width="8%"/>
          <!-- <el-table-column prop="refundDesc" label="问题描述" /> -->
          <el-table-column prop="refundStatusDesc" label="退款状态" min-width="8%"/>
          <!-- <el-table-column prop="auditUserName" label="审核人" />
          <el-table-column prop="modifierDesc" label="操作人" /> -->
          <el-table-column prop="applyTime" label="申请时间" min-width="8%"/>
          <el-table-column prop="refundTime" label="退款时间" min-width="8%"/>
        </el-table>
      </el-card>
      <!-- <el-card class="info">
      <div slot="header">
        <span>订单日志</span>
      </div>
      <el-table :data="orderLogs">
        <el-table-column prop="operTime" label="操作时间" />
        <el-table-column prop="userName" label="操作人" />
        <el-table-column prop="operContent" label="操作内容" />
      </el-table>
    </el-card> -->
      <el-dialog :visible.sync="purchaseFormVisiable" label-position="right" :inline="true" :close-on-click-modal="true">
        <div slot="title">
          <span>采购订单</span>
        </div>
        <div class="purchase-order-info">
          <el-row>
            <el-col :span="3">
              <el-link :underline="false">采购单号：</el-link>
            </el-col>
            <el-col :span="4">
              <el-link :underline="false">{{ PurchaseOrder.purchaseNo }}</el-link>
            </el-col>
            <el-col :span="3">
              <el-link :underline="false">采购平台单号：</el-link>
            </el-col>
            <el-col :span="4">
              <el-link :underline="false">{{ PurchaseOrder.platformOrderNo }}</el-link>
            </el-col>
            <el-col :span="3">
              <el-link :underline="false">采购状态：</el-link>
            </el-col>
            <el-col :span="4">
              <el-link :underline="false">{{ PurchaseOrder.purchaseStatusDesc }}</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <el-link :underline="false">采购平台：</el-link>
            </el-col>
            <el-col :span="4">
              <el-link :underline="false">{{ PurchaseOrder.platformId }}</el-link>
            </el-col>
            <el-col :span="3">
              <el-link :underline="false">采购账号：</el-link>
            </el-col>
            <el-col :span="4">
              <el-link :underline="false">{{ PurchaseOrder.account }}</el-link>
            </el-col>
            <el-col :span="3">
              <el-link :underline="false">采购状态：</el-link>
            </el-col>
            <el-col :span="4">
              <el-link :underline="false">{{ PurchaseOrder.purchaseStatusDesc }}</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <el-link :underline="false">采购金额：</el-link>
            </el-col>
            <el-col :span="4">
              <el-link :underline="false">{{ PurchaseOrder.purchasePrice }}</el-link>
            </el-col>
            <el-col :span="3">
              <el-link :underline="false">采购支付：</el-link>
            </el-col>
            <el-col :span="4">
              <el-link :underline="false" />
            </el-col>
          </el-row>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="refundFormVisiable" label-position="right" :inline="true">
        <div slot="title">
          <span>退款申请</span>
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
                <el-link :underline="false">{{ paymentOrder.paymentNo }}</el-link>
              </el-col>
              <el-col :offset="1" :span="3">支付状态：</el-col>
              <el-col :span="3">
                <el-link :underline="false">{{ paymentOrder.paymentStatusDesc }}</el-link>
              </el-col>
              <el-col :offset="1" :span="3">支付时间：</el-col>
              <el-col :span="4">
                <el-link :underline="false">{{ paymentOrder.paymentTime }}</el-link>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">支付方式：</el-col>
              <el-col :span="3">
                <el-link :underline="false">{{ paymentOrder.paymentTypeDesc }}</el-link>
              </el-col>
              <el-col :offset="1" :span="3">支付金额：</el-col>
              <el-col :span="3">
                <el-link :underline="false">{{ paymentOrder.paymentAmount }}</el-link>
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
                <el-input v-model="refundApplyOrder.refundAmount">
                  <template slot="prepend">￥</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="退款原因">
              <el-select v-model="refundApplyOrder.refundReason">
                <el-option v-for="reason in RefundReason" :key="reason.value" :label="reason.text" :value="reason.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="退款方式">
              <el-select v-model="refundApplyOrder.refundType">
                <el-option :key="0" label="原路返回" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="原因描述">
              <el-col :span="12">
                <el-input v-model="refundApplyOrder.refundDesc" type="textarea" :rows="2" placeholder="请输入退款描述" />
              </el-col>
            </el-form-item>
          </el-form>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button @click="refundFormVisiable=false">取 消</el-button>
          <el-button type="primary" @click="submitRefund()">提交申请</el-button>
        </span>
      </el-dialog>
    </el-col>
  </div>
</template>

<script>
import {
  GetOrder,
  GetOrderLogs
} from '@/api/order/order'
import moment from 'moment'
import {
  mapGetters
} from 'vuex'
export default {
  filters: {
    dateToStr(date) {
      return moment(date).format('YYYY-MM-DD')
    }
  },
  data() {
    return {
      Order: {},
      PurchaseOrder: {},
      checkInOrders: [],
      paymentOrders: [],
      purchaseOrders: [],
      afterSaleApplies: [],
      afterSaleRecords: [],
      refundApplyOrders: [],
      paymentOrder: {},
      refundApplyOrder: {},
      orderLogs: [],
      orderLogs1: [],
      purchaseFormVisiable: false,
      refundFormVisiable: false,
      orderSetp: 1,
      OrderRefundStatusEnum: {
        ORIGINAL: 0,
        SUBMIT: 2,
        PROCESSING: 4,
        COMPLETE: 6
      },
      RefundApplyOrderStatusEnum: {
        WAITAUDIT: 0,
        REJECT: 2,
        WAITREFUND: 4,
        REFUNDING: 5,
        REFUNDSUCCESS: 6,
        REFUNDFAIL: 7,
        CLOSE: -1
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
      PaymentOrderStatus: {
        PAYSUCCESS: 2
      },
      refundApplyOrderStatus: {
        WAITAUDIT: 0,
        REJECT: 2,
        WAITREFUND: 4,
        REFUNDING: 5,
        REFUNDSUCCESS: 6,
        REFUNDFAIL: 7,
        CLOSE: -1
      },
      OrderStatusEnum: {
        WAITPAY: 5,
        RESERVEING: 15,
        WAITCONFIRM: 20,
        RESERVESUCCESS: 25,
        RESERVEFAIL: 30,
        WAITIN: 35,
        WAITIN_REFUND: 40,
        CANCEL: -1
      },
      RefundApplyOrderAuditStatus: {
        ORIGINAL: 0,
        PASS: 1,
        REJECT: 2
      },
      AfterSaleType: {
        REFUND: 5
      },
      LockEnum: {
        NoLock: 0,
        Lock: 1
      },
      RefundReason: [{
        value: 5,
        text: '平台'
      },
      {
        value: -5,
        text: '酒店'
      },
      {
        value: 1,
        text: '其它'
      }
      ]
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
        this.fetchOrderLog()
      }
    },
    getUrlParams() {
      const query = this.$route.params
      if (!query || !query.orderNo) {
        this.$alert('请返回重试', '订单查询失败', {
          confirmButtonText: '确定',
          type: 'error',
          callback: action => {
            this.$router.push({
              path: '/allorder/list'
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
      this.purchaseOrders = []

      const loading = this.$loading({
        lock: true,
        text: '正在加载订单',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      GetOrder(this.Order.orderNo).then(res => {
        this.Order = res.data

        // 入住人
        var checkInName = this.Order.checkInName.split(',')
        for (var i = 1; i <= checkInName.length; i++) {
          const checkInOrder = { ...this.Order
          }
          checkInOrder.roomCount = 1
          checkInOrder.checkInName = checkInName[i - 1]
          this.checkInOrders.push(checkInOrder)
        }

        // 支付单
        this.paymentOrders = this.Order.paymentOrders
        if (this.paymentOrders.some(x => x.paymentStatus === this.PaymentOrderStatus.PAYSUCCESS)) {
          this.paymentOrder = this.paymentOrders.find(x => x.paymentStatus === this.PaymentOrderStatus.PAYSUCCESS)
        } else {
          this.paymentOrder = {}
        }

        // 采购单
        this.purchaseOrders = this.Order.purchaseOrders

        // 售后单
        this.afterSaleApplies = this.Order.afterSaleApplies
        if (this.Order.afterSaleApplies && this.Order.afterSaleApplies.length > 0) {
          this.afterSaleRecords = this.afterSaleApplies[0].afterSaleRecords
        }

        // 退款单
        this.refundApplyOrders = this.Order.refundApplyOrders
        if (this.Order.refundApplyOrders && this.Order.refundApplyOrders.length > 0) {
          if (this.Order.refundApplyOrders[0].refundStatus === this.refundApplyOrderStatus.REJECT) {
            this.Order.refundApplyOrders[0].refundStatusDesc = '退款失败'
          }
        }

        // if (this.Order.paymentStatus !== this.OrderPaymentStatusEnum.PAYSUCCESS) {
        //   if (this.paymentOrders && this.paymentOrders.length > 0) {
        //     let time = this.paymentOrders[this.paymentOrders.length - 1].modifyTime
        //     if (!time) {
        //       time = this.paymentOrders[this.paymentOrders.length - 1].createTime
        //     }
        //     this.Order.payTime = time
        //   } else {
        //     this.Order.payTime = this.Order.modifyTime
        //   }
        // }

        switch (this.Order.orderStatus) {
          case this.OrderStatusEnum.WAITPAY:
            this.orderSetp = 1
            break
          case this.OrderStatusEnum.RESERVEING:
            this.orderSetp = 3
            break
          case this.OrderStatusEnum.WAITCONFIRM:
            this.orderSetp = 3
            break
          case this.OrderStatusEnum.RESERVESUCCESS:
            this.orderSetp = 3
            break
          case this.OrderStatusEnum.RESERVEFAIL:
            this.orderSetp = 3
            // 是否退款
            switch (this.Order.refundStatus) {
              case this.refundApplyOrderStatus.REFUNDSUCCESS:
              case this.refundApplyOrderStatus.REFUNDFAIL:

                this.orderSetp = 4
                break
              case this.refundApplyOrderStatus.REJECT:
                this.Order.refundTime = this.refundApplyOrders[0].auditTime
                this.orderSetp = 4
                break
            }
            break
          case this.OrderStatusEnum.WAITIN:
            this.orderSetp = 4
            break
          case this.OrderStatusEnum.WAITIN_REFUND:
            this.orderSetp = 4
            break
          case this.OrderStatusEnum.CANCEL:
            this.orderSetp = 3
            // 是否退款
            switch (this.Order.refundStatus) {
              case this.refundApplyOrderStatus.REFUNDSUCCESS:
              case this.refundApplyOrderStatus.REFUNDFAIL:

                this.orderSetp = 4
                break
              case this.refundApplyOrderStatus.REJECT:
                this.Order.refundTime = this.refundApplyOrders[0].auditTime
                this.orderSetp = 4
                break
            }
            break
        }

        loading.close()
      })
    },
    getOrderBookingStatus(order) {
      let bookingStatus = ''
      if (order.confirmTime) {
        bookingStatus = '预订成功'
      } else {
        switch (order.orderStatus) {
          case this.OrderStatusEnum.RESERVESUCCESS:
            bookingStatus = '预订成功'
            break
          case this.OrderStatusEnum.RESERVEFAIL:
            bookingStatus = '预订失败'
            break
          default:
            bookingStatus = '预订中'
            break
        }
      }
      return bookingStatus
    },
    getOrderRefundStatus(order) {
      let refundStatus = ''
      if (order.orderStatus === this.OrderStatusEnum.WAITIN_REFUND) {
        refundStatus = '已消费退款'
      } else {
        switch (order.refundStatus) {
          case this.refundApplyOrderStatus.REFUNDSUCCESS:
            refundStatus = '退款成功'
            break
          case this.refundApplyOrderStatus.REJECT:
            refundStatus = '退款失败'
            break
          default:
            refundStatus = '退款中'
            break
        }
      }
      return refundStatus
    },
    fetchOrderLog() {
      const orderNo = this.Order.orderNo
      GetOrderLogs(orderNo).then(res => {
        // 总数据
        // this.orderLogs = res.data
        // 遍历总数据
        for (var i = 0; i < res.data.length; i++) {
          // 类型===20  ===10
          if (res.data[i].operUserType === 20 || res.data[i].operUserType === 10) {
            this.orderLogs.push(res.data[i])
            // console.log(res.data,this.orderLogs);
          }
        }
      })
    },
    refundApply() {
      this.refundFormVisiable = true
    },
    purchaseOrderDetail(purchaseOrder) {
      this.PurchaseOrder = purchaseOrder

      this.purchaseFormVisiable = true
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

::v-deep .el-card__header {
  padding: 0;
  border-bottom: none;
}
::v-deep .el-table th {
    background: #ffffff;
    opacity: 1;
}
.el-divider {
  background-color: #ffffff;
  margin: 0;
}
.info-header {
  font-size: 20px;
  line-height: 60px;
  padding-left: 10px;
  margin-left: 0;
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
  padding-right: 10px;
  text-align: right;
  line-height: 20px;
}
.left-align{
    line-height: 20px;
    float: left;
    font-size: 13px;
    color: #606266;
    font-family: '微软雅黑';
}
.el-card__body {
  padding: 0 20px 0 20px;
}
.orderinfo{
  font-weight: 600;
  font-size: 13px;
  color: #606266;
  font-family: '微软雅黑';
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

.purchase-order-info {
  line-height: 30px;
}

.ml5 {
  margin-left: 5px;
}
.titlecss {
  padding-left: 5px;
  color: #006699;
  opacity: 0.7;
  filter: alpha(opacity=70);
  font-weight: 600;
}
.www {
  height: 10px;
}
::v-deep .el-table th > .cell {
  color: #606266;
  text-align: center;
}
::v-deep .el-table__body td {
  text-align: center;
}
::v-deep .el-table th{
  border-right:0
}
	::v-deep .el-table th.el-table__cell{
  background-color: #fff ;
}
</style>
<style>
.app-main {
  background: #f9f9f9;
}
</style>
