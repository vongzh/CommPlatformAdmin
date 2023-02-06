<template>
  <div v-show="Order.orderStatus" class="content">
    <el-col :xl="4" :lg="2">
      <br />
    </el-col>
    <el-col :xl="16" :lg="20">
      <el-card class="info" shadow="never">
        <div slot="header" class="info-header">
          <svg-icon icon-class="dingdan_1" />
          <span type="primary" class="titlecss">订单信息</span>
        </div>

        <el-row>
          <el-col :span="8">
            <el-row>
              <el-col :span="12" class="right-align">
                <span class="orderinfo">订单号：</span>
              </el-col>
              <el-col :span="12" class="left-align">{{ Order.orderNo }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="12" class="right-align">
                <span class="orderinfo">第三方订单号：</span>
              </el-col>
              <el-col :span="12" class="left-align">{{ Order.thirdOrderNo }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="12" class="right-align">
                <span class="orderinfo">订单金额：</span>
              </el-col>
              <el-col :span="12" class="left-align">
                <el-popover width="350" :fit="true" placement="bottom" title="价格日历" trigger="hover">
                  <el-table :data="Order.orderPriceCalendars">
                    <el-table-column label="日期" :width="140" header-align="center">
                      <template slot-scope="scope">{{ scope.row.date | dateToStr }}</template>
                    </el-table-column>
                    <el-table-column label="价格" :width="140" header-align="center">
                      <template slot-scope="scope">￥{{ scope.row.price }}</template>
                    </el-table-column>
                  </el-table>
                  <el-link
                    slot="reference"
                    :underline="false"
                    style="border-bottom:1px dashed #ccc;color: #b40000;"
                  >{{ Order.orderAmount }}/{{this.orderAmount1}}
                  	<span  v-if="Order.userPaymentAmount">/{{ Order.userPaymentAmount }}</span>
                  </el-link>
                </el-popover>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" class="right-align">
                <span class="orderinfo">订单状态：</span>
              </el-col>
              <el-col :span="12" class="left-align">{{ Order.orderStatusDesc }}
                <span v-if="Order.rejectionStatusDesc">({{Order.rejectionStatusDesc}}) </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" class="right-align">
                <span class="orderinfo">下单时间：</span>
              </el-col>
              <el-col :span="12" class="left-align">{{ Order.orderDate }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="12" class="right-align">
                <span class="orderinfo">订单总间/夜</span>
              </el-col>
              <el-col :span="12" class="left-align">{{ Order.bookingDaysShow }}</el-col>
            </el-row>
          </el-col>

          <el-col :span="16">
            <el-steps
              v-if="Order.orderStatus !== OrderStatusEnum.CANCEL"
              :active="orderSetp"
              :space="300"
              finish-status="finish"
              align-center
              style="margin-bottom:30px"
            >
              <el-step title="下单" icon="el-icon-user-solid" :description="Order.orderDate" />
              <el-step
                :title="Order.paymentStatusDesc"
                icon="el-icon-bank-card"
                :description="Order.payTime"
              />
              <el-step
                v-if="Order.orderStatus !== OrderStatusEnum.CANCEL"
                :title="getOrderBookingStatus(Order)"
                icon="el-icon-shopping-cart-2"
                :description="Order.reserveingTime"
              />
              <!-- <el-step v-if="Order.orderStatus !== OrderStatusEnum.CANCEL && Order.orderStatus !== OrderStatusEnum.RESERVEFAIL" title="已确认" icon="el-icon-shopping-cart-full" :description="Order.confirmTime" /> -->
              <el-step
                v-if="Order.orderStatus !== OrderStatusEnum.CANCEL && Order.orderStatus !== OrderStatusEnum.RESERVEFAIL && Order.orderStatus !== OrderStatusEnum.WAITIN_REFUND"
                title="消费"
                icon="el-icon-office-building"
                :description="Order.consumeTime"
              />
              <el-step
                v-if="Order.orderStatus === OrderStatusEnum.WAITIN_REFUND || Order.orderStatus === OrderStatusEnum.RESERVEFAIL"
                :title="getOrderRefundStatus(Order)"
                icon="el-icon-wallet"
                :description="Order.refundTime"
              />
              <!-- <el-step v-if="Order.orderStatus === OrderStatusEnum.CANCEL" title="取消" icon="el-icon-s-promotion" :description="Order.cancelTime" />
              <el-step v-if="Order.orderStatus === OrderStatusEnum.CANCEL" :title="getOrderRefundStatus(Order)" icon="el-icon-wallet" :description="Order.refundTime" />-->
            </el-steps>
            <el-steps
              v-else
              :active="orderSetp"
              :space="300"
              finish-status="finish"
              align-center
              style="margin-bottom:30px"
            >
              <el-step title="下单" icon="el-icon-user-solid" :description="Order.orderDate" />
              <el-step
                :title="Order.paymentStatusDesc"
                icon="el-icon-bank-card"
                :description="Order.payTime"
              />
              <el-step
                v-if="Order.orderStatus === OrderStatusEnum.CANCEL"
                title="取消"
                icon="el-icon-s-promotion"
                :description="Order.cancelTime"
              />
              <el-step
                v-if="Order.orderStatus === OrderStatusEnum.CANCEL && Order.paymentStatus === OrderPaymentStatusEnum.PAYSUCCESS"
                :title="getOrderRefundStatus(Order)"
                icon="el-icon-wallet"
                :description="Order.refundTime"
              />
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
      </el-row>-->

      <!-- <el-row class="order-setp">
              <el-steps :space="200" :active="orderSetp" finish-status="success">
                <el-step title="下单" :description="Order.orderDate" />
                <el-step title="支付" :description="Order.paymentOrder.paymentTime" />
                <el-step title="确认" :status="orderConfirmSetpStatus" :description="Order.confirmTime" />
                <el-step v-if="Order.refundStatus!=OrderRefundStatusEnum.ORIGINAL" title="售后/退款中" :description="Order.refundApplyOrder.auditTime" />
                <el-step v-if="Order.refundStatus===OrderRefundStatusEnum.ORIGINAL" title="入住" />
                <el-step title="完成" />
              </el-steps>
      </el-row>-->
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
      </el-row>-->

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
      </el-row>-->
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
      </el-row>-->
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
                  <br />
                  【{{ scope.row.hotelPhone }}】
                </div>
              </template>
            </el-table-column>
            <el-table-column label="房型名称" min-width="15%">
              <template slot-scope="scope">
                <div style="text-align:center;color: #b40000;">
                  {{ scope.row.roomTypeName }}
                  <br />
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
                <br />
                {{ dateTimeToDate(scope.row.checkOutDate) }}
              </template>
            </el-table-column>
            <el-table-column prop="checkInName" label="入住人" min-width="10%">
              <template slot-scope="scope">
                <div style="text-align:center;color: #b40000;">{{ scope.row.checkInName }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="checkInPhone" label="入住人电话" min-width="10%" />
            <el-table-column prop="arrivalTime" label="预计到店" min-width="9%" />
          </el-table>
        </el-col>
      </el-card>

      <el-card class="info" shadow="never">
        <div slot="header" class="info-header">
          <svg-icon icon-class="zhifufangshi" />
          <span class="titlecss">支付信息</span>
        </div>
        <el-col :span="24">
          <el-table :data="paymentOrders">
            <el-table-column prop="paymentNo" label="支付单号" />
            <el-table-column prop="paymentAmount" label="支付金额">
              <template slot-scope="scope">
                <div style="text-align:center;color: #b40000;">{{ scope.row.paymentAmount }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="paymentTypeDesc" label="支付方式" />
            <el-table-column prop="paymentStatusDesc" label="支付状态" />
            <el-table-column prop="paymentOrderDate" label="支付时间" />
          </el-table>
        </el-col>
      </el-card>

      <el-card
        v-if="purchaseOrders && purchaseOrders.length >0"
        class="info"
        :span="10"
        shadow="never"
      >
        <div slot="header" class="info-header">
          <svg-icon icon-class="gouwuchezhengpin" />
          <span class="titlecss">采购信息</span>
        </div>
        <el-col :span="24">
          <el-table :data="purchaseOrders">
            <el-table-column prop="purchaseNo" label="采购单号" min-width="6%">
              <template slot-scope="scope">
                <el-link
                  style="border-bottom:1px dashed #ccc"
                  @click="purchaseOrderDetail(scope.row)"
                >{{ scope.row.purchaseNo }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="platformOrderNo" label="采购平台单号" min-width="6%" />
            <el-table-column prop="platform" label="采购平台" min-width="6%" />
            <!-- <el-table-column prop="account" label="采购账号信息">
          <template
            slot-scope="scope"
          >{{ scope.row.purChaseAccount }}/{{ scope.row.purChaseAccountType }}</template>
            </el-table-column>-->
            <el-table-column prop="purchaseMethodDesc" label="采购方式" min-width="6%" />
            <el-table-column prop="purchasePrice" label="采购金额" min-width="6%" />
            <el-table-column prop="purchaseStatusDesc" label="采购状态" min-width="6%" />
            <el-table-column prop="contactPhone" label="预留手机号" min-width="8%" />
            <el-table-column prop="createrDesc" label="采购人" min-width="6%" />
            <el-table-column prop="orderDate" label="采购时间" min-width="10%" />
            <!-- <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="purchaseOrderDetail(scope.row)">详情</el-button>
              </template>
            </el-table-column>-->
          </el-table>
        </el-col>
      </el-card>

      <el-card v-if="afterSaleApplies && afterSaleApplies.length>0" class="info" shadow="never">
        <div slot="header" class="info-header">
          <!-- <i class="iconfont">&#xe622;</i> -->
          <svg-icon icon-class="lianxishouhou" />
          <span class="titlecss">售后信息</span>
        </div>
        <el-table :data="afterSaleApplies">
          <el-table-column prop="afterSaleNo" label="售后单号" min-width="8%" />
          <el-table-column prop="typeDesc" label="售后类型" min-width="8%">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                width="400"
                trigger="hover"
                :content="scope.row.typeDesc"
              >
                <el-link slot="reference" style="margin-left:3px">{{ scope.row.typeDesc|ellipsis }}</el-link>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="reasonDesc" label="售后原因" min-width="8%">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                width="400"
                trigger="hover"
                :content="scope.row.reasonDesc"
              >
                <el-link
                  slot="reference"
                  style="margin-left:3px"
                >{{ scope.row.reasonDesc|ellipsis }}</el-link>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="情况说明" min-width="8%">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                trigger="hover"
                width="400"
                :content="scope.row.desc"
              >
                <el-link slot="reference">
                  {{ scope.row.desc?scope.row.desc.length <= 10?scope.row.desc:scope.row.desc.substring(0,10)+'...':'' }}
                </el-link>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="statusDesc" label="处理状态" min-width="8%" />
          <el-table-column prop="applyTime" label="申请时间" min-width="10%" />
          <el-table-column label="操作" width="200" min-width="8%" v-if="!Lookdisabled">
            <template slot-scope="scope">
              <!-- v-if="refundApplyOrders.length <= 0" -->
			  <!-- :type="refundApplyOrders.length >= 0?'info':'warning'" -->
              <el-button
                :disabled="refundApplyOrders.length >= 0 && isDisabled"
				:type="refundApplyOrders.length >= 0?'primary':'primary'"
                size="mini"
                @click="refundApply(scope.row.orderNo)"
              >申请退款</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-card v-if="refundApplyOrders && refundApplyOrders.length>0"  size="mini" class="info" shadow="never">
          <!-- <div slot="header" class="info-header">
            <svg-icon icon-class="tuikuan" />
            <span class="titlecss">退款信息</span>
          </div> -->
        <el-collapse value="refundInfo">
        <el-collapse-item name="refundInfo1">
		<span slot="title" class="collapse-title">退款信息</span>
		<div class="filter-container">
          <el-table :data="refundApplyOrders">
            <el-table-column prop="refundNo" label="退款单号" min-width="5%" />
            <el-table-column prop="refundAmount" label="退款金额" min-width="5%" />
            <el-table-column prop="refundTypeDesc" label="退款类型" min-width="5%" />
            <el-table-column prop="refundWayDesc" label="退款方式" min-width="5%" />
            <el-table-column prop="refundReasonDesc" label="退款原因" min-width="5%" />
            <el-table-column prop="refundDesc" label="问题描述" min-width="10%">
              <template slot-scope="scope">
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  :content="scope.row.refundDesc"
                >
                  <el-link
                    slot="reference"
                    style="margin-left:3px"
                  >{{ scope.row.refundDesc|ellipsis }}</el-link>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="退款状态" min-width="6%">
              <template slot-scope="scope">
                <el-popover
                  v-if="scope.row.refundStatus === refundApplyOrderStatus.REJECT"
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  :content="scope.row.auditDesc"
                >
                  <el-link
                    slot="reference"
                    type="warning"
                    style="margin-left:3px"
                  >{{ scope.row.refundStatusDesc }}</el-link>
                </el-popover>
                <el-col v-else>{{ scope.row.refundStatusDesc }}</el-col>
              </template>
            </el-table-column>
            <el-table-column prop="modifierDesc" label="操作人" min-width="6%" />
            <el-table-column prop="auditUserName" label="审核人" min-width="6%" />
            <el-table-column prop="applyTime" label="申请时间" min-width="10%" />
            <el-table-column label="操作" min-width="6%">
              <template slot-scope="scope">
                <el-button
                  v-permission="['RefundTrade']"
                  v-if="scope.row.refundStatus === refundApplyOrderStatus.WAITREFUND"
                  type="danger"
                  size="mini"
                  @click="doRefund(scope.row.refundNo)"
                >退款</el-button>
              </template>
            </el-table-column>
          </el-table>
          </div>
          </el-collapse-item>
         </el-collapse>
        </el-card>
        <el-card size="mini" class="info" shadow="never">
          <el-collapse value="search">
            <el-collapse-item name="search1">
              <span slot="title" class="collapse-title">咨询信息</span>
              <div class="filter-container">
                <div slot="header" class="info-header">
                  <el-button
                    v-if="!Lookdisabled"
                    type="primary"
                    style="margin:0rem"
                    size="mini"
                    @click="addingrecord"
                  >新增记录</el-button>
                </div>
                <el-table :data="afterSaleRecords">
                  <el-table-column prop="fileId" label="录音编号" min-width="8%">
                    <template slot-scope="scope">
                      <el-link :href="scope.row.fileId">{{ scope.row.sessionId }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="callTypeDesc" label="呼叫类型" min-width="8%" />
                  <el-table-column prop="phone" label="来/去电电话" min-width="8%" />
                  <el-table-column prop="sourceDesc" label="电话来源" min-width="8%">
                    <!-- <template slot-scope="scope">{{ scope.sourceDesc?scope.sourceDesc:'未知' }}</template> -->
                  </el-table-column>
                  <el-table-column prop="desc" label="售后跟踪" min-width="8%">
                    <template slot-scope="scope">
                      <el-popover
                        placement="top-start"
                        trigger="hover"
                        width="450"
                        :content="scope.row.desc"
                      >
                        <el-link slot="reference">
                          {{ scope.row.desc?scope.row.desc.length <= 10?scope.row.desc:scope.row.desc.substring(0,10)+'...':'' }}
                        </el-link>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column prop="staffName" label="记录人" min-width="8%" />
                  <el-table-column prop="createTime" label="记录时间" min-width="12%" />
                  <el-table-column label="操作" fixed="right" min-width="8%">
                    <template slot-scope="scope">
                      <el-button type="primary" size="mini" @click="addingrecord(scope.row)">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-card>
      <!-- 弹窗 -->
      <el-dialog
        :visible.sync="addingRecordVisiable"
        title="新增记录"
        :close-on-click-modal="false"
        width="30%"
        @close="handleCancelRecord"
      >
        <el-form
          ref="recordForm"
          label-width="100px"
          label-position="right"
          :model="record"
          :rules="recordFormRule"
        >
          <el-form-item label="录音编号" prop="fileId">
            <el-col :span="12">
              <el-input
                v-model="record.sessionId"
                placeholder="请输入录音编号"
                :maxlength="15"
                show-word-limit
                width="30%"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="来/去电话" prop="phone">
            <el-col :span="12">
              <el-input
                v-model="record.phone"
                width="30%"
                placeholder="请输入来/去电话"
                :maxlength="15"
                :disabled="record.id>0 && record.hasOwnProperty('sessionId') && record.sessionId!==''"
                show-word-limit
              />
            </el-col>
          </el-form-item>
          <el-form-item label="呼叫类型" prop="type">
            <el-select
              v-model="record.type"
              placeholder="请选择呼叫类型"
              :disabled="record.id>0 && record.hasOwnProperty('sessionId') && record.sessionId!==''"
            >
              <el-option
                v-for="type in CallType"
                :key="type.value"
                :label="type.text"
                :value="type.value"
                width="30%"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="电话来源" prop="source">
            <el-select
              v-model="record.source"
              placeholder="请选择电话来源"
              :disabled="record.id>0 && record.hasOwnProperty('sessionId') && record.sessionId!==''"
            >
              <el-option
                v-for="iphone in iphonecome"
                :key="iphone.value"
                :label="iphone.text"
                :value="iphone.value"
                width="30%"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="售后跟踪" prop="desc">
            <el-input
              v-model="record.desc"
              width="40%"
              rows="4"
              type="textarea"
              placeholder="请输入售后跟踪内容"
              :disabled="false"
              :maxlength="100"
              show-word-limit
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click.native.prevent="handleSubmitRecord()">提交</el-button>
          <el-button @click="handleCancelRecord">取消</el-button>
        </div>
      </el-dialog>

      <div class="info" v-if="!Lookdisabled">
        <div class="card-opt">
          <el-button
            :disabled="!(Order.afterSaleApplies && Order.afterSaleApplies.length>0 && Order.afterSaleApplies[0].status ===AfterSaleApplyStatus.HANDLING)"
            :type="Order.afterSaleApplies && Order.afterSaleApplies.length>0 && Order.afterSaleApplies[0].status ===AfterSaleApplyStatus.HANDLING?'danger':'info'"
            size="medium"
            @click="handlerApply(Order.afterSaleApplies[0].afterSaleNo)"
          >处理完成</el-button>
          <el-button
            :disabled="!(Order.afterSaleApplies && Order.afterSaleApplies.length>0 && Order.afterSaleApplies[0].status ===AfterSaleApplyStatus.HANDLING)"
            :type="Order.afterSaleApplies && Order.afterSaleApplies.length>0 && Order.afterSaleApplies[0].status ===AfterSaleApplyStatus.HANDLING?'primary':'info'"
            size="medium"
            @click="unLockAfterSaleApply(Order.afterSaleApplies[0].afterSaleNo)"
          >解锁订单</el-button>
        </div>
      </div>

      <el-card class="info" shadow="never">
        <div slot="header" class="info-header">
          <!-- <i class="iconfont">&#xe61c;</i> -->
          <svg-icon icon-class="dingdan" />
          <span class="titlecss">订单日志</span>
        </div>
        <el-table :data="orderLogs">
          <el-table-column prop="userName" label="操作人" />
          <el-table-column prop="operContent" label="操作内容" />
          <el-table-column prop="operTime" label="操作时间" />
        </el-table>
      </el-card>
      <el-dialog
        :visible.sync="purchaseFormVisiable"
        :close-on-click-modal="false"
        label-position="right"
        :inline="true"
      >
        <div slot="title">
          <span>采购订单</span>
        </div>
        <div class="purchase-order-info">
          <el-row>
            <el-col :span="3" class="text-right">
              <el-col :underline="false">采购单号：</el-col>
            </el-col>
            <el-col :span="9">
              <!-- <el-input :disabled="true" v-model="PurchaseOrder.purchaseNo" size="small" /> -->
              <el-col :underline="false">{{ PurchaseOrder.purchaseNo }}</el-col>
            </el-col>
            <el-col :span="3" class="text-right">
              <el-col :underline="false">采购状态：</el-col>
            </el-col>
            <el-col :span="9">
              <el-col :underline="false">{{ PurchaseOrder.purchaseStatusDesc }}</el-col>
              <!-- <el-input :disabled="true" v-model="PurchaseOrder.purchaseStatusDesc" size="small" /> -->
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="3" class="text-right">
              <el-col :underline="false">采购金额：</el-col>
            </el-col>
            <el-col :span="9">
              <el-col :underline="false">￥{{ PurchaseOrder.purchasePrice }}</el-col>
              <!-- <el-input :disabled="true" v-model="PurchaseOrder.purchasePrice" size="small" /> -->
            </el-col>
            <el-col :span="3" class="text-right">
              <el-col :underline="false">采购平台：</el-col>
            </el-col>
            <el-col :span="9">
              <el-col
                :underline="false"
              >{{ PurchaseOrder.platform }}/{{ PurchaseOrder.purChaseAccountTypeDesc }}</el-col>
              <!-- <el-input style="float:left" :disabled="true" v-model="PurchaseOrder.platform" size="small" /> -->
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="3" class="text-right">
              <el-col :underline="false">采购账号/密码：</el-col>
            </el-col>
            <el-col :span="9">
              <el-col :underline="false">{{ PurchaseOrder.purchaseAccountInfo }}</el-col>
            </el-col>
            <el-col :span="3" class="text-right">
              <el-col :underline="false">预留手机号：</el-col>
            </el-col>
            <el-col :span="9">
              <el-col :underline="false">{{ PurchaseOrder.reservedPhone }}</el-col>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="3" class="text-right">
              <el-col :underline="false">支付方式：</el-col>
            </el-col>
            <el-col :span="9">
              <el-col
                :underline="false"
              >{{ PurchaseOrder.payTypeDesc }}/{{ PurchaseOrder.payAccount }}</el-col>
            </el-col>
            <el-col :span="3" class="text-right">
              <el-col :underline="false">采购平台单号：</el-col>
            </el-col>
            <el-col :span="9">
              <el-col :underline="false">{{ PurchaseOrder.platformOrderNo }}</el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="text-right">
              <el-col :underline="false">采购日期：</el-col>
            </el-col>
            <el-col :span="21">
              <el-col :underline="false">{{ PurchaseOrder.orderDate }}</el-col>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="3" class="text-right">
              <el-col :underline="false">订单备注：</el-col>
            </el-col>
            <el-col :span="21">
              <el-col :underline="false">{{ PurchaseOrder.remark }}</el-col>
            </el-col>
          </el-row>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="refundFormVisiable"
        :close-on-click-modal="false"
        label-position="right"
        :inline="true"
      >
        <div slot="title">
          <span>退款申请</span>
        </div>
        <el-card>
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
                <el-link :underline="false">￥{{ paymentOrder.paymentAmount }}</el-link>
              </el-col>
              <!-- <el-col :offset="1" :span="3">预订数量：</el-col>
            <el-col :span="3">
              <el-link :underline="false">{{ Order.roomCount }} 间</el-link>
            </el-col>
            <el-col :offset="1" :span="3">预订天数：</el-col>
            <el-col :span="3">
              <el-link :underline="false">{{ Order.bookingDays }} 天</el-link>
              </el-col>-->
            </el-row>
          </div>
          <el-form ref="applyFormorder" :rules="refundApplyOrderrules" :model="refundApplyOrder">
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
            </el-form-item>-->

            <!-- 					<el-form-item label="金额计算方式" prop="refundTypes">
						<el-col :span="5">
							  <el-radio-group v-model="refundApplyOrder.refundTypes" @change="refundPercentChange" >
							    <el-radio :label="0" >金额</el-radio>
							    <el-radio :label="1">百分比</el-radio>
							  </el-radio-group>
						</el-col>
					</el-form-item>
						<el-form-item label="退款百分比" prop="refundPercent">
							<el-col :span="5">
								<el-input-number v-model="refundApplyOrder.refundPercent" :disabled="refundApplyOrder.refundTypes == 0" placeholder="百分比" :min="0.01" :max="100" style="width:200px;" @change="refundPercentChange" />
							</el-col> 
            </el-form-item>-->
            <el-form-item label="退款金额" prop="refundAmount">
              <el-col :span="5">
                <el-input-number
                  v-model="refundApplyOrder.refundAmount"
                  placeholder="金额"
                  :precision="2"
                  :step="100"
                  :max="paymentOrder.paymentAmount"
                  style="width:200px;"
                  :disabled="refundApplyOrder.refundTypes == 1"
                />
              </el-col>
            </el-form-item>
            <!-- <el-form-item label="采购金额" prop="purchasePrice">
              <el-input-number v-model="PurchaseOrder.purchasePrice"  placeholder="金额" :precision="2" :step="100" :max="100000" style="width:200px;" />
            </el-form-item>-->
            <el-form-item label="退款方式" prop="refundWay">
              <el-select v-model="refundApplyOrder.refundWay" clearable>
                <el-option
                  v-for="way in wayDict"
                  :key="way.value"
                  :label="way.text"
                  :value="way.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="退款原因" prop="refundReason">
              <el-select v-model="refundApplyOrder.refundReason" clearable>
                <el-option
                  v-for="reason in RefundReason"
                  :key="reason.value"
                  :label="reason.text"
                  :value="reason.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="退款类型" prop="refundType">
              <el-select v-model="refundApplyOrder.refundType" clearable>
                <el-option
                  v-for="type in typeDict"
                  :key="type.value"
                  :label="type.text"
                  :value="type.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="原因描述" prop="refundDesc" minlength="1" style="margin-left:0.6rem">
              <el-col :span="12">
                <el-input
                  v-model="refundApplyOrder.refundDesc"
                  type="textarea"
                  :rows="2"
                  maxlength="255"
                  show-word-limit
                  placeholder="请输入退款描述"
                />
              </el-col>
            </el-form-item>
          </el-form>
        </el-card>
        <span slot="footer" class="dialog-footer" v-if="!Lookdisabled">
          <el-button @click="refundFormVisiable=false">取 消</el-button>
          <el-button type="primary" @click="submitRefund()">提交申请</el-button>
        </span>
      </el-dialog>
    </el-col>
  </div>
</template>

<script>
import { GetOrder, GetOrderLogs, AddLog } from "@/api/order/order";
import { AddRecord, Handler } from "@/api/aftersale/aftersale";
import { ApplyRefound, RefundTrade } from "@/api/refund/refund";
import moment from "moment";
import { mapGetters } from "vuex";
import permission from "@/directive/permission";
export default {
  directives: {
    permission
  },
  filters: {
    dateToStr(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 8) {
        return value.slice(0, 8) + "...";
      }
      return value;
    }
  },
  data() {
    return {
      orderAmount1: "",
      afterSaleApplyReasonEnum: {
        else: 1
      },
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
      orderSetp: 0,
      purchaseFormVisiable: false,
      addingRecordVisiable: false,
      refundFormVisiable: false,
      value: "",
      value2: "",
      refundType: 0,
      refundWay: 0,
      Lookdisabled: false,
      isDisabled: false,
      refundApplyOrderrules: {
        refundAmount: [
          {
            required: true,
            message: "请输入退款金额",
            trigger: "blur"
          },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/,
            message: "请输入数字",
            trigger: "change"
          }
        ],
        refundReason: [
          {
            required: true,
            message: "请选择退款原因",
            trigger: "change"
          }
        ],
        refundType: [
          {
            required: true,
            message: "请选择退款类型",
            trigger: "change"
          }
        ],
        refundWay: [
          {
            required: true,
            message: "请选择退款方式",
            trigger: "change"
          }
        ]

        //refundTypes: [{
        //	required: true,
        //	message: '请选择计算金额方式',
        //	trigger: 'change'
        //}]
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
      purchaseMethodEnum: {
        SYSTEM: 1,
        MANNAL: 2
      },
      PaymentOrderStatus: {
        PAYSUCCESS: 2
      },
      RefundApplyOrderAuditStatus: {
        ORIGINAL: 0,
        PASS: 1,
        REJECT: 2
      },
      refundApplyOrderStatus: {
        WAITAUDIT: 0,
        AUDINGING: 1,
        REJECT: 2,
        AUDITPASS: 3,
        WAITREFUND: 4
      },
      AfterSaleType: {
        REFUND: 5
      },
      AfterSaleApplyStatus: {
        ORIGINAL: 0,
        HANDLING: 5,
        COMPLATE: 10,
        CLOSE: -1
      },
      LockEnum: {
        NoLock: 0,
        Lock: 1
      },
      platform: [
        {
          text: "美团",
          value: 5
        },
        {
          text: "携程",
          value: 10
        },
        {
          text: "携程代订",
          value: 8
        },
        {
          text: "艺龙",
          value: 70
        },
        {
          text: "去哪儿",
          value: 30
        },
        {
          text: "美团分销",
          value: 6
        },
        {
          text: "携程分销",
          value: 9
        },
        {
          text: "携程商旅",
          value: 7
        },
        {
          text: "同程",
          value: 40
        },
        {
          text: "飞猪",
          value: 50
        },
        {
          text: "线下",
          value: 60
        },
        {
          text: "其他",
          value: 100
        }
      ],
      payType: [
        {
          text: "微信",
          value: 1
        },
        {
          text: "支付宝",
          value: 5
        },
        {
          text: "云闪付",
          value: 20
        },
        {
          text: "百度钱包",
          value: 30
        },
        {
          text: "信用卡",
          value: 40
        },
        {
          text: "接口支付",
          value: 60
        },
        {
          text: "银行卡",
          value: 70
        },
        {
          text: "其他",
          value: 100
        }
      ],
      purChaseAccountType: [
        {
          text: "新账号",
          value: 1
        },
        {
          text: "老账号",
          value: 5
        },
        {
          text: "超级会员",
          value: 10
        },
        {
          text: "银卡会员",
          value: 15
        },
        {
          text: "黄金会员",
          value: 20
        },
        {
          text: "白金会员",
          value: 25
        },
        {
          text: "其他",
          value: 100
        }
      ],
      RefundReason: [
        {
          value: 1,
          text: "平台"
        },
        {
          value: 2,
          text: "酒店"
        },
        {
          value: 10,
          text: "系统"
        },
        {
          value: 100,
          text: "其它"
        }
      ],
      CallType: [
        {
          value: 1,
          text: "呼入"
        },
        {
          value: 2,
          text: "呼出"
        },
        {
          value: 0,
          text: "未知"
        }
      ],

      typeDict: [
        {
          text: "用户取消",
          value: 1
        },
        {
          text: "预订失败",
          value: 2
        },
        {
          text: "售后退款",
          value: 3
        }
      ],
      wayDict: [
        {
          text: "原路返回",
          value: 0
        },
        {
          text: "线下退款",
          value: 1
        }
      ],
      iphonecome: [
        {
          value: 0,
          text: "未知"
        },
        {
          value: 5,
          text: "美团"
        },
        {
          value: 10,
          text: "携程"
        },
        {
          value: 50,
          text: "飞猪"
        },
        {
          value: 30,
          text: "去哪儿"
        },
        {
          value: 70,
          text: "艺龙"
        }
      ],

      record: {
        // 录音编号
        fileId: "",
        // 售后跟踪
        desc: "",
        // 呼叫类型
        type: "",
        // 来/去电话
        phone: "",
        // 来源
        source: ""
      },
      recordFormRule: {
        type: [
          {
            required: true,
            message: "请选择录音编号",
            trigger: "blur"
          }
        ],
        source: [
          {
            required: true,
            message: "请选择电话来源",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入来/去电话",
            trigger: "blur"
          },
          {
            pattern: /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/,
            message: "请输入正确的手机或座机号码",
            trigger: "blur"
          }
        ],
        fileId: [
          {
            pattern: /^[0-9]*/,
            message: "请输入数字",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["sysUser"])
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.getUrlParams()) {
        this.fetchOrder();
      }
    },
    getUrlParams() {
      const query = this.$route.params;
      if (!query || !query.orderNo) {
        this.$alert("请返回重试", "订单查询失败", {
          confirmButtonText: "确定",
          type: "error",
          callback: action => {
            this.$router.push({
              path: "/allorder/list"
            });
          }
        });
        return false;
      }
      this.Order.orderNo = query.orderNo;
      return true;
    },
    addingrecord(record) {
      if (record && record.id > 0) {
        this.record = record;
      }

      this.addingRecordVisiable = true;
    },
    fetchOrder() {
      this.checkInOrders = [];
      this.paymentOrders = [];
      this.purchaseOrders = [];

      const loading = this.$loading({
        lock: true,
        text: "正在加载订单",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      GetOrder(this.Order.orderNo).then(res => {
        const code = res.code;
        if (code !== 0) {
          this.$alert("请返回重试", "订单查询失败", {
            confirmButtonText: "确定",
            type: "error",
            callback: action => {
              this.$router.push({
                path: "/allorder/list"
              });
            }
          });
          loading.close();
          return false;
        }
        const order = res.data;
        const afterSaleApply = order.afterSaleApplies[0];
        if (this.$route.query.isdetails == 1) {
          this.lunchOrder(order);
          loading.close();
          this.Lookdisabled = true;
        } else {
          if (afterSaleApply.status === this.AfterSaleApplyStatus.HANDLING) {
            if (afterSaleApply.modifier === this.sysUser.userId) {
              this.lunchOrder(order);
            } else {
              this.$alert(
                '当前售后单<strong style="color:red;font-size:large">' +
                  afterSaleApply.optUser +
                  "</strong>正在处理中",
                "提示",
                {
                  confirmButtonText: "确定",
                  type: "warning",
                  showClose: false,
                  closeOnClickModal: false,
                  closeOnPressEscape: false,
                  dangerouslyUseHTMLString: true
                }
              ).then(() => {
                this.$store.dispatch("tagsView/delView", this.$route);
                this.goAfterSaleList();
              });
            }
          }
          if (afterSaleApply.status === this.AfterSaleApplyStatus.ORIGINAL) {
            this.$confirm(
              "您是否锁定当前售后单(订单号:" + this.Order.orderNo + ") ？",
              "提示",
              {
                confirmButtonText: "锁定",
                cancelButtonText: "不锁定",
                type: "warning",
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false
              }
            )
              .then(() => {
                this.lockAfterSaleApply(afterSaleApply);
              })
              .catch(action => {
                this.goAfterSaleList();
              });
          }

          if (
            afterSaleApply.status === this.AfterSaleApplyStatus.CLOSE ||
            afterSaleApply.status === this.AfterSaleApplyStatus.COMPLATE
          ) {
            this.lunchOrder(order);
          }

          loading.close();
        }
      });
    },
    lockAfterSaleApply(afterSaleApply) {
      const loading = this.$loading({
        lock: true,
        text: "正在锁定售后单",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      Handler(
        afterSaleApply.afterSaleNo,
        this.AfterSaleApplyStatus.HANDLING
      ).then(res => {
        loading.close();
        if (res.data) {
          this.init();
        } else {
          this.$message("订单锁定失败,请返回重试");
        }
      });
    },
    unLockAfterSaleApply(afterSaleNo) {
      Handler(afterSaleNo, this.AfterSaleApplyStatus.ORIGINAL).then(res => {
        if (res.data) {
          // this.$store.dispatch('delVisitedViews', this.$route);
          this.$store.dispatch("tagsView/delView", this.$route);
          this.goAfterSaleList();
        } else {
          this.$message("订单解锁失败,请稍后重试");
        }
      });
    },
    handlerApply(afterSaleNo) {
      Handler(afterSaleNo, this.AfterSaleApplyStatus.COMPLATE).then(res => {
        if (res.data) {
          this.goAfterSaleList();
        } else {
          this.$message("操作失败,请稍后重试");
        }
      });
    },
    lunchOrder(order) {
      this.Order = order;
      this.orderAmount1 = parseFloat(this.Order.orderAmount * 0.94).toFixed(2);
      // 入住人
      var checkInName = this.Order.checkInName.split(",");
      for (var i = 1; i <= checkInName.length; i++) {
        const checkInOrder = {
          ...this.Order
        };
        checkInOrder.roomCount = 1;
        checkInOrder.checkInName = checkInName[i - 1];
        this.checkInOrders.push(checkInOrder);
      }

      // 支付单
      this.paymentOrders = this.Order.paymentOrders;
      if (
        this.paymentOrders.some(
          x => x.paymentStatus === this.PaymentOrderStatus.PAYSUCCESS
        )
      ) {
        this.paymentOrder = this.paymentOrders.find(
          x => x.paymentStatus === this.PaymentOrderStatus.PAYSUCCESS
        );
      } else {
        this.paymentOrder = {};
      }

      // 采购单
      this.purchaseOrders = this.Order.purchaseOrders;
      this.purchaseOrders.forEach((item, index) => {
        //采购单
        if (item.payType === 60) {
          item.purchasePrice =
            item.purchasePrice +
            "/" +
            parseFloat(item.purchasePrice * 0.96).toFixed(2);
        }
      });
      // 售后单
      this.afterSaleApplies = this.Order.afterSaleApplies;
      this.afterSaleRecords = this.afterSaleApplies[0].afterSaleRecords;

      // 退款单
      this.refundApplyOrders = this.Order.refundApplyOrders;
      if (this.Order.paymentStatus !== this.OrderPaymentStatusEnum.PAYSUCCESS) {
        if (this.paymentOrders && this.paymentOrders.length > 0) {
          let time = this.paymentOrders[this.paymentOrders.length - 1]
            .modifyTime;
          if (!time) {
            time = this.paymentOrders[this.paymentOrders.length - 1].createTime;
          }
          this.Order.payTime = time;
        } else {
          this.Order.payTime = this.Order.modifyTime;
        }
      }

      switch (this.Order.orderStatus) {
        case this.OrderStatusEnum.WAITPAY:
          this.orderSetp = 1;
          break;
        case this.OrderStatusEnum.RESERVEING:
          this.orderSetp = 3;
          break;
        case this.OrderStatusEnum.WAITCONFIRM:
          this.orderSetp = 3;
          break;
        case this.OrderStatusEnum.RESERVESUCCESS:
          this.orderSetp = 3;
          break;
        case this.OrderStatusEnum.RESERVEFAIL:
          this.orderSetp = 3;
          // 是否退款
          switch (this.Order.refundStatus) {
            case this.refundApplyOrderStatus.REFUNDSUCCESS:
            case this.refundApplyOrderStatus.REFUNDFAIL:
              this.orderSetp = 4;
              break;
            case this.refundApplyOrderStatus.REJECT:
              this.Order.refundTime = this.refundApplyOrders[0].auditTime;
              this.orderSetp = 4;
              break;
          }
          break;
        case this.OrderStatusEnum.WAITIN:
          this.orderSetp = 4;
          break;
        case this.OrderStatusEnum.WAITIN_REFUND:
          this.orderSetp = 4;
          break;
        case this.OrderStatusEnum.CANCEL:
          this.orderSetp = 3;
          // 是否退款
          switch (this.Order.refundStatus) {
            case this.refundApplyOrderStatus.REFUNDSUCCESS:
            case this.refundApplyOrderStatus.REFUNDFAIL:
              this.orderSetp = 4;
              break;
            case this.refundApplyOrderStatus.REJECT:
              this.Order.refundTime = this.refundApplyOrders[0].auditTime;
              this.orderSetp = 4;
              break;
          }
          break;
      }

      this.fetchOrderLog();
    },
    fetchOrderLog() {
      const orderNo = this.Order.orderNo;
      GetOrderLogs(orderNo).then(res => {
        this.orderLogs = res.data;
      });
    },
    refundApply() {
      if(this.paymentOrders.length>0 && this.refundApplyOrders.length > 0 ) {
       var paymentTotalAmount=this.paymentOrders[0].paymentAmount;
       var refundTotalAmount = 0;
       this.refundApplyOrders.forEach((item)=>{
         if (item.refundStatus==this.RefundApplyOrderStatusEnum.WAITAUDIT||item.refundStatus==this.RefundApplyOrderStatusEnum.WAITREFUND)
           {  this.$message.error("当前订单有未处理完成的退款单,请处理完成之后再申请");
             return;
           }
             refundTotalAmount +=item.refundAmount;
         } );
         if(refundTotalAmount>=paymentTotalAmount) {
           this.$message.error("支付金额已退完,不能继续申请退款");
           return;
           }else{
              this.refundFormVisiable = true;
           }
            
        }else{
           this.refundFormVisiable = true;
        }
      
    
    },
    submitRefund() {
      this.$refs["applyFormorder"].validate(valid => {
        if (valid) {
          const param = {
            orderNo: this.Order.orderNo,
            paymentOrderNo: this.paymentOrder.paymentNo,
            ...this.refundApplyOrder
          };
          const loading = this.$loading({
            lock: true,
            text: "正在申请退款",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this.isDisabled = true;
          ApplyRefound(param).then(res => {
            if (res.data) {
              this.fetchOrder();
              this.refundApplyOrder = {};
              this.refundFormVisiable = false;
              this.$message({
                type: "success",
                message: "退款申请成功"
              });
              this.isDisabled = false;
            } else {
              this.$message({
                type: "error",
                message: "退款申请失败"
              });
              this.isDisabled = false;
            }
            loading.close();
          });
        } else {
          return;
        }
      });
    },
    purchaseOrderDetail(purchaseOrder) {
      AddLog(
        this.Order.orderNo,
        purchaseOrder.purchaseNo,
        "purchaseDetailView"
      );

      this.PurchaseOrder = purchaseOrder;

      this.purchaseFormVisiable = true;
    },
    dateTimeToDate(val) {
      return moment(val).format("YYYY-MM-DD");
    },
    // 提交
    handleSubmitRecord() {
      this.$refs["recordForm"].validate(valid => {
        if (!valid) {
          return;
        }

        const afterSaleNo = this.afterSaleApplies[0].afterSaleNo;
        const data = {
          afterSaleNo: afterSaleNo,
          ...this.record
        };
        AddRecord(data).then(res => {
          if (res.data) {
            this.fetchOrder();
            // 关闭弹框
            this.addingRecordVisiable = false;

            // 清除数据
            this.record = {};
            this.$message({
              type: "success",
              message: "提交成功"
            });
          } else {
            this.$message({
              type: "error",
              message: "提交失败"
            });
          }
        });
      });
    },
    doRefund(orderNo) {
      this.$confirm("退款后不可撤回，确定要通过退款吗？", "退款确认提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "退款",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: "正在处理退款",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          RefundTrade(orderNo).then(res => {
            loading.close();

            if (res.data) {
              this.fetchOrder();
              this.$message({
                type: "success",
                message: "退款完成"
              });
            } else {
              this.$message({
                type: "error",
                message: "退款失败"
              });
            }
          });
        })
        .catch(action => {});
    },
    getOrderBookingStatus(order) {
      let bookingStatus = "";
      if (order.confirmTime) {
        bookingStatus = "预订成功";
      } else {
        switch (order.orderStatus) {
          case this.OrderStatusEnum.RESERVESUCCESS:
            bookingStatus = "预订成功";
            break;
          case this.OrderStatusEnum.RESERVEFAIL:
            bookingStatus = "预订失败";
            break;
          default:
            bookingStatus = "预订中";
            break;
        }
      }
      return bookingStatus;
    },
    getOrderRefundStatus(order) {
      let refundStatus = "";
      if (order.orderStatus === this.OrderStatusEnum.WAITIN_REFUND) {
        refundStatus = "已消费退款";
      } else {
        switch (order.refundStatus) {
          case this.refundApplyOrderStatus.REFUNDSUCCESS:
            refundStatus = "退款成功";
            break;
          case this.refundApplyOrderStatus.REJECT:
            refundStatus = "退款失败";
            break;
          default:
            refundStatus = "退款中";
            break;
        }
      }
      return refundStatus;
    },
    handleCancelRecord() {
      this.record = {};

      this.addingRecordVisiable = false;
    },
    goAfterSaleList() {
      this.$router.push("/aftersales/list");
    },
    refundPercentChange() {
      this.refundApplyOrder.refundAmount = (
        this.paymentOrder.paymentAmount *
        this.refundApplyOrder.refundPercent *
        0.01
      ).toFixed(2);
    },
    refundTypesChange() {
      if (this.refundApplyOrder.refundTypes == 1) this.refundPercentChange();
    }
  }
};
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

::v-deep .el-table th.el-table__cell {
  background-color: #fff;
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
  padding-top: 0.5rem;
  padding-left: 1.5rem;
}

.refund-header .el-row {
  /* font-size: medium; */
  line-height: 2rem;
}

.right-align {
  font-size: 13px;
  padding-right: 10px;
  text-align: right;
  line-height: 20px;
}

.left-align {
  line-height: 20px;
  float: left;
  font-size: 13px;
  color: #606266;
  font-family: "微软雅黑";
}

::v-deep .el-card__body {
  padding: 0 20px 0 20px;
}

.orderinfo {
  font-weight: 600;
  font-size: 13px;
  color: #606266;
  font-family: "微软雅黑";
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

.info {
  margin: 15px;
}

.card-opt {
  text-align: center;
}

.titlecss {
  padding-left: 5px;
  color: #006699;
  opacity: 0.7;
  filter: alpha(opacity=70);
  font-weight: 600;
}

.text-right {
  font-size: 13px;
  text-align: right;
  font-weight: 700;
}

.purchase-order-info {
  line-height: 40px;
}

::v-deep .el-table th > .cell {
  color: #606266;
  text-align: center;
}

::v-deep .el-table__body td {
  text-align: center;
}

::v-deep .is-success .el-input-number__increase {
  right: 0 !important;
}

::v-deep .is-error .el-input-number__increase {
  right: 0px !important;
}

.dialog-footer {
  text-align: center;
}

::v-deep .el-table th {
  border-right: 0;
}
</style>
