<template>
  <div v-show="Order.orderStatus" class="content">
    <el-col :xl="4" :lg="2">
      <br />
    </el-col>
    <el-col :xl="16" :lg="20" style="min-width: 1000px;">
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
                <span class="orderinfo">取消规则:</span>
              </el-col>
              <el-col :span="12" class="left-align">{{ Order.cancelPolicyText }}</el-col>
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
                      <template slot-scope="scope">￥{{ (scope.row.price/100).toFixed(2) }}</template>
                    </el-table-column>
                  </el-table>
                  <el-link
                    slot="reference"
                    :underline="false"
                    style="border-bottom:1px dashed #ccc;color: #b40000;"
                  >{{ Order.orderAmount }}/{{ Order.orderBasePrice }}
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
                <span class="orderinfo">订单总间/夜：</span>
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
      <!-- <el-col :xl="2" :sm="4" class="right-align">
              <b>开票方：</b>
            </el-col>
            <el-col :xl="2" :sm="6">
              {{ Order.invoiceDrawerDesc }}
      </el-col>-->

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
              </el-col>            </el-row>
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
            <el-table-column label="房型名称" min-width="17%">
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

      <el-card v-if="paymentOrders && paymentOrders.length>0" class="info" shadow="never">
        <!-- <i class="iconfont">&#xe626;</i> -->
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
            <el-table-column prop="purchaseNo" label="采购单号" min-width="10%">
              <template slot-scope="scope">
                <el-link
                  style="border-bottom:1px dashed #ccc"
                  @click="purchaseOrderDetail(scope.row)"
                >{{ scope.row.purchaseNo }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="platformOrderNo" label="采购平台单号" min-width="10%" />
            <el-table-column prop="platform" label="采购平台" min-width="8%" />
            <el-table-column prop="purchaseMethodDesc" label="采购方式" min-width="8%" />
            <el-table-column prop="purchasePrice" label="采购金额" min-width="10%">
              <template slot-scope="scope">
                <div style="color:#b40000">{{ scope.row.purchasePrice }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="purchaseStatusDesc" label="采购状态" min-width="10%" />
            <el-table-column prop="contactPhone" label="预留手机号" min-width="10%" />
            <el-table-column prop="createrDesc" label="采购人" min-width="10%" />
            <el-table-column prop="orderDate" label="采购时间" min-width="16%" />
            <!-- <el-table-column label="操作" fixed="right" width="100" min-width="10%">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="purchaseOrderDetail(scope.row)">详情</el-button>
              </template>
            </el-table-column>-->
          </el-table>
        </el-col>
      </el-card>

      <el-card v-if="afterSaleApplies && afterSaleApplies.length>0" class="info" shadow="never">
        <div slot="header" class="info-header">
          <svg-icon icon-class="lianxishouhou" />
          <span class="titlecss">售后信息</span>
        </div>
        <el-table :data="afterSaleApplies">
          <el-table-column prop="afterSaleNo" label="售后单号" min-width="16%" />
          <el-table-column prop="typeDesc" label="售后类型" min-width="16%">
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
          <el-table-column prop="reasonDesc" label="售后原因" min-width="16%">
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
          <el-table-column prop="desc" label="情况说明" min-width="16%">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                trigger="hover"
                width="400"
                :content="scope.row.desc"
              >
                <el-link
                  slot="reference"
                >{{ scope.row.desc?scope.row.desc.length<= 10?scope.row.desc:scope.row.desc.substring(0,10)+'...':'' }}</el-link>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="statusDesc" label="处理状态" min-width="16%" />
          <el-table-column prop="applyTime" label="申请时间" min-width="16%" />
        </el-table>


 <el-card v-if="refundApplyOrders && refundApplyOrders.length>0" class="info" shadow="never">
	 	<el-collapse value="search">
            <el-collapse-item name="search1">
              <span slot="title" class="collapse-title">退款信息</span>
              <div class="filter-container">
        <div slot="header" class="info-header">
          <!-- <svg-icon icon-class="tuikuan" />
          <span class="titlecss">退款信息</span> -->
          <el-button
            v-permission="['AdjustRefund']"
            style="float: right;margin: 16px 30px 0 0;"
            type="primary"
            size="small"
            @click="openCompensation"
          >订单调账</el-button>
        </div>
        <el-table :data="refundApplyOrders">
          <el-table-column prop="refundNo" label="退款单号" min-width="10%" />
          <el-table-column prop="refundAmount" label="退款金额" min-width="8%" />
          <el-table-column prop="refundTypeDesc" label="退款类型" min-width="10%" />
          <el-table-column prop="refundWayDesc" label="退款方式" min-width="10%" />
          <el-table-column prop="refundReasonDesc" label="退款原因" min-width="8%" />
          <el-table-column prop="refundDesc" label="问题描述" min-width="16%">
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

          <el-table-column label="退款状态" min-width="10%">
            <template slot-scope="scope">
              <el-popover
                v-if="scope.row && scope.row.refundStatus === refundApplyOrderStatus.REJECT"
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
              <el-col v-else style="margin-left:3px">{{ scope.row.refundStatusDesc }}</el-col>
            </template>
          </el-table-column>
          <el-table-column prop="modifierDesc" label="操作人" min-width="8%" />
          <el-table-column prop="auditUserName" label="审核人" min-width="8%" />
          <el-table-column prop="applyTime" label="申请时间" min-width="14%" />
        </el-table>
     </div>
     </el-collapse-item>
	 </el-collapse>
      </el-card>
	  
        <el-card size="mini"  class="info" shadow="never">
			<el-collapse value="search">
            <el-collapse-item name="search1">
              <span slot="title" class="collapse-title">咨询信息</span>
              <div class="filter-container">
          <el-table :data="afterSaleRecords">
            <el-table-column prop="fileId" label="录音编号" min-width="12%">
              <template slot-scope="scope">
                <el-link :href="scope.row.fileId">{{ scope.row.sessionId }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="callTypeDesc" label="呼叫类型" min-width="12%" />
            <el-table-column prop="phone" label="来/去电电话" min-width="12%" />
            <el-table-column prop="source" label="电话来源" min-width="12%">
              <template slot-scope="scope">{{ scope.sourceDesc?scope.sourceDesc:'未知' }}</template>
            </el-table-column>
            <el-table-column prop="desc" label="售后跟踪" min-width="12%">
              <template slot-scope="scope">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  width="450"
                  :content="scope.row.desc"
                >
                  <el-link slot="reference">
                    <!-- {{ scope.row.desc?scope.row.desc.length <= 10?scope.row.desc:scope.row.desc.substring(0,10)+'...':'' }} -->
                  </el-link>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="staffName" label="记录人" min-width="12%" />
            <el-table-column prop="createTime" label="记录时间" min-width="12%" />
            <!-- <el-table-column label="操作" fixed="right" width="200">
			  <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="addingrecord(scope.row)">详情</el-button>
              </template>
            </el-table-column>-->
          </el-table>
         </div>
         </el-collapse-item>
		</el-collapse>


        </el-card>
     

     
	   </el-card>
      <!-- 

			<el-card class="info" shadow="never">
				<div slot="header" class="info-header">
					<svg-icon icon-class="u2849" />
					<span class="titlecss">财务核账信息</span>
				</div>
				<el-form label-width="80px" ref="addForm" :model="form" class="form" :rules="rules">
					<el-row :gutter="20">
						<el-col :span="6">
							<el-form-item label="采购差额" prop="aa" >
								<el-input v-model="form.aa" disabled/>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="下单差额" prop="bb" >
								<el-input v-model="form.bb" disabled/>
							</el-form-item>
						</el-col>
						<el-col :span="6" style="margin-right: 10px;">
							<el-form-item label="最终利润" prop="cc" label-width="120px">
								<el-input v-model="form.cc" disabled/>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="核对状态" prop="dd">
								<el-select v-model="form.dd" placeholder="请选择">
									<el-option v-for="(item,index) in purchasePlatDict" :value="item.dictValue"
										:label="item.dictlabel" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="核对时间" prop="ee">
								<el-date-picker v-model="form.ee" type="datetime" placeholder="选择时间"
									style="width: 190px;" value-format="yyyy-MM-dd HH:mm:ss"
									format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptionsStart" disabled>
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="调账总额" prop="ff" label-width="120px">
								<el-input v-model="form.ff" style="width: 175px;margin-right: 10px;" />
								<el-button type="primary" size="small" @click="compensationVisiable = true">调账详情
								</el-button>
							</el-form-item>
						</el-col>
						<el-col :span="18">
							<el-form-item label="情况说明" prop="gg">
								<div style="display: flex;position: relative;padding-right: 150px;">
									<el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入内容" resize="none"
										v-model="form.gg">
									</el-input>
									<div style="position: absolute;bottom: 0px;right: 10px;">
										<el-button size="small" type="primary" @click="">提交</el-button>
										<el-button size="small" @click="" type="warning">取消</el-button>
									</div>

								</div>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
      </el-card>-->

      <el-card class="info" shadow="never">
        <div slot="header" class="info-header">
          <!-- <i class="iconfont">&#xe61c;</i> -->
          <svg-icon icon-class="dingdan" />
          <span class="titlecss">订单日志</span>
        </div>
        <el-table :data="orderLogs" :cell-style="cellStyle">
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
              <div :underline="false">￥{{ PurchaseOrder.purchasePrice }}</div>
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
        :visible.sync="compensationVisiable"
        :close-on-click-modal="false"
        label-position="right"
        width="1000px"
        :inline="true"
      >
        <div slot="title">
          <span>调账列表</span>
        </div>
        <el-form
          label-width="120px"
          ref="compensationForm"
          :model="compensationForm"
          class="form"
          :rules="compensationRules"
        >
          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item label="退款方式" prop="refundWay">
                <el-select v-model="compensationForm.refundWay">
                  <el-option
                    :label="item.dictLabel"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    v-for="item in wayDict"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退款原因" prop="refundReason">
                <el-select v-model="compensationForm.refundReason">
                  <el-option
                    :label="item.dictLabel"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    v-for="item in reasonDict"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="退款类型" prop="refundType">
                <el-select v-model="compensationForm.refundType ">
                  <el-option
                    :label="item.dictLabel"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    v-for="item in typeDict"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退款(调账)金额" prop="refundAmount">
                <el-input-number
                  v-model="compensationForm.refundAmount"
                  :max="compensationForm.refundType == 4 ? refundAmountMax : Order.orderAmount"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label-width="0">
                <el-popover
                  placement="bottom"
                  trigger="hover"
                  content="*可调账金额：不能超过用户支付金额，且金额可正负，最小值不限。"
                >
                  <el-button
                    slot="reference"
                    icon="el-icon-question"
                    type="text"
                    style="font-size: 16px !important;color: #666 !important;margin: 0 !important;border: none;padding: 8px 0;color: orange;margin-right: 10px;"
                  ></el-button>
                </el-popover>
                <span>最大值：{{compensationForm.refundType == 4 ? refundAmountMax : Order.orderAmount}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="情况说明" prop="refundDesc">
                <div style="display: flex;position: relative;padding-right: 200px;">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4}"
                    placeholder="请输入内容"
                    resize="none"
                    v-model="compensationForm.refundDesc"
                  ></el-input>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="text-align: center;">
              <el-button size="small" type="primary" @click="saveCompensation">确认调账</el-button>
              <el-button size="small" @click="compensationVisiable = false">取 消</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
    </el-col>
  </div>
</template>

<script>
import { GetOrder, GetOrderLogs, AddLog } from "@/api/order/order";
import { AdjustRefund } from "@/api/refund/refund";
import moment from "moment";
import { mapGetters } from "vuex";
import permission from "@/directive/permission";
export default {
  filters: {
    dateToStr(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 10) {
        return value.slice(0, 10) + "...";
      }
      return value;
    }
  },
  directives: {
    permission
  },
  data() {
    var checkAccount = (rule, value, callback) => {
      if (value == 0) {
        return callback(new Error("请输入正确的金额"));
      }
      if (
        this.compensationForm.refundType == 4 &&
        value > this.refundAmountMax
      ) {
        return callback(new Error("调账金额超出限制"));
      } else {
        return callback();
      }
    };
    return {
      Order: {},
      PurchaseOrder: {},
      checkInOrders: [],
      paymentOrders: [],
      purchaseOrders: [],
      afterSaleApplies: [],
      refundApplyOrders: [],
      afterSaleRecords: [],
      orderLogs: [],
      compensationLogs: [],
      orderSetp: 0,
      purchaseFormVisiable: false,
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
      refundApplyOrderStatus: {
        WAITAUDIT: 0,
        REJECT: 2,
        WAITREFUND: 4,
        REFUNDING: 5,
        REFUNDSUCCESS: 6,
        REFUNDFAIL: 7,
        CLOSE: -1
      },
      LockEnum: {
        NoLock: 0,
        Lock: 1
      },
      YN: {
        N: 0,
        Y: 1
      },
      form: {},
      compensationVisiable: false,
      rules: {
        aa: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        bb: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        cc: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        dd: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        ee: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        ff: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ]
      },
      compensationForm: {
        refundType: 4,
        refundWay: 0,
        refundAmount: 0,
        paymentOrderNo: null,
        refundReason: 11,
        refundDesc: null,
        refundFile: null,
        orderNo: null
      },
      refundAmountMax: 0,
      compensationRules: {
        refundType: [
          {
            required: true,
            message: "请选择",
            trigger: "blur"
          }
        ],
        refundWay: [
          {
            required: true,
            message: "请选择",
            trigger: "blur"
          }
        ],
        refundReason: [
          {
            required: true,
            message: "请选择",
            trigger: "blur"
          }
        ],
        refundAmount: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          {
            validator: checkAccount,
            trigger: "blur"
          }
        ],
        refundDesc: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ]
      },
      typeDict: [
        {
          dictLabel: "用户取消",
          dictValue: 1
        },
        {
          dictLabel: "预订失败",
          dictValue: 2
        },
        {
          dictLabel: "售后退款",
          dictValue: 3
        },
        {
          dictLabel: "调账退款",
          dictValue: 4
        }
      ],
      wayDict: [
        {
          dictLabel: "原路返回",
          dictValue: 0
        },
        {
          dictLabel: "线下退款",
          dictValue: 1
        }
      ],
      reasonDict: [
        {
          dictLabel: "客户",
          dictValue: 0
        },
        {
          dictLabel: "平台",
          dictValue: 1
        },
        {
          dictLabel: "酒店",
          dictValue: 2
        },
        {
          dictLabel: "系统",
          dictValue: 10
        },
        {
          dictLabel: "金额误差",
          dictValue: 11
        },
        {
          dictLabel: "其它",
          dictValue: 100
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["sysUser"])
  },
  created() {
    console.log(456);
    this.init();
  },
  methods: {
    init() {
      if (this.getUrlParams()) {
        this.fetchOrder();
      }
    },
    rowClass() {
      return "color: #333333;text-align:center;background:#ffffff;font-size:13px";
    },
    cellStyle() {
      return "text-align:center;color:#606266;font-size:12px;height:30px;";
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
        this.Order = res.data;
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
        this.paymentOrders.forEach((item, index) => {
          if (item.paymentType === 80) {
            item.paymentTypeDesc = "优惠券";
          }
          if (item.paymentType === 100) {
            item.paymentTypeDesc = "折扣";
          }
        });

        // 采购单
        this.purchaseOrders = this.Order.purchaseOrders;
        // 售后单
        this.afterSaleApplies = this.Order.afterSaleApplies;
        if (
          this.Order.afterSaleApplies &&
          this.Order.afterSaleApplies.length > 0
        ) {
          this.afterSaleRecords = this.afterSaleApplies[0].afterSaleRecords;
        }

        // 退款单
        this.refundApplyOrders = this.Order.refundApplyOrders;

        let refundAmountMax = res.data.orderAmount;
        this.refundApplyOrders.forEach(item => {
          if (item.refundType == 4) {
            refundAmountMax -= item.refundAmount;
          }
        });
        refundAmountMax = Number(refundAmountMax.toFixed(2));
        this.refundAmountMax =
          refundAmountMax > res.data.orderAmount
            ? res.data.orderAmount
            : refundAmountMax;
        // if (
        //   this.Order.refundApplyOrders &&
        //   this.Order.refundApplyOrders.length > 0
        // ) {
        //   if (
        //     this.Order.refundApplyOrders[0].refundStatus ===
        //     this.refundApplyOrderStatus.REJECT
        //   ) {
        //     this.Order.refundApplyOrders[0].refundStatusDesc = '退款失败'
        //   }
        // }

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

        loading.close();
      });
    },
    fetchOrderLog() {
      const orderNo = this.Order.orderNo;
      GetOrderLogs(orderNo).then(res => {
        this.orderLogs = res.data;
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
    dateTimeToDate(val) {
      return moment(val).format("YYYY-MM-DD");
    },
    openCompensation() {
      this.compensationVisiable = true;
      this.compensationForm.orderNo = this.Order.orderNo;
      this.compensationForm.refundDesc = "";
      this.compensationForm.refundAmount = 0;
      this.compensationForm.paymentOrderNo = this.refundApplyOrders.paymentOrderNo;
    },
    saveCompensation() {
      this.$refs["compensationForm"].validate(valid => {
        if (valid) {
          AdjustRefund(this.compensationForm).then(res => {
            const code = res.code;
            if (code !== 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              return false;
            } else {
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              this.compensationVisiable = false;
              this.fetchOrder();
            }
          });
        }
      });
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

::v-deep .el-card__body {
  padding: 0 20px 0 20px;
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

.left-align {
  line-height: 20px;
  float: left;
  font-size: 13px;
  color: #606266;
  font-family: "微软雅黑";
}

.text-right {
  font-size: 13px;
  text-align: right;
  font-weight: 700;
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

.right-align .el-link.el-link--default:hover {
  color: #606266;
}

.orderinfo {
  font-weight: 600;
  font-size: 13px;
  color: #606266;
  font-family: "微软雅黑";
}

.purchase-order-info {
  line-height: 40px;
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

::v-deep .el-table th.el-table__cell {
  background-color: #fff;
}

::v-deep .el-table__body td {
  text-align: center;
}

::v-deep .el-table th {
  background: #ffffff;
  opacity: 1;
}

::v-deep .el-table th {
  border-right: 0;
}

.left-align {
  font-size: 13px;
  color: #606266;
}

.form >>> .el-form-item {
  margin-bottom: 10px;
}

.form {
  padding-bottom: 10px;
}

.content >>> .el-dialog {
  min-width: 1000px;
}
</style>
<style>
.app-main {
  background: #f9f9f9;
}
</style>
