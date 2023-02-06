/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
<template>
	<div v-show="Order.orderStatus" class="content">
		<el-col :xl="4" :lg="2"><br></el-col>
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
						<el-row v-if="Order.thirdOrderNo&&Order.thirdOrderNo.length>0">
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
									<el-link slot="reference" :underline="false"
										style="border-bottom:1px dashed #ccc;color: #b40000;">
										{{ Order.orderAmount }}/{{ Order.orderBasePrice }}
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
						<el-steps v-if="Order.orderStatus !== OrderStatusEnum.CANCEL" :active="orderSetp" :space="300"
							finish-status="finish" align-center style="margin-bottom:30px">
							<el-step title="下单" icon="el-icon-user-solid" :description="Order.orderDate" />
							<el-step :title="Order.paymentStatusDesc" icon="el-icon-bank-card"
								:description="Order.payTime" />
							<el-step v-if="Order.orderStatus !== OrderStatusEnum.CANCEL"
								:title="getOrderBookingStatus(Order)" icon="el-icon-shopping-cart-2"
								:description="Order.reserveingTime" />
							<!-- <el-step v-if="Order.orderStatus !== OrderStatusEnum.CANCEL && Order.orderStatus !== OrderStatusEnum.RESERVEFAIL" title="已确认" icon="el-icon-shopping-cart-full" :description="Order.confirmTime" /> -->
							<el-step
								v-if="Order.orderStatus !== OrderStatusEnum.CANCEL && Order.orderStatus !== OrderStatusEnum.RESERVEFAIL && Order.orderStatus !== OrderStatusEnum.WAITIN_REFUND"
								title="消费" icon="el-icon-office-building" :description="Order.consumeTime" />
							<el-step
								v-if="Order.orderStatus === OrderStatusEnum.WAITIN_REFUND || Order.orderStatus === OrderStatusEnum.RESERVEFAIL"
								:title="getOrderRefundStatus(Order)" icon="el-icon-wallet"
								:description="Order.refundTime" />
							<!-- <el-step v-if="Order.orderStatus === OrderStatusEnum.CANCEL" title="取消" icon="el-icon-s-promotion" :description="Order.cancelTime" />
          <el-step v-if="Order.orderStatus === OrderStatusEnum.CANCEL" :title="getOrderRefundStatus(Order)" icon="el-icon-wallet" :description="Order.refundTime" /> -->
						</el-steps>
						<el-steps v-else :active="orderSetp" :space="300" finish-status="finish" align-center
							style="margin-bottom:30px">
							<el-step title="下单" icon="el-icon-user-solid" :description="Order.orderDate" />
							<el-step :title="Order.paymentStatusDesc" icon="el-icon-bank-card"
								:description="Order.payTime" />
							<el-step v-if="Order.orderStatus === OrderStatusEnum.CANCEL" title="取消"
								icon="el-icon-s-promotion" :description="Order.cancelTime" />
							<el-step
								v-if="Order.orderStatus === OrderStatusEnum.CANCEL && Order.paymentStatus === OrderPaymentStatusEnum.PAYSUCCESS"
								:title="getOrderRefundStatus(Order)" icon="el-icon-wallet"
								:description="Order.refundTime" />
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
						<!-- <el-table-column prop="city" label="城市" min-width="7%" >
              <template slot-scope="scope">
                {{scope.row.city}}
              </template>
            </el-table-column> -->
						<el-table-column prop="hotelAddress" label="酒店地址" min-width="15%">
							<template slot-scope="scope">
								<div style="text-align:center">
									{{scope.row.city}}&nbsp
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
									【{{ scope.row.bedTypeName }}&nbsp{{ scope.row.windowDesc }}&nbsp{{ scope.row.breakFastDesc }}】
								</div>
							</template>
						</el-table-column>
						<el-table-column label="间/夜" min-width="6%">
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
						<el-table-column prop="checkInName" label="入住人" min-width="7%">
							<template slot-scope="scope">
								<div style="text-align:center;color: #b40000;">
									{{ scope.row.checkInName }}
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="checkInPhone" label="入住人电话" min-width="10%" />
						<el-table-column prop="arrivalTime" label="预计到店" min-width="8%" />
					</el-table>
				</el-col>
			</el-card>

			<el-card v-if="paymentOrders && paymentOrders.length>0" class="info" shadow="never">
				<div slot="header" class="info-header">
					<svg-icon icon-class="zhifufangshi" />
					<span class="titlecss">
						支付信息
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

			<el-card v-if="purchaseOrders && purchaseOrders.length>0" class="info" :span="10" shadow="never">
				<div slot="header" class="info-header">
					<svg-icon icon-class="gouwuchezhengpin" />
					<span class="titlecss">采购信息</span>
					<!-- <div class="opt">
            <el-button v-if="(Order.orderStatus == OrderStatusEnum.WAITCONFIRM || Order.orderStatus === OrderStatusEnum.CANCEL || Order.orderStatus == OrderStatusEnum.RESERVEING) && (purchaseOrders.every(x=> { return x.purchaseStatus == PurchaseStatusEnum.PurchaseFail || x.purchaseStatus == PurchaseStatusEnum.ConfirmFail || x.purchaseStatus == PurchaseStatusEnum.Refunds } ))" ref="new" v-permission="['CreatePurchaseOrder']" style="margin-right:2rem" size="mini" icon="el-icon-plus" type="primary" @click="purchaseOrderDetail()">新建采购单</el-button>
          </div> -->
				</div>
				<el-col :span="24">
					<el-table :data="purchaseOrders" ref="purchaseOrdersFrom">
						<el-table-column label="采购单号" min-width="7%">
							<template slot-scope="scope">
								<el-link style="cursor: pointer;border-bottom:1px dashed #ccc"
									@click="purchaseOrderDetail(scope.row)">{{ scope.row.purchaseNo }}
									<el-link />
								</el-link>
							</template>
						</el-table-column>
						<el-table-column prop="platformOrderNo" label="采购平台号" min-width="10%" />
						<el-table-column prop="platform" label="采购平台" min-width="7%" />
						<el-table-column prop="purchaseMethodDesc" label="采购方式" min-width="6%" />
						<!-- <el-table-column label="采购账号信息">
          <template slot-scope="scope">
            <i>{{ scope.row.purChaseAccount }}/{{ scope.row.purChasePwd }}</i>
          </template>
        </el-table-column> -->
						<el-table-column prop="payTypeDesc" label="支付方式" min-width="6%" />
						<el-table-column prop="purchasePrice" label="采购金额" min-width="6%" />
						<el-table-column prop="purchaseStatusDesc" label="采购状态" min-width="8%" />
						<el-table-column prop="reservedPhone" label="预留电话" min-width="10%" />
						<el-table-column prop="createrDesc" label="采购人" min-width="6%" />
						<el-table-column prop="orderDate" label="采购时间" min-width="11%" />
						<el-table-column label="操作" fixed="right" min-width="20%" v-if="!Lookdisabled">
							<template slot-scope="scope">
								<!-- <el-button ref="detail" type="primary" size="mini" @click="purchaseOrderDetail(scope.row,true);">详情</el-button> -->
								<el-button style="margin-bottom: 5px;"
									v-if="scope.row.purchaseMethod === purchaseMethodEnum.MANNAL"
									v-permission="['PurchaseSuccess']"
									:disabled="!((Order.orderStatus === OrderStatusEnum.RESERVEING || Order.orderStatus === OrderStatusEnum.WAITCONFIRM) && scope.row.purchaseStatus === PurchaseStatusEnum.Purchasing)"
									:type="(Order.orderStatus === OrderStatusEnum.RESERVEING || Order.orderStatus === OrderStatusEnum.WAITCONFIRM) && scope.row.purchaseStatus === PurchaseStatusEnum.Purchasing?'success':'info'"
									size="mini" @click="purchaseSuccess(scope.row.purchaseNo)">采购成功</el-button>
								<el-button v-if="scope.row.purchaseMethod === purchaseMethodEnum.MANNAL"
									v-permission="['PurchaseFail']"
									:disabled="!((Order.orderStatus === OrderStatusEnum.RESERVEING || Order.orderStatus === OrderStatusEnum.CANCEL || Order.orderStatus === OrderStatusEnum.WAITCONFIRM ) && scope.row.purchaseMethod === purchaseMethodEnum.MANNAL && (scope.row.purchaseStatus === PurchaseStatusEnum.Purchasing || scope.row.purchaseStatus === PurchaseStatusEnum.WaitConfirm ))"
									:type="(Order.orderStatus === OrderStatusEnum.RESERVEING || Order.orderStatus === OrderStatusEnum.CANCEL || Order.orderStatus === OrderStatusEnum.WAITCONFIRM ) && scope.row.purchaseMethod === purchaseMethodEnum.MANNAL && (scope.row.purchaseStatus === PurchaseStatusEnum.Purchasing || scope.row.purchaseStatus === PurchaseStatusEnum.WaitConfirm )?'primary':'info'"
									size="mini" @click="purchaseFail(scope.row.purchaseNo)">采购失败</el-button>
								<el-button v-if="scope.row.purchaseMethod === purchaseMethodEnum.MANNAL"
									v-permission="['PurchaseRefund']"
									:disabled="!(scope.row.purchaseStatus === PurchaseStatusEnum.ConfirmFail || scope.row.purchaseStatus === PurchaseStatusEnum.ConfirmSuccess || scope.row.purchaseStatus === PurchaseStatusEnum.PurchaseFail)"
									:type=" scope.row.purchaseStatus === PurchaseStatusEnum.ConfirmFail || scope.row.purchaseStatus === PurchaseStatusEnum.ConfirmSuccess || scope.row.purchaseStatus === PurchaseStatusEnum.PurchaseFail?'primary':'info'"
									size="mini" @click="purchaseRefund(scope.row.purchaseNo)">退款</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-col>
			</el-card>

			<el-card class="info" style="padding: 20px;">
				<!-- <div slot="header" class="info-header">
          <svg-icon style="float:right;margin:1rem" icon-class="guanbi" @click="cancelpur()" />
        </div> -->
				<el-form ref="purchaseForm" :model="PurchaseOrder" :rules="purchaseFormRules" inline size="small"
					label-width="120px"
					:disabled="PurchaseOrder.purchaseMethod === purchaseMethodEnum.SYSTEM || Lookdisabled">
					<el-row>
						<el-col :span="12">
							<el-form-item label="采购单号">
								<el-tag type="info" size="medium">
									{{ PurchaseOrder.purchaseNo }}
								</el-tag>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="采购状态">
								<el-tag type="success" size="medium">
									{{ PurchaseOrder.purchaseStatusDesc }}
								</el-tag>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="采购平台" prop="platformId">
								<el-select :popper-append-to-body="false" v-model="PurchaseOrder.platformId"
									placeholder="平台" size="small" style="width:100px">
									<el-option v-for="plat in platformId" :key="plat.value" :label="plat.text"
										:value="plat.value" />
								</el-select>
								<el-select :popper-append-to-body="false" v-model="PurchaseOrder.purChaseAccountType"
									placeholder="新/老账号" size="small" style="width:185px">
									<!-- <el-option label="新账号" :value="1" />
                <el-option label="老帐号" :value="5" /> -->
									<el-option v-for="accounttype in this.purChaseAccountType" :key="accounttype.value"
										:label="accounttype.text" :value="accounttype.value" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="采购金额" prop="purchasePrice">
								<el-input-number v-model="PurchaseOrder.purchasePrice" placeholder="金额"
									style="width:70%" :precision="2" :step="100" :max="100000" />
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="支付方式" prop="payAccount">
								<el-input v-model="PurchaseOrder.payAccount" placeholder="账号"
									style="background-color:#fff" maxlength="20" show-word-limit>
									<el-select :popper-append-to-body="false" slot="prepend"
										v-model="PurchaseOrder.payType" placeholder="请选择" style="width:100px">
										<!-- <el-option label="请选择" :value="0" />
                  <el-option label="银行卡" :value="6" /> -->
										<el-option v-for="ptype in this.payType" :key="ptype.value" :label="ptype.text"
											:value="ptype.value" />
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="预留手机号" prop="reservedPhone">
								<el-input v-model="PurchaseOrder.reservedPhone" style="width:135%" maxlength="11"
									placeholder="预留手机号" show-word-limit />
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="采购平台单号" prop="platformOrderNo">
								<el-input v-model="PurchaseOrder.platformOrderNo" style="width:155%"
									placeholder="采购平台单号" maxlength="20" show-word-limit />
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="采购账号/密码" prop="purchaseAccountInfo">
								<el-input v-model="PurchaseOrder.purchaseAccountInfo" style="width:135%"
									placeholder="采购账号/密码" maxlength="30" show-word-limit />
							</el-form-item>
						</el-col>
					</el-row>
					<!-- <el-row>
          <el-form-item label="采购状态">
            <el-radio-group v-model="PurchaseOrder.purchaseStatus">
              <el-radio :label="15">采购中</el-radio>
              <el-radio :label="30">待确认</el-radio>
              <el-radio :label="20">采购失败</el-radio>
              <el-radio :label="40">确认失败</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row> -->
					<el-row>
						<el-col :span="20">
							<el-form-item label="订单备注" prop="remark">
								<el-input v-model="PurchaseOrder.remark" type="textarea" :rows="9" placeholder="请输入采购描述"
									style="width:400%;" maxlength="500" show-word-limit />
							</el-form-item>
						</el-col>
						<el-col :offset="3" :gutter="20" :span="12">
							<div class="opt" v-if="!Lookdisabled">
								<!-- <el-button v-if="PurchaseOrder.purchaseMethod === purchaseMethodEnum.MANNAL && PurchaseOrder.staging === 0" type="primary" size="mini" @click="submitPurchase(0)">暂存</el-button> -->
								<!-- <el-button v-if="PurchaseOrder.purchaseMethod === purchaseMethodEnum.MANNAL" type="success" style="margin-right:10px" size="mini" @click="submitPurchase(1)">保存</el-button>
                <el-button ref="new" v-permission="['CreatePurchaseOrder']" :disabled="!((Order.orderStatus == OrderStatusEnum.WAITCONFIRM || Order.orderStatus === OrderStatusEnum.CANCEL || Order.orderStatus == OrderStatusEnum.RESERVEING) && (purchaseOrders.every(x=> { return x.purchaseStatus == PurchaseStatusEnum.PurchaseFail || x.purchaseStatus == PurchaseStatusEnum.ConfirmFail || x.purchaseStatus == PurchaseStatusEnum.Refunds } )))"  
                  style="margin-right:2rem" size="mini" icon="el-icon-plus" :type="(Order.orderStatus == OrderStatusEnum.WAITCONFIRM || Order.orderStatus === OrderStatusEnum.CANCEL || Order.orderStatus == OrderStatusEnum.RESERVEING) && (purchaseOrders.every(x=> { return x.purchaseStatus == PurchaseStatusEnum.PurchaseFail || x.purchaseStatus == PurchaseStatusEnum.ConfirmFail || x.purchaseStatus == PurchaseStatusEnum.Refunds } ))?'primary':'info'"  @click="purchaseOrderDetail()">新增</el-button> -->
								<!-- <el-button v-if="(Order.orderStatus == OrderStatusEnum.WAITCONFIRM || Order.orderStatus === OrderStatusEnum.CANCEL || Order.orderStatus == OrderStatusEnum.RESERVEING) && (purchaseOrders.every(x=> { return x.purchaseStatus == PurchaseStatusEnum.PurchaseFail || x.purchaseStatus == PurchaseStatusEnum.ConfirmFail || x.purchaseStatus == PurchaseStatusEnum.Refunds } ))" ref="new" v-permission="['CreatePurchaseOrder']" style="margin-right:2rem" size="mini" icon="el-icon-plus" :disabled="purchaseFormVisiable" :type="purchaseFormVisiable?'info':'primary'" @click="purchaseOrderDetail()">新增</el-button> -->
							</div>
						</el-col>
					</el-row>
				</el-form>
				<div class="opt" v-if="!Lookdisabled">
					<el-button v-if="PurchaseOrder.purchaseMethod === purchaseMethodEnum.MANNAL" type="success"
						style="margin-right:10px" size="mini" @click="submitPurchase(1)">保存</el-button>
					<el-button ref="new" v-permission="['CreatePurchaseOrder']"
						:disabled="!((Order.orderStatus == OrderStatusEnum.WAITCONFIRM || Order.orderStatus === OrderStatusEnum.CANCEL || Order.orderStatus == OrderStatusEnum.RESERVEING) && (purchaseOrders.every(x=> { return x.purchaseStatus == PurchaseStatusEnum.PurchaseFail || x.purchaseStatus == PurchaseStatusEnum.ConfirmFail || x.purchaseStatus == PurchaseStatusEnum.Refunds } )))"
						size="mini" icon="el-icon-plus"
						:type="(Order.orderStatus == OrderStatusEnum.WAITCONFIRM || Order.orderStatus === OrderStatusEnum.CANCEL || Order.orderStatus == OrderStatusEnum.RESERVEING) && (purchaseOrders.every(x=> { return x.purchaseStatus == PurchaseStatusEnum.PurchaseFail || x.purchaseStatus == PurchaseStatusEnum.ConfirmFail || x.purchaseStatus == PurchaseStatusEnum.Refunds } ))?'primary':'info'"
						@click="purchaseOrderDetail()">新增</el-button>
				</div>
				<el-divider />
			</el-card>

			<el-card v-if="afterSaleApplies && afterSaleApplies.length>0" class="info" shadow="never">
				<div slot="header" class="info-header">
					<!-- <i class="iconfont">&#xe622;</i> -->
					<svg-icon icon-class="lianxishouhou" />
					<span class="titlecss">售后信息</span>
				</div>

				<el-table :data="afterSaleApplies">
					<el-table-column prop="afterSaleNo" label="售后单号" min-width="16%" />
					<el-table-column prop="typeDesc" label="售后类型" min-width="16%">
						<template slot-scope="scope">
							<el-popover placement="top-start" width="400" trigger="hover" :content="scope.row.typeDesc">
								<el-link slot="reference" style="margin-left:3px">{{ scope.row.typeDesc|ellipsis }}
								</el-link>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="reasonDesc" label="售后原因" min-width="16%">
						<template slot-scope="scope">
							<el-popover placement="top-start" width="400" trigger="hover"
								:content="scope.row.reasonDesc">
								<el-link slot="reference" style="margin-left:3px">{{ scope.row.reasonDesc|ellipsis }}
								</el-link>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="desc" label="情况说明" min-width="16%">
						<template slot-scope="scope">
							<el-popover placement="top-start" trigger="hover" width="400" :content="scope.row.desc">
								<el-link slot="reference">
									{{ scope.row.desc?scope.row.desc.length <= 10?scope.row.desc:scope.row.desc.substring(0,10)+'...':'' }}
								</el-link>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="statusDesc" label="处理状态" min-width="16%" />
					<el-table-column prop="applyTime" label="申请时间" min-width="16%" />
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
					<el-table-column prop="refundDesc" label="问题描述" min-width="17%">
						<template slot-scope="scope">
							<el-popover placement="top-start" width="200" trigger="hover"
								:content="scope.row.refundDesc">
								<el-link slot="reference" style="margin-left:3px">{{ scope.row.refundDesc|ellipsis }}
								</el-link>
							</el-popover>
						</template>
					</el-table-column>

					<el-table-column label="退款状态" min-width="10%">
						<template slot-scope="scope">
							<el-popover v-if="scope.row && scope.row.refundStatus === refundApplyOrderStatus.REJECT"
								placement="top-start" width="200" trigger="hover" :content="scope.row.auditDesc">
								<el-link slot="reference" type="warning" style="margin-left:3px">
									{{ scope.row.refundStatusDesc }}</el-link>
							</el-popover>
							<el-col v-else style="margin-left:3px">{{ scope.row.refundStatusDesc }}</el-col>
						</template>
					</el-table-column>
					<el-table-column prop="modifierDesc" label="操作人" min-width="8%" />
					<el-table-column prop="auditUserName" label="审核人" min-width="8%" />
					<el-table-column prop="applyTime" label="申请时间" min-width="16%" />
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
								<el-popover placement="top-start" trigger="hover" width="450" :content="scope.row.desc">
									<el-link slot="reference">
										{{ scope.row.desc?scope.row.desc.length <= 10?scope.row.desc:scope.row.desc.substring(0,10)+'...':'' }}
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

	

			<div class="info">
				<div class="card-opt" v-if="!Lookdisabled">
					<span
						v-if="purchaseOrders.some(po=> po.purchaseMethod === purchaseMethodEnum.MANNAL && po.staging === StagingEnum.Submit)">
						<el-button v-permission="['RejectOrder']"
							:disabled="!((Order.orderStatus === OrderStatusEnum.RESERVEFAIL && !Order.hasOwnProperty('refundStatus')))"
							:type="(Order.orderStatus === OrderStatusEnum.RESERVEFAIL && !Order.hasOwnProperty('refundStatus'))?'danger':'info'"
							size="medium" @click="rejectOrder">拒单</el-button>
						<el-button v-permission="['BookingSuccess']"
							:disabled="!(Order.orderStatus === OrderStatusEnum.RESERVEING || Order.orderStatus === OrderStatusEnum.WAITCONFIRM)"
							:type="Order.orderStatus === OrderStatusEnum.RESERVEING || Order.orderStatus === OrderStatusEnum.WAITCONFIRM?'success':'info'"
							size="medium" @click="confirm">预订成功</el-button>
						<el-button v-permission="['BookingFail']"
							:disabled="!(Order.orderStatus === OrderStatusEnum.RESERVEING ||Order.orderStatus === OrderStatusEnum.WAITCONFIRM)"
							:type="Order.orderStatus === OrderStatusEnum.RESERVEING ||Order.orderStatus === OrderStatusEnum.WAITCONFIRM?'warning':'info'"
							size="medium" @click="confirmFail">预订失败</el-button>
				
					<!-- 订单状态等于预订成功，预定失败，已取消 无法点击-->
					<el-button
						:disabled="!(Order.orderStatus !== OrderStatusEnum.RESERVESUCCESS && Order.orderStatus !== OrderStatusEnum.RESERVEFAIL && Order.orderStatus !== OrderStatusEnum.WAITIN && Order.orderStatus !== OrderStatusEnum.WAITIN_REFUND)"
						:type="Order.orderStatus !== OrderStatusEnum.RESERVESUCCESS && Order.orderStatus !== OrderStatusEnum.RESERVEFAIL && Order.orderStatus !== OrderStatusEnum.WAITIN && Order.orderStatus !== OrderStatusEnum.WAITIN_REFUND && Order.orderStatus !== OrderStatusEnum.CANCEL?'primary':'info'"
						size="medium" @click="unlockOrder()">解锁订单</el-button>
			      	 <el-button
					    :disabled="(Order.rejectionStatus==OrderRejectEnum.WaitReject||Order.rejectionStatus==OrderRejectEnum.Rejected||Order.orderStatus == OrderStatusEnum.RESERVESUCCESS || Order.orderStatus == OrderStatusEnum.RESERVEFAIL ||Order.orderStatus == OrderStatusEnum.WAITIN || Order.orderStatus == OrderStatusEnum.WAITIN_REFUND)"
						:type="!(Order.rejectionStatus==OrderRejectEnum.WaitReject||Order.rejectionStatus==OrderRejectEnum.Rejected||Order.orderStatus == OrderStatusEnum.RESERVESUCCESS || Order.orderStatus == OrderStatusEnum.RESERVEFAIL ||Order.orderStatus == OrderStatusEnum.WAITIN || Order.orderStatus == OrderStatusEnum.WAITIN_REFUND)?'warning':'info'"
						size="medium" @click="waitReject">待拒单</el-button>
						</span>
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
		</el-col>
	</div>
</template>

<script>
	import {
		GetOrder,
		GetOrderLogs,
		PurchaseFail,
		PurchaseRefund,
		PurchaseOrderFromPlatform,
		LockOrder,
		UnlockOrder,
		Purchase,
		RejectOrder,
		ConfirmFail,
		WaitReject,
		ConfirmOrder,
		PurchaseSuccess,
		AddLog
	} from '@/api/order/order'
	import {
		RefundTrade
	} from '@/api/refund/refund'
	import {
		deepClone
	} from '@/utils'
	import permission from '@/directive/permission'
	import enumeration from '@/utils/enumeration'
	import moment from 'moment'
	import {
		mapGetters
	} from 'vuex'
	export default {
		filters: {
			dateToStr(date) {
				return moment(date).format('YYYY-MM-DD')
			},
			ellipsis(value) {
				if (!value) return ''
				if (value.length > 8) {
					return value.slice(0, 8) + '...'
				}
				return value
			}
		},
		directives: {
			permission
		},
		data() {
			return {
				// orderAmount1:'',
				Order: {},
				PurchaseOrder: {
					purchaseNo: '系统生成',
					purchaseStatusDesc: '初始',
					staging: 0,
					purchaseStatus: 15,
					purchaseMethod: 2
				},
				Lookdisabled: false,
				checkInOrders: [],
				paymentOrders: [],
				purchaseOrders: [],
				afterSaleApplies: [],
				refundApplyOrders: [],
				afterSaleRecords: [],
				orderLogs: [],
				orderSetp: 0,
				purchaseFormVisiable: true,
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
				OrderRejectEnum:{
                    WaitReject:1,
                    Rejected:2
				},
				platformId: [],
				purChaseAccountType: [],
				PurchaseStatusEnum: {
					Cancel: -10,
					// [Description("待采购")]
					WaitPurchase: 10,
					// [Description("采购中")]
					Purchasing: 15,
					// [Description("采购失败")]
					PurchaseFail: 20,
					// [Description("采购成功")]
					PurchaseSuccess: 25,
					// [Description("待确认")]
					WaitConfirm: 30,
					// [Description("确认中")]
					Confirming: 35,
					// [Description("确认失败")]
					ConfirmFail: 40,
					// [Description("已确认")]
					ConfirmSuccess: 45,
					// [Description("已退款")]
					Refunds: 50
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
				purchaseMethodEnum: {
					SYSTEM: 1,
					MANNAL: 2
				},
				LockEnum: {
					NoLock: 0,
					Lock: 1
				},
				StagingEnum: {
					Stating: 0,
					Submit: 1
				},
				purchaseFormRules: {
					// platformId: [
					//   { required: true, message: '请选择平台', trigger: 'blur' }
					// ],
					reservedPhone: [
						// { required: true, message: '请填写预留手机号', trigger: 'blur' },
						{
							min: 11,
							max: 11,
							message: '预留手机号长度应为11位数字',
							trigger: 'blur'
						},
						{
							pattern: /^[1](([3][0-9])|([4][1-9])|([5][0-3,4-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0,1,2,3,5,6,7,8,9]))[0-9]{8}$/,
							message: '预留手机号无效',
							trigger: 'blur'
						}
					],
					// ^[0-9]*$

					// bankSerialNumber: [
					//   { required: true, message: '请填写支付流水号', trigger: 'blur' }
					// ],
					payAccount: [
						// { required: true, message: '请选择银行卡/账户', trigger: 'blur' },
						// {
						//   pattern: /^[0-9]*$/,
						//   message: '请填写数字',
						//   trigger: 'blur'
						// },
						{
							max: 20,
							message: '最长不超过20位',
							trigger: 'blur'
						}
					],
					purchasePrice: [
						// { required: true, message: '请填写采购金额', trigger: 'blur' },
						{
							pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/,
							message: '请输入数字',
							trigger: 'change'
						}
					]
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
			this.platformId = enumeration.enumeration.platformId
			this.payType = enumeration.enumeration.payType
			this.purChaseAccountType = enumeration.enumeration.purChaseAccountType
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
					if (code !== 0) {
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
					const order = res.data
					if (this.$route.query.isdetails == 1) {
						this.lunchOrder(order)
						loading.close()
						this.Lookdisabled = true
					} else {
						if (order.isLock && order.isLock === this.LockEnum.Lock) {
							if (order.lockUserId === this.sysUser.userId) {
								this.lunchOrder(order)
							} else {
								this.$alert('当前订单已被<strong style="color:red;font-size:large">' + order
									.lockUserName +
									'</strong>锁定', '提示', {
										confirmButtonText: '确定',
										type: 'warning',
										showClose: false,
										closeOnClickModal: false,
										closeOnPressEscape: false,
										dangerouslyUseHTMLString: true
									}).then(() => {
									this.$store.dispatch('tagsView/delView', this.$route)
									this.goOrderList()
								})
							}
						} else {
							this.$confirm('是否锁定订单？', '提示', {
								confirmButtonText: '锁定',
								cancelButtonText: '不锁定',
								type: 'warning',
								showClose: false,
								closeOnClickModal: false,
								closeOnPressEscape: false
							}).then(() => {
								this.lockOrder(order)
							}).catch(action => {
								this.goOrderList()
							})
						}
						loading.close()
					}
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

						this.lunchOrder(order)
					} else {
						this.$message('订单锁定失败,请刷新重试')
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
						this.Order.isLock = this.LockEnum.NoLock
						// 关闭当前页面
						this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews
							.findIndex(item => item.path === this.$route.path), 1)
						// 返回主页面
						this.goOrderList()
						// this.$router.go(-1);
						this.$message('订单解锁成功')
					} else {
						this.$message('订单解锁失败,请刷新重试')
					}

					loading.close()
				})
			},


			
			lunchOrder(order) {
				this.Order = order
				// this.orderAmount1 = parseFloat(this.Order.orderAmount * 0.94).toFixed(2)
				// 入住人
				var checkInName = this.Order.checkInName.split(',')
				for (var i = 1; i <= checkInName.length; i++) {
					const checkInOrder = {
						...this.Order
					}
					checkInOrder.roomCount = 1
					checkInOrder.checkInName = checkInName[i - 1]
					this.checkInOrders.push(checkInOrder)
				}


				// 支付单
				this.paymentOrders = this.Order.paymentOrders
				this.paymentOrders.forEach((item, index) => {
					if (item.paymentType === 80) {
						item.paymentTypeDesc = "优惠券"
					}
					if (item.paymentType === 100) {
						item.paymentTypeDesc = "折扣"
					}
				})

				// 采购单
				this.purchaseOrders = this.Order.purchaseOrders
				this.purchaseOrders.forEach((item, index) => {
					if (item.purchaseMethod === this.purchaseMethodEnum.MANNAL) {
						if (item.platform == '未知') {
							item.platform = ''
						}
						if (item.payTypeDesc == '未知') {
							item.payTypeDesc = ''
						}
					}
				})

				this.purchaseOrders.forEach((item, index) => {
					if (item.purchaseMethod == this.purchaseMethodEnum.MANNAL) {
						this.PurchaseOrder = deepClone(this.purchaseOrders[index])
						if (this.PurchaseOrder.platformId === 0) {
							delete this.PurchaseOrder.platformId
						}
					}
					if (this.PurchaseOrder.purChaseAccountType === 0) {
						delete this.PurchaseOrder.purChaseAccountType
					}
					if (this.PurchaseOrder.payType === 0) {
						delete this.PurchaseOrder.payType
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
			},
			fetchOrderLog() {
				const orderNo = this.Order.orderNo
				GetOrderLogs(orderNo).then(res => {
					this.orderLogs = res.data
				})
			},


			purchaseOrderDetail(purchaseOrder) {
				// 点击关闭采购编辑
				// this.purchaseFormVisiable = !this.purchaseFormVisiable
				this.purchaseFormVisiable = true
				// 详情
				if (purchaseOrder) {
					if (purchaseOrder.platformId === 0) {
						delete purchaseOrder.platformId
					}
					if (purchaseOrder.purChaseAccountType === 0) {
						delete purchaseOrder.purChaseAccountType
					}
					if (purchaseOrder.payType === 0) {
						delete purchaseOrder.payType
					}

					AddLog(this.Order.orderNo, purchaseOrder.purchaseNo, 'purchaseDetailView')
					this.PurchaseOrder = deepClone(purchaseOrder)
				} else {
					// 新建
					if (this.Order.orderStatus === this.OrderStatusEnum.RESERVESUCCESS) {
						this.$message.error('订单已预订成功,不能发起采购')
						return
					}
					this.PurchaseOrder = {
						purchaseNo: '系统生成',
						purchaseStatusDesc: '初始',
						staging: 0,
						purchaseStatus: 15,
						purchaseMethod: 2
					}
				}
			},

			submitPurchase(stating) {
				this.$refs['purchaseForm'].validate((valid) => {
					if (!valid) {
						return
					}

					var data = {
						...this.PurchaseOrder,
						orderNo: this.Order.orderNo,
						staging: stating
					}
					const type = stating === 0 ? '暂存' : '提交'
					Purchase(data).then(res => {
						if (res.data) {
							// this.purchaseFormVisiable = false
							this.PurchaseOrder = {}
							this.fetchOrder()

							this.$message({
								message: `采购信息${type}成功`,
								type: 'info'
							})
						} else {
							this.$message.error(`采购信息${type}失败`)
						}
					})
				})
			},
			closePurchaseForm() {
				this.purchaseFormVisiable = false
				this.PurchaseOrder = {}
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
				})
			},
			purchaseFail(purchaseOrderNo) {
				this.$confirm('确定已采购失败?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					PurchaseFail(purchaseOrderNo).then(res => {
						if (res.data) {
							this.fetchOrder()
							this.$message({
								message: '采购单已采购失败',
								type: 'info'
							})
						} else {
							this.$message.error('操作失败')
						}
					})
				})
			},
			purchaseRefund(purchaseOrderNo) {
				this.$confirm('确定采购已退款?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					PurchaseRefund(purchaseOrderNo).then(res => {
						if (res.data) {
							this.fetchOrder()
							this.$message({
								message: '采购单已退款成功',
								type: 'info'
							})
						} else {
							this.$message.error('操作失败')
						}
					})
				})
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
			confirmFail() {
				this.$confirm('确定预定失败吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					const orderNo = this.Order.orderNo
					ConfirmFail(orderNo).then(res => {
						if (res.data) {
							this.fetchOrder()
							this.$message({
								message: '操作成功',
								type: 'success'
							})
						} else {
							this.$message.error('操作失败')
						}
					})
				}).catch(() => {})
			},

       	waitReject() {
				this.$confirm('确定转为待拒单吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					const orderNo = this.Order.orderNo
					WaitReject(orderNo).then(res => {
						if (res.data) {
							console.log("ddd")
							this.fetchOrder()
							this.$message({
								message: '操作成功',
								type: 'success'
							})
						} else {
								console.log("ddd")
							this.$message.error('操作失败')
						}
					})
				}).catch(() => {})
			},


			purchaseSuccess(purchaseNo) {
				this.$confirm('确认采购成功吗?', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					PurchaseSuccess(purchaseNo).then(res => {
						if (res.data) {
							this.fetchOrder()
							this.$message({
								message: '操作成功',
								type: 'success'
							})
						} else {
							this.$message.error('操作失败')
						}
					})
				}).catch(() => {})
			},
			confirm() {
				this.$confirm('是否预订成功?', '提示', {
					confirmButtonText: '是',
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
			doRefund() {
				this.$confirm('退款后不可撤回，确定要通过退款吗？', '退款确认提示', {
						distinguishCancelAndClose: true,
						confirmButtonText: '退款',
						cancelButtonText: '取消',
						type: 'info'
					}).then(() => {
						const loading = this.$loading({
							lock: true,
							text: '正在处理退款',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						})

						const refundNo = this.Order.refundApplyOrders[0].refundNo
						RefundTrade(refundNo).then(res => {
							loading.close()

							if (res.data) {
								this.fetchOrder()
								this.$message({
									type: 'success',
									message: '退款完成'
								})
							} else {
								this.$message({
									type: 'error',
									message: '退款失败'
								})
							}
						})
					})
					.catch(action => {})
			},
			getOrderBookingStatus(order) {
				let bookingStatus = ''
				if (order.confirmTime) {
					bookingStatus = '预定成功'
				} else {
					switch (order.orderStatus) {
						case this.OrderStatusEnum.RESERVESUCCESS:
							bookingStatus = '预定成功'
							break
						case this.OrderStatusEnum.RESERVEFAIL:
							bookingStatus = '预定失败'
							break
						default:
							bookingStatus = '预定中'
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
			goOrderList() {
				this.$router.go(-1)
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

	::v-deep .el-card__body {
		padding: 0 20px 0 20px;
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
		font-family: '微软雅黑';
	}

	::v-deep .el-card__body {
		padding: 0 20px 0 20px;
	}

	.opt {
		text-align: center;
	}

	.card-opt {
		text-align: center;
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

	::v-deep .el-table th>.cell {
		color: #606266;
		text-align: center;
	}

	::v-deep .el-table__body td {
		text-align: center;
	}

	.left-align {
		font-size: 13px;
	}

	::v-deep .is-success .el-input-number__increase {
		right: 1px !important;
	}

	::v-deep .is-error .el-input-number__increase {
		right: 1px !important;
	}

	::v-deep .el-table th {
		background-color: #ffffff !important;
		opacity: 1;
	}

	.app-main {
		background: #ffffff;
	}

	.orderinfo {
		font-weight: 600;
		font-size: 13px;
		color: #606266;
		font-family: '微软雅黑';
	}

	::v-deep .el-input--small .el-input__inner {
		background-color: #f9f9f9;
	}

	::v-deep.el-input .el-input__count .el-input__count-inner {
		background-color: #f9f9f9;
	}

	::v-deep .el-textarea__inner {
		background-color: #f9f9f9;
	}

	::v-deep .el-textarea .el-input__count {
		background-color: #f9f9f9;
	}

	::v-deep .el-input-group__prepend {
		background-color: #f9f9f9;
	}

	::v-deep .el-input-group__prepend div.el-select .el-input__inner {
		color: #606266;
	}

	::v-deep .el-tag.el-tag--info {
		color: #606266
	}

	::v-deep .el-table th {
		border-right: 0
	}

	/* ::v-deep .el-select-dropdown__item:nth-child(1){
  display:  none !important;
} */
</style>
<style>
	::v-deep .el-table th.el-table__cell {
		background-color: #fff;
	}
</style>
