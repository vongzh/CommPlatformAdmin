<template>
	<div v-show="Order.orderStatus" class="content">
		<el-col :xl="4" :lg="2"><br></el-col>
		<el-col :xl="16" :lg="20">
			<el-card class="info" shadow="never">
				<div slot="header" class="info-header">
					<svg-icon icon-class="dingdan_1" />
					<span type="primary" class="titlecss">订单信息</span>
					<div class="opt" style="padding-right:2rem">
						
						<!-- <el-button type="warning" icon="el-icon-chat-dot-round" circle @click="openUrl({id:Order.orderNo,statu:Order.orderStatusDesc})"></el-button> -->
						<el-button type="success" size="mini" @click="dialogFormVisible = true">第三方订单号</el-button>
						<el-button v-if="Order.orderStatus === OrderStatusEnum.WAITPAY" type="success" size="mini"
							@click="goPay()">支付</el-button>
						<el-button
							:disabled="!((Order.orderStatus === OrderStatusEnum.RESERVEING || Order.orderStatus === OrderStatusEnum.WAITCONFIRM) && Order.isReminder === YNEnum.N)"
							:type="(Order.orderStatus === OrderStatusEnum.RESERVEING || Order.orderStatus === OrderStatusEnum.WAITCONFIRM) && Order.isReminder === YNEnum.N?'primary':'info'"
							size="mini" @click="remind()">催单</el-button>
						<el-button
							:disabled="!(Order.orderStatus === OrderStatusEnum.WAITPAY || Order.orderStatus === OrderStatusEnum.RESERVEING || Order.orderStatus === OrderStatusEnum.WAITCONFIRM)"
							:type="Order.orderStatus === OrderStatusEnum.WAITPAY || Order.orderStatus === OrderStatusEnum.RESERVEING || Order.orderStatus === OrderStatusEnum.WAITCONFIRM?'warning':'info'"
							size="mini" @click="cancelOrder()">取消订单</el-button>
					</div>
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
							<el-row>
								<el-col :span="12" class="right-align">
									<span class="orderinfo">第三方订单号：</span>
								</el-col>
								<el-col :span="12" class="left-align">{{Order.thirdOrderNo}}</el-col>
							</el-row>
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
									<el-link slot="reference" :underline="false" style="border-bottom:1px dashed #ccc;">
										{{ Order.orderAmount }}
									</el-link>
								</el-popover>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12" class="right-align">
								<span class="orderinfo">订单状态：</span>
							</el-col>
							<el-col :span="12" class="left-align">{{ Order.orderStatusDesc }}</el-col>
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
							<el-col :span="12" class="left-align">{{ Order.bookingDaysShow }}</el-col>
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

			<el-card v-if="paymentOrders && paymentOrders.length>0" class="info" shadow="never">
				<div slot="header" class="info-header">
					<svg-icon icon-class="zhifufangshi" />
					<span class="titlecss">
						支付信息
						<!-- <i class="el-icon-bank-card ml5" /> -->
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
			<el-card v-if="refundApplyOrders && refundApplyOrders.length > 0" class="info" shadow="never">
				<div slot="header" class="info-header">
					<svg-icon icon-class="tuikuan" />
					<span class="titlecss">退款信息</span>
				</div>
				<el-table :data="refundApplyOrders">
					<el-table-column prop="refundNo" label="退款单号" min-width="8%" />
					<el-table-column prop="refundAmount" label="退款金额" min-width="8%" />

					<el-table-column prop="refundWayDesc" label="退款方式" min-width="8%" />
					<!-- <el-table-column prop="refundReasonDesc" label="退款原因" /> -->
					<el-table-column prop="refundTypeDesc" label="退款类型" min-width="8%" />
					<!-- <el-table-column prop="refundDesc" label="问题描述" /> -->
					<el-table-column prop="refundStatusDesc" label="退款状态" min-width="8%" />
					<!-- <el-table-column prop="auditUserName" label="审核人" />
          <el-table-column prop="modifierDesc" label="操作人" /> -->

					<el-table-column prop="applyTime" label="申请时间" min-width="8%" />
					<el-table-column prop="refundTime" label="退款时间" min-width="8%" />

				</el-table>
			</el-card>
			<!-- <el-card class="info">
      <div slot="header">
        <span>订单日志</span>
      </div>
      <el-table :data="orderLogs" size="small">
        <el-table-column prop="operTime" label="操作时间" />
        <el-table-column prop="userName" label="操作人" />
        <el-table-column prop="operContent" label="操作内容" />
      </el-table>
    </el-card> -->
		</el-col>
		<el-dialog title="第三方订单号" :visible.sync="dialogFormVisible" width="25%" center>
			<el-form :model="Order" ref="thirdOrderNoRef" :inline="true">
				<el-col :span="24">
					<el-form-item label="第三方订单号">
						<el-input v-model="Order.thirdOrderNo"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="平台">
						<el-select v-model="Order.thirdPlatformId" clearable style=“width:100%”>
							<el-option v-for="ot in merchantsDict" :key="ot.dictValue" :label="ot.dictLabel"
								:value="ot.dictValue" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeThirdOrder('thirdOrderNoRef')">取 消</el-button>
				<el-button type="primary" @click="UpdateThirdOrder()">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		GetOrder,
		GetOrderLogs,
		Reminder,
		CancelOrder,
		UpdateThirdOrder
	} from '@/api/order/order'
	import moment from 'moment'
	import {
		mapGetters
	} from 'vuex'
	import {
		GetPlatformDict,
	} from '@/api/dict/dict'
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
				refundApplyOrders: [],
				orderLogs: [],
				orderSetp: 0,
				dialogFormVisible: false,
				Order: {
					orderNo: '',
					thirdOrderNo: '',
					thirdPlatformId: 0
				},
				merchantsDict: [{
						dictLabel: "51Zhu",
						dictValue: "1",
					},
					{
						dictLabel: "美团",
						dictValue: "2",
					}, {
						dictLabel: "飞猪",
						dictValue: "5",
					},
					{
						dictLabel: "美团分销",
						dictValue: "6",
					},
					{
						dictLabel: "携程商旅",
						dictValue: "7",
					},
					{
						dictLabel: "携程待定",
						dictValue: "8",
					},
					{
						dictLabel: "携程分销",
						dictValue: "9",
					},
					{
						dictLabel: "携程",
						dictValue: "10",
					},
					{
						dictLabel: "快跑",
						dictValue: "12",
					},
					{
						dictLabel: "武汉胜意",
						dictValue: "15",
					},
					{
						dictLabel: "捷旅",
						dictValue: "18",
					},
					{
						dictLabel: "绿云",
						dictValue: "19",
					},
					{
						dictLabel: "易沃思",
						dictValue: "20",
					},
					{
						dictLabel: "艺龙",
						dictValue: "70",
					},
					{
						dictLabel: "去哪儿",
						dictValue: "30",
					},
					{
						dictLabel: "同程",
						dictValue: "40",
					},
					{
						dictLabel: "线下",
						dictValue: "60",
					},
					{
						dictLabel: "其他",
						dictValue: "100",
					},
				],
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
				RefundApplyOrderAuditStatus: {
					ORIGINAL: 0,
					PASS: 1,
					REJECT: 2
				},
				LockEnum: {
					NoLock: 0,
					Lock: 1
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
				YNEnum: {
					Y: 1,
					N: 0
				},
				OrderStatus: [{
						text: '待支付',
						value: 5
					},
					{
						text: '预订中',
						value: 15
					},
					{
						text: '待确认',
						value: 20
					},
					{
						text: '预订成功',
						value: 25
					},
					{
						text: '预订失败',
						value: 30
					},
					{
						text: '已消费',
						value: 35
					},
					{
						text: '已消费退款',
						value: 40
					},
					{
						text: '已取消',
						value: -1
					}
				],
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
				this.getDict()
			},
			getDict(){
				GetPlatformDict().then(res => {
					this.merchantsDict = res.data.map(item => {
						return {
							dictLabel: item.platformName,
							dictValue: item.platformId
						}
					})
				})
			},
			getOrderStatus(status) {
				let arr = this.OrderStatus.filter(item => {
					return item.dictValue == status
				})
				return arr.length > 0 ? arr[0].dictLabel : "未知";
			},
			// openUrl(obj) {
			// 	this.qiyu.Config({
			// 		type: "订单详情",
			// 		orderId: obj.id,
			// 		statu:  obj.statu
			// 	})
			// },
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
					if (!res.result) {
						loading.close()
						this.$alert(res.message || '订单未找到', '查询失败', {
							confirmButtonText: '确定',
							type: 'error',
							callback: action => {
								this.$router.push({
									path: '/orderlist'
								})
							}
						})
						return
					}

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

					// 退款单
					if (this.Order.refundApplyOrders && this.Order.refundApplyOrders.length > 0) {
						if (this.Order.refundApplyOrders[0].refundStatus === this.refundApplyOrderStatus.REJECT) {
							this.Order.refundApplyOrders[0].refundStatusDesc = '退款失败'
						}
					}
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
				}).catch(err => {
					loading.close()
				})
			},
			fetchOrderLog() {
				const orderNo = this.Order.orderNo
				GetOrderLogs(orderNo).then(res => {
					this.orderLogs = res.data
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
			cancelOrder() {
				this.$confirm('确定要取消订单吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					CancelOrder(this.Order.orderNo).then(res => {
						if (res.data) {
							this.fetchOrder()
							this.$message({
								type: 'success',
								message: '订单已取消!'
							})
						} else {
							this.$message({
								type: 'error',
								message: '订单取消失败!'
							})
						}
					})
				}).catch(() => {

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
			},
			UpdateThirdOrder() {
				UpdateThirdOrder(this.Order.orderNo, this.Order.thirdOrderNo, this.Order.thirdPlatformId).then(res => {
					if (res.data) {
						this.$message({
							message: '第三方订单号添加成功',
							type: 'success'
						});
						this.dialogFormVisible = false
					} else {
						this.$message.error('第三方订单号添加失败');
					}
				})

			},
			closeThirdOrder(form) {
				this.dialogFormVisible = false
				this.$refs[form].resetFields()
			},
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

	.el-card__body {
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

	.el-link {
		cursor: default;
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

	.info-header {
		font-size: 20px;
		line-height: 60px;
		padding-left: 10px;
		margin-left: 0;
	}

	.titlecss {
		padding-left: 5px;
		color: #006699;
		opacity: 0.7;
		filter: alpha(opacity=70);
		font-weight: 600;
	}

	::v-deep .el-table th>.cell {
		color: #606266;
		text-align: center;
	}

	::v-deep .el-table__body td {
		text-align: center;
	}

	::v-deep .el-table th {
		border-right: 0
	}

	::v-deep .el-form-item--medium .el-form-item__label {
		width: 100px;
	}

	::v-deep .el-table th.el-table__cell {
		background-color: #fff;
	}
</style>
