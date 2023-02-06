<template>
  <div v-show="Order.orderStatus" class="content">
    <el-col :xl="4" :lg="2"><br></el-col>
    <el-col  :xl="16" :lg="20">
      <el-card class="info" shadow="never">
        <div slot="header" class="info-header">
          <svg-icon icon-class="dingdan_1" />
          <span type="primary" class="titlecss">订单信息</span>
          <!-- <span v-if="Order.purchaseMethod === purchaseMethodEnum.SYSTEM" class="opt"> -->
          <span class="opt">
            <el-button
              v-permission="['SuspendPurchase']"
              :disabled="!((Order.orderStatus === OrderStatusEnum.RESERVEING || Order.orderStatus === OrderStatusEnum.WAITCONFIRM) && Order.purchaseMethod === purchaseMethodEnum.SYSTEM)"
              style="margin-right:0.2rem"
              :type="!((Order.orderStatus === OrderStatusEnum.RESERVEING || Order.orderStatus === OrderStatusEnum.WAITCONFIRM) && Order.purchaseMethod === purchaseMethodEnum.SYSTEM)?'info':'danger'"
              size="mini"
              class="btn-opt"
              icon="el-icon-s-promotion"
              @click="suspendPurchase"
            >中止采购</el-button>
            <!-- v-if="Order.purchaseStatus === OrderPurchaseStatusEnum.PurchaseFail || Order.purchaseStatus === OrderPurchaseStatusEnum.ConfirmFail" -->
            <el-button
              v-permission="['RePurchase']"
              :disabled="!((Order.purchaseStatus === OrderPurchaseStatusEnum.PurchaseFail || Order.purchaseStatus === OrderPurchaseStatusEnum.ConfirmFail) && Order.purchaseMethod === purchaseMethodEnum.SYSTEM)"
              style="margin-right:0.2rem"
              :type="!((Order.purchaseStatus === OrderPurchaseStatusEnum.PurchaseFail || Order.purchaseStatus === OrderPurchaseStatusEnum.ConfirmFail) && Order.purchaseMethod === purchaseMethodEnum.SYSTEM)?'info':'warning'"
              size="mini"
              class="btn-opt"
              icon="el-icon-s-promotion"
              @click="rePurchase"
            >重新采购</el-button>
            <el-button
              v-permission="['TurnToManual']"
              :disabled="!((Order.purchaseStatus === OrderPurchaseStatusEnum.PurchaseFail || Order.purchaseStatus === OrderPurchaseStatusEnum.ConfirmFail) && Order.purchaseMethod === purchaseMethodEnum.SYSTEM)"
              :type="!((Order.purchaseStatus === OrderPurchaseStatusEnum.PurchaseFail || Order.purchaseStatus === OrderPurchaseStatusEnum.ConfirmFail) && Order.purchaseMethod === purchaseMethodEnum.SYSTEM)?'info':'primary'"

              size="mini"
              class="btn-opt"
              style="margin-right:1rem"
              icon="el-icon-s-promotion"
              @click="turnToManual"
            >转人工</el-button>
          </span>
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
                  <el-link slot="reference" :underline="false" style="border-bottom:1px dashed #ccc;color: #b40000;">{{ Order.orderAmount }}/{{ Order.orderBasePrice }}
                  <span  v-if="Order.userPaymentAmount">/{{ Order.userPaymentAmount }}</span></el-link>
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
								<span class="orderinfo"> 订单总间/夜</span>
							</el-col>
							<el-col :span="12" class="left-align">{{  Order.bookingDaysShow }}</el-col>
						</el-row>
          </el-col>
          <el-col :span="16">
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
            <el-table-column prop="hotelAddress" label="酒店地址" min-width="17%">
              <template slot-scope="scope">
                <div style="text-align:center">
                  {{ scope.row.city}}
                  {{ scope.row.hotelAddress }}
                  <br>
                  【{{ scope.row.hotelPhone }}】
                </div>
              </template>
            </el-table-column>
            <el-table-column label="房型名称" min-width="15%">
              <template slot-scope="scope">
                <div style="text-align:center;color: #b40000;">
                  {{ scope.row.roomTypeName }}
                  <br>
                  【{{ scope.row.bedTypeName }}/{{ scope.row.windowDesc }}/{{ scope.row.breakFastDesc }}】
                </div>
              </template>
            </el-table-column>
            <el-table-column label="间/夜" min-width="8%">
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
            <el-table-column prop="checkInName" label="入住人" min-width="8%" >
              <template slot-scope="scope">
                <div style="text-align:center;color: #b40000;">
                  {{ scope.row.checkInName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="checkInPhone" label="入住人电话" min-width="10%" />
            <el-table-column prop="arrivalTime" label="预计到店" min-width="9%" />
          </el-table>
        </el-col>
      </el-card>
      <el-card v-if="paymentOrders && paymentOrders.length>0" class="info" shadow="never">
        <div slot="header" class="info-header">
          <!-- <i class="iconfont">&#xe626;</i> -->
          <svg-icon icon-class="zhifufangshi" />
          <span class="titlecss">
            支付信息
            <!-- <i class="el-icon-bank-card ml5" /> -->
          </span>
        </div>
        <el-col :span="24">
          <el-table :data="paymentOrders">
            <el-table-column prop="paymentNo" label="支付单号" />
            <el-table-column prop="paymentAmount" label="支付金额">
              <template slot-scope="scope">
                <div style="text-align:center;color: #b40000;">
                  {{ scope.row.paymentAmount }}
                </div>
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
          <!-- <i class="iconfont">&#xe622;</i> -->
          <svg-icon icon-class="gouwuchezhengpin" />
          <span class="titlecss">采购信息</span>
        </div>
        <el-col :span="24">
          <el-table :data="purchaseOrders">
            <el-table-column prop="purchaseNo" label="采购单号" min-width="10%">
              <template slot-scope="scope">
                <el-link style="border-bottom:1px dashed #ccc" @click="purchaseOrderDetail(scope.row)">
                  {{ scope.row.purchaseNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="platformOrderNo" label="采购平台单号" min-width="10%" />
            <el-table-column prop="platform" label="采购平台" min-width="8%" />
            <el-table-column prop="purchaseMethodDesc" label="采购方式" min-width="8%" />
            <el-table-column prop="payTypeDesc" label="支付方式" min-width="8%" />
            <el-table-column prop="purchasePrice" label="采购金额" min-width="10%" />
            <el-table-column prop="purchaseStatusDesc" label="采购状态" min-width="10%" />
            <el-table-column prop="reservedPhone" label="预留手机号" min-width="10%" />
            <el-table-column prop="createrDesc" label="采购人" min-width="10%" />
            <el-table-column prop="orderDate" label="采购时间" min-width="16%" />
            <!-- <el-table-column label="操作" fixed="right" width="100" min-width="10%">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="purchaseOrderDetail(scope.row)">详情</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-col>
      </el-card>
      <el-card v-if="afterSaleApplies && afterSaleApplies.length>0" class="info">
        <div slot="header" class="info-header">
          <!-- <i class="iconfont">&#xe622;</i> -->
          <svg-icon icon-class="lianxishouhou" />
          <span class="titlecss">售后信息</span>
        </div>
        <el-table :data="afterSaleApplies">
          <el-table-column prop="afterSaleNo" label="售后单号" min-width="16%"/>
          <el-table-column prop="typeDesc" label="售后类型" min-width="16%">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                width="400"
                trigger="hover"
                :content="scope.row.typeDesc"
              >
                <el-link
                  slot="reference"
                  style="margin-left:3px"
                >{{ scope.row.typeDesc|ellipsis }}</el-link>
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
                >{{ scope.row.desc?scope.row.desc.length <= 10?scope.row.desc:scope.row.desc.substring(0,10)+'...':'' }}</el-link>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="statusDesc" label="处理状态" min-width="16%"/>
          <el-table-column prop="applyTime" label="申请时间" min-width="16%"/>
        </el-table>


 <el-card v-if="refundApplyOrders && refundApplyOrders.length>0" class="info" shadow="never">
        <!-- <div slot="header" class="info-header"> -->
          <!-- <i class="iconfont">&#xe66b;</i> -->
          <!-- <svg-icon icon-class="tuikuan" />
          <span class="titlecss">退款信息</span>
        </div> -->
        <el-collapse value="search">
            <el-collapse-item name="search1">
              <span slot="title" class="collapse-title">退款信息</span>
              <div class="filter-container">
            <el-table :data="refundApplyOrders">
              <el-table-column prop="refundNo" label="退款单号" min-width="10%" />
              <el-table-column prop="refundAmount" label="退款金额" min-width="10%" />
              <el-table-column prop="refundTypeDesc" label="退款类型" min-width="10%" />
              <el-table-column prop="refundWayDesc" label="退款方式" min-width="10%" />
              <el-table-column prop="refundReasonDesc" label="退款原因" min-width="10%" />
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

              <el-table-column label="退款状态" min-width="11%">
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
              <!-- <el-table-column prop="modifierDesc" label="操作人" /> -->
              <el-table-column prop="applyTime" label="申请时间" min-width="12%" />
              <el-table-column prop="auditUserName" label="审核人" min-width="11%" />

            </el-table>
        </div>
      </el-collapse-item>
      </el-collapse>
      </el-card>

        <el-card size="mini" class="info" shadow="never" >
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
            <el-table-column prop="desc" label="售后跟踪" min-width="12%">
              <template slot-scope="scope">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  width="450"
                  :content="scope.row.desc"
                >
                  <el-link
                    slot="reference"
                  >{{ scope.row.desc?scope.row.desc.length <= 10?scope.row.desc:scope.row.desc.substring(0,10)+'...':'' }}</el-link>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="callTypeDesc" label="呼叫类型" min-width="12%"/>
            <el-table-column prop="phone" label="来/去电电话" min-width="12%"/>
            <el-table-column prop="source" label="电话来源" min-width="12%">
              <template slot-scope="scope">{{ scope.sourceDesc?scope.sourceDesc:'未知' }}</template>
            </el-table-column>
            <el-table-column prop="staffName" label="记录人" min-width="10%"/>
            <el-table-column prop="createTime" label="记录时间" min-width="12%"/>
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
              <el-col :underline="false">{{ PurchaseOrder.payTypeDesc }}/{{ PurchaseOrder.payAccount }}</el-col>
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
    </el-col>
  </div>
</template>

<script>
import {
  GetOrder,
  GetOrderLogs,
  PurchaseFail,
  PurchaseOrderFromPlatform,
  TurnToManual,
  SuspendPurchase,
  AddLog
} from '@/api/order/order'
import moment from 'moment'
import permission from '@/directive/permission'
import {
  mapGetters
} from 'vuex'
export default {
  filters: {
    dateToStr(date) {
      return moment(date).format('YYYY-MM-DD')
    },
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 8) {
        return value.slice(0,8) + '...'
      }
      return value
    }
  },
  directives: {
    permission
  },
  data() {
    return {
      //orderAmount1:'',
      Order: {},
      PurchaseOrder: {},
      checkInOrders: [],
      paymentOrders: [],
      purchaseOrders: [],
      afterSaleApplies: [],
      refundApplyOrders: [],
      afterSaleRecords: [],
      orderLogs: [],
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
      OrderPurchaseStatusEnum: {
        PurchaseFail: 20,
        ConfirmFail: 40
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
      platform: [
        {
          text: '美团',
          value: 5
        },
        {
          text: '携程',
          value: 10
        },
        {
          text: '携程代订',
          value: 8
        },
        {
          text: '艺龙',
          value: 20
        },
        {
          text: '去哪儿',
          value: 30
        },
        {
          text: '美团分销',
          value: 6
        },
        {
          text: '携程分销',
          value: 9
        },
        {
          text: '携程商旅',
          value: 7
        },
        {
          text: '同程',
          value: 40
        },
        {
          text: '飞猪',
          value: 50
        },
        {
          text: '线下',
          value: 60
        },
        {
          text: '其他',
          value: 100
        }
      ],
      payType: [
        {
          text: '微信',
          value: 1
        },
        {
          text: '支付宝',
          value: 5
        },
        {
          text: '云闪付',
          value: 20
        },
        {
          text: '百度钱包',
          value: 30
        },
        {
          text: '信用卡',
          value: 40
        },
        {
          text: '接口支付',
          value: 60
        },
        {
          text: '银行卡',
          value: 70
        },
        {
          text: '其他',
          value: 100
        }
      ],
      purChaseAccountType: [
        {
          text: '新账号',
          value: 1
        },
        {
          text: '老账号',
          value: 5
        },
        {
          text: '超级会员',
          value: 10
        },
        {
          text: '银卡会员',
          value: 15
        },
        {
          text: '黄金会员',
          value: 20
        },
        {
          text: '白金会员',
          value: 25
        },
        {
          text: '其他',
          value: 100
        }
      ],
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
        AUDINGING: 1,
        REJECT: 2,
        AUDITPASS: 3,
        WAITREFUND: 4
      },
      LockEnum: {
        NoLock: 0,
        Lock: 1
      },
      purchaseMethodEnum: {
        SYSTEM: 1,
        MANNAL: 2
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
        const code = res.code
        if(code!==0){
          this.$alert('请返回重试', '订单查询失败', {
          confirmButtonText: '确定',
          type: 'error',
          callback: action => {
            this.$router.push({
              path: '/allorder/list'
            })
          }
        })
        loading.close()
        return false
        }
        this.Order = res.data
        //this.orderAmount1 = parseFloat(this.Order.orderAmount*0.94).toFixed(2)
        // 入住人
        var checkInName = this.Order.checkInName.split(',')
        for (var i = 1; i <= checkInName.length; i++) {
          const checkInOrder = { ...this.Order}
          checkInOrder.roomCount = 1
          checkInOrder.checkInName = checkInName[i - 1]
          this.checkInOrders.push(checkInOrder)
        }

        // 支付单
        this.paymentOrders = this.Order.paymentOrders
        this.paymentOrders.forEach((item,index)=>{
          if(item.paymentType === 80){
            item.paymentTypeDesc = "优惠券"
          }
          if(item.paymentType===100){
            item.paymentTypeDesc="折扣"
          }
        })

        // 采购单
        this.purchaseOrders = this.Order.purchaseOrders
        this.purchaseOrders.forEach((item,index)=>{
          if(item.payType===60){
            item.purchasePrice = item.purchasePrice + '/' + parseFloat(item.purchasePrice*0.96).toFixed(2)
          }
        })

        // 退款单
        this.refundApplyOrders = this.Order.refundApplyOrders

        // 售后单
        this.afterSaleApplies = this.Order.afterSaleApplies
        if (this.afterSaleApplies[0]) {
          this.afterSaleRecords = this.afterSaleApplies[0].afterSaleRecords
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

        this.fetchOrderLog()

        loading.close()
      })
    },
    fetchOrderLog() {
      const orderNo = this.Order.orderNo
      GetOrderLogs(orderNo).then(res => {
        this.orderLogs = res.data
      })
    },
    purchaseOrderDetail(purchaseOrder) {
      AddLog(this.Order.orderNo, purchaseOrder.purchaseNo, 'purchaseDetailView')
      this.PurchaseOrder = purchaseOrder
      this.purchaseFormVisiable = true
    },
    rePurchase() {
      this.$confirm('确定要系统重新采购?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        PurchaseOrderFromPlatform(this.Order.orderNo).then(res => {
          if (res.data) {
            this.fetchOrder()
            this.$message({
              type: 'info',
              message: '提交成功，系统正在重新采购'
            })
          } else {
            this.$message.error('提交系统重新采购失败')
          }
        })
      })
    },
    suspendPurchase() {
      this.$confirm('确定要中止系统采购吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        SuspendPurchase(this.Order.orderNo).then(res => {
          if (res.data) {
            this.fetchOrder()
            this.$message({
              type: 'info',
              message: '已中止系统采购'
            })
          } else {
            this.$message.error('中止系统采购失败')
          }
        })
      })
    },
    turnToManual() {
      this.$confirm('确定要转人工采购?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const orderNo = this.Order.orderNo
        TurnToManual(orderNo).then(res => {
          if (res.data) {
            this.fetchOrder()
            this.$message({
              message: '订单已转人工处理',
              type: 'info'
            })
          } else {
            this.$message.error('订单转人工失败')
          }
        })
      })
    },
    purchaseFail(purchaseOrderNo) {
      this.$confirm('确定要中止采购?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        PurchaseFail(purchaseOrderNo).then(res => {
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
      })
    },
    dateTimeToDate(val) {
      return moment(val).format('YYYY-MM-DD')
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
    }
  }
}

// import {
//   GetOrder,
//   ConfirmOrder,
//   RejectOrder,
//   LockOrder,
//   UnlockOrder,
//   GetOrderLogs,
//   PurchaseRequest,
//   Purchase,
//   PurchaseOrderFromPlatform,
//   PurchaseFail
// } from '@/api/order/order'
// import {
//   ApplyRefound,
//   CancelRefoundApply
// } from '@/api/refund/refund'
// import moment from 'moment'
// import {
//   mapGetters
// } from 'vuex'
// export default {
//   data() {
//     return {
//       Order: {
//         paymentOrder: {},
//         refundApplyOrder: {},
//         purchaseOrder: {}
//       },
//       checkInOrders: [],
//       paymentOrders: [],
//       OrderStatusEnum: {
//         WaitPay: 2,
//         WaitConfirm: 4,
//         WaitIn: 5,
//         Service: 6,
//         Cancel: 12,
//         Done: 24
//       },
//       OrderRefundStatusEnum: {
//         ORIGINAL: 0,
//         SUBMIT: 2,
//         PROCESSING: 4,
//         COMPLETE: 6
//       },
//       RefundApplyOrderStatusEnum: {
//         CLOSE: -1,
//         SUBMIT: 2,
//         PROCESSING: 4,
//         COMPLETE: 6
//       },
//       OrderPaymentStatusEnum: {
//         WAITPAY: 0,
//         PAYSUCCESS: 2,
//         PAYFAILTURE: 4
//       },
//       OrderConfirmStatusEnum: {
//         CONFIRMSSUCCESS: 1,
//         CONFIRMFAIL: 2,
//         WAITCONFIRM: 0
//       },
//       OrderHandlerStatus: {
//         waitHandler: 0,
//         handling: 2,
//         success: 4,
//         fail: 8
//       },
//       RefundApplyOrderAuditStatus: {
//         ORIGINAL: 0,
//         PASS: 1,
//         REJECT: 2
//       },
//       LockEnum: {
//         NoLock: 0,
//         Lock: 1
//       },
//       showOpt: false,
//       orderSetp: 1,
//       refundSetp: 1,
//       orderPaymentSetpStatus: 'wait',
//       orderConfirmSetpStatus: 'wait',
//       orderCancelSetpStatus: 'wait',
//       orderComplateSetpStatus: 'wait',
//       refundFormVisiable: false,
//       Refund: {
//         refundCount: 1,
//         refundDays: 1,
//         refundDate: []
//       },
//       RefundTypeEnum: {
//         ORIGINAL: 0
//       },
//       RefundReason: [{
//         value: 1,
//         text: '平台'
//       },
//       {
//         value: 2,
//         text: '酒店'
//       }
//       ],
//       orderLogs: [],
//       // 退款
//       refundRequestVisiable: false,
//       canRefundDates: [],
//       purchaseFormVisiable: false,
//       PurchaseOrder: {

//       }
//     }
//   },
//   computed: {
//     ...mapGetters([
//       'sysUser'
//     ])
//   },
//   created() {
//     this.init()
//   },
//   methods: {
//     init() {
//       if (this.getUrlParams()) {
//         this.fetchOrder()
//       }
//     },
//     getUrlParams() {
//       const query = this.$route.query
//       if (!query || !query.orderNo) {
//         this.$alert('请返回重试', '订单查询失败', {
//           confirmButtonText: '确定',
//           type: 'error',
//           callback: action => {
//             this.$router.push({
//               path: '/supply/orderlist'
//             })
//           }
//         })
//         return false
//       }
//       this.Order.orderNo = query.orderNo
//       return true
//     },
//     fetchOrder() {
//       this.checkInOrders = []
//       this.paymentOrders = []

//       const loading = this.$loading({
//         lock: true,
//         text: '正在加载订单',
//         spinner: 'el-icon-loading',
//         background: 'rgba(0, 0, 0, 0.7)'
//       })
//       GetOrder(this.Order.orderNo).then(res => {
//         const order = res.data
//         if (order.orderStatus === this.OrderStatusEnum.WaitConfirm ||
//             order.orderStatus === this.OrderStatusEnum.Service) {
//           if (order.isLock && order.isLock === this.LockEnum.Lock) {
//             if (order.lockUserId === this.sysUser.userId) {
//               this.showOpt = true

//               this.lunchOrder(order)
//             } else {
//               this.$confirm('当前订单已被<strong style="color:red;font-size:large">' + order.lockUserName +
//                   '</strong>锁定,是否解锁并重新锁定', '提示', {
//                 confirmButtonText: '锁定',
//                 cancelButtonText: '不锁定',
//                 type: 'warning',
//                 showClose: false,
//                 closeOnClickModal: false,
//                 closeOnPressEscape: false,
//                 dangerouslyUseHTMLString: true
//               }).then(() => {
//                 this.lockOrder(order)
//               }).catch(action => {
//                 this.lunchOrder(order)
//               })
//             }
//           } else {
//             this.$confirm('是否锁定订单,订单不锁定将只能查看无法操作', '提示', {
//               confirmButtonText: '锁定',
//               cancelButtonText: '不锁定',
//               type: 'warning',
//               showClose: false,
//               closeOnClickModal: false,
//               closeOnPressEscape: false
//             }).then(() => {
//               this.lockOrder(order)
//             }).catch(action => {
//               this.lunchOrder(order)
//             })
//           }
//         } else {
//           this.lunchOrder(order)

//           this.showOpt = true
//         }

//         loading.close()
//       })
//     },
//     unlockOrder() {
//       const loading = this.$loading({
//         lock: true,
//         text: '正在解锁订单',
//         spinner: 'el-icon-loading',
//         background: 'rgba(0, 0, 0, 0.7)'
//       })

//       UnlockOrder(this.Order.orderNo).then(res => {
//         if (res.data) {
//           this.showOpt = false

//           this.Order.isLock = this.LockEnum.NoLock

//           this.$message('订单解锁成功')
//         } else {
//           this.$message('订单解锁失败,请刷新重试')
//         }

//         loading.close()
//       })
//     },
//     lockOrder(order) {
//       const loading = this.$loading({
//         lock: true,
//         text: '正在锁定订单',
//         spinner: 'el-icon-loading',
//         background: 'rgba(0, 0, 0, 0.7)'
//       })

//       LockOrder(order.orderNo).then(res => {
//         if (res.data) {
//           order.isLock = this.LockEnum.Lock

//           this.showOpt = true

//           this.lunchOrder(order)
//         } else {
//           this.$message('订单锁定失败,请刷新重试')
//         }
//         loading.close()
//       })
//     },
//     lunchOrder(order) {
//       this.Order = order

//       var checkInName = this.Order.checkInName.split(',')
//       for (var i = 1; i <= checkInName.length; i++) {
//         const checkInOrder = { ...this.Order
//         }
//         checkInOrder.roomCount = 1
//         checkInOrder.checkInName = checkInName[i - 1]
//         this.checkInOrders.push(checkInOrder)
//       }

//       // 支付单流程
//       switch (this.Order.paymentStatus) {
//         case this.OrderPaymentStatusEnum.WAITPAY:
//           this.orderPaymentSetpStatus = 'process'
//           this.Order.paymentOrder = {}
//           break
//         case this.OrderPaymentStatusEnum.PAYSUCCESS:
//           this.orderPaymentSetpStatus = 'success'

//           this.orderSetp = 2
//           if (this.Order.paymentOrder) {
//             this.paymentOrders.push(this.Order.paymentOrder)
//           }
//           break
//         case this.OrderPaymentStatusEnum.PAYFAILTURE:
//           this.orderPaymentSetpStatus = 'error'
//           this.Order.paymentOrder = {}
//           break
//       }

//       // 订单确认流程
//       switch (this.Order.confirmStatus) {
//         case this.OrderConfirmStatusEnum.CONFIRMSSUCCESS:
//           this.orderSetp = 3
//           this.orderConfirmSetpStatus = 'success'
//           break
//         case this.OrderConfirmStatusEnum.CONFIRMFAIL:
//           this.orderConfirmSetpStatus = 'error'
//           break
//         case this.OrderConfirmStatusEnum.WAITCONFIRM:
//           switch (this.Order.paymentStatus) {
//             case this.OrderPaymentStatusEnum.WAITPAY:
//             case this.OrderPaymentStatusEnum.PAYFAILTURE:
//               this.orderConfirmSetpStatus = 'wait'
//               break
//             case this.OrderPaymentStatusEnum.PAYSUCCESS:
//               this.orderConfirmSetpStatus = 'process'
//               break
//           }
//           break
//       }

//       // 退款流程
//       switch (this.Order.refundStatus) {
//         case this.OrderRefundStatusEnum.ORIGINAL:
//           this.Order.refundApplyOrder = {}
//           break
//         case this.OrderRefundStatusEnum.PROCESSING:
//           this.refundSetp = 3

//           this.orderSetp = 3
//           if (this.Order.confirmStatus !== this.OrderConfirmStatusEnum.WAITCONFIRM) {
//             this.orderSetp = 4
//           }
//           break
//         case this.OrderRefundStatusEnum.COMPLETE:
//           this.refundSetp = 4

//           if (this.Order.confirmStatus === this.OrderConfirmStatusEnum.WAITCONFIRM) {
//             this.orderSetp = 4
//           } else {
//             this.orderSetp = 5
//           }
//           break
//         case this.RefundApplyOrderStatusEnum.CLOSE:
//           this.refundSetp = 4
//           break
//       }

//       switch (this.Order.orderStatus) {
//         case this.OrderStatusEnum.Done:
//           this.orderSetp = 5
//           this.orderComplateSetpStatus = 'success'
//           break
//         case this.OrderStatusEnum.Cancel:
//           this.orderPaymentSetpStatus = 'error'
//           this.orderCancelSetpStatus = 'success'
//           break
//       }

//       // 订单处理流程
//       if (this.Order.orderHandleStatus === this.OrderHandlerStatus.handling ||
//           this.Order.orderHandleStatus === this.OrderHandlerStatus.success ||
//           this.Order.orderHandleStatus === this.OrderHandlerStatus.fail) {
//         this.orderSetp = 3
//       }

//       // 订单确认流程
//       switch (this.Order.confirmStatus) {
//         case this.OrderConfirmStatusEnum.CONFIRMSSUCCESS:
//           this.orderConfirmSetpStatus = 'success'
//           break
//         case this.OrderConfirmStatusEnum.CONFIRMFAIL:
//           this.orderConfirmSetpStatus = 'error'
//           break
//         case this.OrderConfirmStatusEnum.WAITCONFIRM:
//           this.orderConfirmSetpStatus = 'process'
//           break
//       }

//       // 支付单流程
//       if (this.Order.orderStatus >= this.OrderStatusEnum.WaitConfirm) {
//         this.orderSetp = 2
//         if (this.Order.paymentOrder) {
//           this.paymentOrders.push(this.Order.paymentOrder)
//         }
//       }
//       if (!this.Order.paymentOrder) {
//         this.Order.paymentOrder = {}
//       }

//       // 退款流程
//       if (!this.Order.refundApplyOrder) {
//         this.Order.refundApplyOrder = {}
//       }
//       if (this.Order.refundStatus !== this.OrderRefundStatusEnum.ORIGINAL) {
//         this.orderSetp = 3
//         this.refundSetp = 2
//       }
//       if (this.Order.refundStatus === this.OrderRefundStatusEnum.PROCESSING) {
//         if (this.Order.confirmStatus !== this.OrderConfirmStatusEnum.WAITCONFIRM) {
//           this.orderSetp = 4
//         }
//         this.refundSetp = 3
//       }
//       if (this.Order.refundStatus === this.OrderRefundStatusEnum.COMPLETE) {
//         if (this.Order.confirmStatus !== this.OrderConfirmStatusEnum.WAITCONFIRM) {
//           this.orderSetp = 5
//         } else {
//           this.orderSetp = 4
//         }

//         this.refundSetp = 4
//       }
//       if (this.Order.refundApplyOrder.refundStatus === this.RefundApplyOrderStatusEnum.CLOSE) {
//         this.refundSetp = 4
//       }
//     },
//     fetchOrderLog() {
//       const orderNo = this.Order.orderNo
//       GetOrderLogs(orderNo).then(res => {
//         this.orderLogs = res.data
//       })
//     },
//     lunchRefund() {
//       this.getCanRefundDate()

//       this.Refund.orderNo = this.Order.orderNo
//       this.Refund.paymentOrderNo = this.Order.paymentOrder.paymentNo
//       this.Refund.refundType = this.RefundTypeEnum.ORIGINAL
//       this.Refund.refundAmount = this.Order.orderAmount

//       this.refundRequestVisiable = true
//     },
//     getCanRefundDate() {
//       this.canRefundDates = []

//       // 如果只有一天
//       const today = moment(moment().format('YYYY-MM-DD'))
//       if (this.Order.bookingDays === 1) {
//         const checkInDate = moment(moment(this.Order.checkInDate).format('YYYY-MM-DD'))
//         if (checkInDate > today) {
//           this.canRefundDates.push(today.format('YYYY-MM-DD'))
//           return
//         }
//       }

//       for (let dayIndex = 1; dayIndex < this.Order.bookingDays; dayIndex++) {
//         const checkInDate = moment(moment(this.Order.checkInDate).format('YYYY-MM-DD'))
//         const checkDate = checkInDate.add(dayIndex, 'day')

//         if (checkDate > today) {
//           this.canRefundDates.push(checkDate.format('YYYY-MM-DD'))
//         }
//       }
//     },
//     applyRefound() {
//       this.Refund.orderNo = this.Order.orderNo
//       this.Refund.paymentOrderNo = this.Order.paymentOrder.paymentNo
//       this.Refund.refundType = this.RefundTypeEnum.ORIGINAL
//       this.Refund.refundAmount = this.Order.orderAmount

//       this.refundFormVisiable = true
//     },
//     cancelRefoundApply() {
//       this.$confirm('确定要取消退款申请吗？', '确认提示', {
//         distinguishCancelAndClose: true,
//         confirmButtonText: '确定',
//         cancelButtonText: '取消',
//         type: 'info'
//       })
//         .then(() => {
//           const refundNo = this.Order.refundApplyOrder.refundNo
//           CancelRefoundApply(refundNo).then(res => {
//             if (res.data) {
//               this.fetchOrder()
//               this.$message({
//                 type: 'success',
//                 message: '取消退款申请成功'
//               })
//             } else {
//               this.$message({
//                 type: 'error',
//                 message: '取消退款申请失败'
//               })
//             }
//           })
//         })
//         .catch(action => {

//         })
//     },
//     submitRefund() {
//       const param = this.Refund
//       ApplyRefound(param).then(res => {
//         if (res.data) {
//           this.fetchOrder()

//           this.Refund = {}
//           this.refundFormVisiable = false
//           this.$message({
//             type: 'success',
//             message: '退款申请成功'
//           })
//         } else {
//           this.$message({
//             type: 'error',
//             message: '退款申请失败'
//           })
//         }
//       })
//     },
//     confirmOrder() {
//       this.$confirm('是否要确认订单?', '提示', {
//         confirmButtonText: '已确认',
//         cancelButtonText: '取消',
//         type: 'warning'
//       }).then(() => {
//         const orderNo = this.Order.orderNo
//         ConfirmOrder(orderNo).then(res => {
//           if (res.data) {
//             this.fetchOrder()
//             this.$message({
//               message: '订单确认成功',
//               type: 'success'
//             })
//           } else {
//             this.$message.error('订单确认失败')
//           }
//         })
//       }).catch(() => {})
//     },
//     rejectOrder() {
//       this.$confirm('确定要拒单吗?', '提示', {
//         confirmButtonText: '确定',
//         cancelButtonText: '取消',
//         type: 'warning'
//       }).then(() => {
//         const orderNo = this.Order.orderNo
//         RejectOrder(orderNo).then(res => {
//           if (res.data) {
//             this.fetchOrder()
//             this.$message({
//               message: '拒单成功',
//               type: 'success'
//             })
//           } else {
//             this.$message.error('拒单失败')
//           }
//         })
//       }).catch(() => {})
//     },
//     dateTimeToDate(val) {
//       return moment(val).format('YYYY-MM-DD')
//     },
//     lunchPurchase() {
//       this.$confirm('确定要手动采购?', '提示', {
//         confirmButtonText: '确定',
//         cancelButtonText: '取消',
//         type: 'warning'
//       }).then(() => {
//         PurchaseRequest(this.Order.orderNo).then(res => {
//           if (res.data) {
//             this.purchaseFormVisiable = true
//           } else {
//             this.$message({
//               type: 'error',
//               message: res.message
//             })
//           }
//         })
//       }).catch(() => {})
//     },
//     submitPurchase() {
//       var data = { ...this.PurchaseOrder,
//         orderNo: this.Order.orderNo
//       }
//       Purchase(data).then(res => {
//         if (res.data) {
//           this.purchaseFormVisiable = false
//           this.PurchaseOrder = {}
//           this.fetchOrder()
//           this.$message({
//             message: '订单采购成功',
//             type: 'info'
//           })
//         } else {
//           this.$message.error('订单确认失败')
//         }
//       })
//     },
//     rePurchase() {
//       this.$confirm('确定要系统重新采购?', '提示', {
//         confirmButtonText: '确定',
//         cancelButtonText: '取消',
//         type: 'warning'
//       }).then(() => {
//         PurchaseOrderFromPlatform(this.Order.orderNo).then(res => {
//           this.fetchOrder()
//           this.$message({
//             type: 'info',
//             message: '提交成功，系统正在重新采购'
//           })
//         })
//       }).catch(() => {})
//     },
//     purchaseFail() {
//       PurchaseFail(this.Order.purchaseOrder.purchaseOrderNo).then(res => {
//         if (res.data) {
//           this.fetchOrder()
//           this.$message({
//             message: '订单采购状态设置成功',
//             type: 'info'
//           })
//         } else {
//           this.$message.error('订单采购状态设置失败')
//         }
//       })
//     }
//   }
// }
</script>

<style scoped>
  .info {
    margin: 15px;
  }
::v-deep .el-card__header {
  padding: 0;
  border-bottom: none;
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

  ::v-deep .el-card__header {
  padding: 0;
  border-bottom: none;
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
::v-deep .el-card__body {
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

  .purchase-order-info{
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
::v-deep .el-table__body td {
  text-align: center;
}
::v-deep .el-table th {
    background: #ffffff;
    opacity: 1;
}
.left-align {
  font-size: 13px;
}
.text-right{
    font-size: 13px;
  text-align: right;
}
::v-deep .el-table th{
  border-right:0
}
	::v-deep .el-table th.el-table__cell{
  background-color: #fff ;
}
</style>

