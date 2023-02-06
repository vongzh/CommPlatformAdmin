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
										style="border-bottom:1px dashed #ccc;color: #b40000;">{{ Order.orderAmount }}
									</el-link>
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

				<!-- <div class="order-status" style="border-top:1px solid #DFE6EC">
          <br>
          <el-row>
            <el-col :offset="3" :span="2" class="right-align">
              <b>订单号：</b>
            </el-col>
            <el-col :span="2" class="left-align">{{ Order.orderNo }}</el-col>

            <el-col :span="2" class="right-align">
              <b>订单金额：</b>
            </el-col>
            <el-col :span="2" class="left-align">
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

            <el-col :span="2" class="right-align">
              <b>订单状态：</b>
            </el-col>
            <el-col :span="2" class="left-align">{{ Order.orderStatusDesc }}</el-col>
            <el-col :span="2" class="right-align">
              <b>下单时间：</b>
            </el-col>
            <el-col :span="3" class="left-align">{{ Order.orderDate }}</el-col>
          </el-row>
          <el-divider />
        </div> -->
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
								<div style="text-align:center;color: #b40000;">
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
						<el-table-column prop="checkInName" label="入住人" min-width="10%">
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

			<el-card v-if="purchaseOrders && purchaseOrders.length>0" class="info" shadow="never">
				<div slot="header" class="info-header">
					<svg-icon icon-class="gouwuchezhengpin" />
					<span class="titlecss">采购信息</span>
				</div>
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
					<el-table-column prop="purchasePrice" label="采购金额" min-width="8%" />
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
			</el-card>

			<el-card v-if="refundApplyOrders && refundApplyOrders.length>0" class="info" shadow="never">
				<div slot="header" class="info-header">
					<svg-icon icon-class="tuikuan" />
					<span class="titlecss">退款信息</span>
				</div>
				<el-table :data="refundApplyOrders" :highlight-current-row="true">
					<el-table-column prop="refundNo" label="退款单号" min-width="6%" />
					<el-table-column prop="refundAmount" label="退款金额" min-width="6%" />
					<el-table-column prop="refundTypeDesc" label="退款类型" min-width="6%" />
					<el-table-column prop="refundWayDesc" label="退款方式" min-width="6%" />
					<el-table-column prop="refundReasonDesc" label="退款原因" min-width="6%" />
					<el-table-column prop="refundDesc" label="问题描述" min-width="10%">
						<template slot-scope="scope">
							<el-popover placement="top-start" width="200" trigger="hover"
								:content="scope.row.refundDesc">
								<el-link slot="reference" style="margin-left:3px">{{ scope.row.refundDesc|ellipsis }}
								</el-link>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column label="退款状态" min-width="8%">
						<template slot-scope="scope">
							<el-popover v-if="scope.row.refundStatus === refundApplyOrderStatus.REJECT"
								placement="top-start" width="200" trigger="hover" :content="scope.row.auditDesc">
								<el-link slot="reference" type="warning" style="margin-left:3px">
									{{ scope.row.refundStatusDesc }}</el-link>
							</el-popover>
							<el-col v-else style="margin-left:3px">{{ scope.row.refundStatusDesc }}</el-col>
						</template>
					</el-table-column>
					<el-table-column prop="modifierDesc" label="操作人" min-width="8%" />
					<el-table-column prop="auditUserName" label="审核人" min-width="8%" />
					<el-table-column prop="applyTime" label="申请时间" min-width="12%" />
					<el-table-column label="操作" min-width="6%">
						<template slot-scope="scope">
							<el-button  v-if="scope.row.refundStatus === refundApplyOrderStatus.WAITREFUND"
								type="danger" size="mini" @click="doRefund(scope.row.refundNo)">退款</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
			<div class="info">
				<el-divider />
				<div class="card-opt">
					<!-- <el-button v-if="Order.refundApplyOrders && Order.refundApplyOrders[0].refundStatus ===refundApplyOrderStatus.WAITAUDIT" type="success" size="medium" @click="agreeRefund">同意退款</el-button>
        <el-button v-if="Order.refundApplyOrders && Order.refundApplyOrders[0].refundStatus ===refundApplyOrderStatus.WAITAUDIT" type="warning" size="medium" @click="rejectRefund">拒绝退款</el-button> -->
	<!-- 				<el-button
						:disabled="!(Order.refundApplyOrders && Order.refundApplyOrders[0].refundStatus ===refundApplyOrderStatus.WAITREFUND)"
						:type="Order.refundApplyOrders && Order.refundApplyOrders[0].refundStatus ===refundApplyOrderStatus.WAITREFUND?'danger':'info'"
						size="medium" @click="doRefund">退款</el-button> -->
				</div>
			</div>
			<el-card class="info" shadow="never">
				<!-- <div slot="header">
        <span>订单日志</span>
      </div> -->
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
			<el-dialog :visible.sync="purchaseFormVisiable" :close-on-click-modal="false" label-position="right"
				:inline="true">
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
							<el-col :underline="false">
								{{ PurchaseOrder.platform }}/{{ PurchaseOrder.purChaseAccountTypeDesc }}</el-col>
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
							<el-col :underline="false">{{ PurchaseOrder.payTypeDesc }}/{{ PurchaseOrder.payAccount }}
							</el-col>
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
		AddLog
	} from '@/api/order/order'
	import {
		ConfirmRefund,
		RejectRefund,
		RefundTrade
	} from '@/api/refund/refund'
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
		data() {
			return {
				Order: {},
				PurchaseOrder: {},
				checkInOrders: [],
				paymentOrders: [],
				purchaseOrders: [],
				refundApplyOrders: [],
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
				refundApplyOrderStatus: {
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
				RefundApplyOrderAuditStatus: {
					ORIGINAL: 0,
					PASS: 1,
					REJECT: 2
				},
				LockEnum: {
					NoLock: 0,
					Lock: 1
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
					this.Order = res.data

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
					})

					// 采购单
					this.purchaseOrders = this.Order.purchaseOrders

					// 退款单
					this.refundApplyOrders = this.Order.refundApplyOrders

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
			agreeRefund() {
				this.$prompt('请输入同意退款原因', '同意退款', {
					type: 'success',
					inputType: 'textarea',
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValidator: (val) => {
						if (!val) {
							return '请输入同意退款原因'
						}
					},
					inputPattern: /^.{0,200}$/,
					inputErrorMessage: '原因应在200位以内'
				}).then(({
					value
				}) => {
					const loading = this.$loading({
						lock: true,
						text: '正在提交',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					})

					const refundNo = this.Order.refundApplyOrders[0].refundNo
					ConfirmRefund(refundNo).then(res => {
						loading.close()

						if (res.data) {
							this.fetchOrder()
							this.$message({
								type: 'success',
								message: '退款审核完成'
							})
						} else {
							this.$message({
								type: 'error',
								message: '退款审核失败'
							})
						}
					})
				}).catch(() => {})
			},
			rejectRefund() {
				this.$prompt('请输入拒绝退款原因', '同意退款', {
					type: 'error',
					inputType: 'textarea',
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValidator: (val) => {
						if (!val) {
							return '请输入拒绝退款原因'
						}
					},
					inputPattern: /^.{0,200}$/,
					inputErrorMessage: '拒绝原因应在200位以内'
				}).then(({
					value
				}) => {
					const loading = this.$loading({
						lock: true,
						text: '正在提交',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					})

					const refundNo = this.Order.refundApplyOrders[0].refundNo
					RejectRefund(refundNo, value).then(res => {
						loading.close()

						if (res.data) {
							this.fetchOrder()
							this.$message({
								type: 'success',
								message: '退款审核完成'
							})
						} else {
							this.$message({
								type: 'error',
								message: '退款审核失败'
							})
						}
					})
				}).catch(() => {})
			},
			doRefund(refundNo) {
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
					.catch(action => {

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

	.orderinfo {
		font-weight: 600;
		font-size: 13px;
		color: #606266;
		font-family: '微软雅黑';
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

	.card-opt {
		text-align: center;
	}

	.info {
		margin: 15px;
	}

	::v-deep .el-table th {
		border-right: 0
	}

	::v-deep .el-table th.el-table__cell {
		background-color: #fff;
	}
</style>
