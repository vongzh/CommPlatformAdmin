<template>
	<div v-show="Order.orderStatus" class="content">
		<el-card class="info">
			<div slot="header">
				<span>订单信息</span>
			</div>
			<div class="order-status">
				<el-row>
					<el-col :xl="2" :sm="4" class="right-align">
						<el-link :underline="false">订单号：</el-link>
					</el-col>
					<el-col :xl="2" :sm="6">
						<el-link :underline="false">{{ Order.orderNo }}</el-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :xl="2" :sm="4" class="right-align">
						<el-link :underline="false">订单金额：</el-link>
					</el-col>
					<el-col :xl="2" :sm="6">
						<el-link :underline="false">{{ Order.orderAmount }}</el-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :xl="2" :sm="4" class="right-align">
						<el-link :underline="false">订单状态：</el-link>
					</el-col>
					<el-col :xl="2" :sm="6">
						<el-link :underline="false">{{ Order.orderStatusDesc }}</el-link>
					</el-col>
				</el-row>
				<!-- <el-row>
          <el-col :xl="2" :sm="4" class="right-align">
            <el-link :underline="false">开票方：</el-link>
          </el-col>
          <el-col :xl="2" :sm="6">
            <el-link :underline="false">{{ Order.invoiceDrawerDesc }}</el-link>
          </el-col>
        </el-row> -->
				<el-row>
					<el-col :xl="2" :sm="4" class="right-align">
						<el-link :underline="false">预订时间：</el-link>
					</el-col>
					<el-col :xl="2" :sm="6">
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
			</div>
		</el-card>
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
		<el-card class="info">
			<div slot="header">
				<span>入住信息</span>
			</div>
			<el-table :data="checkInOrders">
				<el-table-column label="酒店名">
					<template slot-scope="scope">
						<el-link :underline="false" type="info">{{ scope.row.hotelName }}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="hotelAddress" label="酒店地址" width="100" />
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
						<el-link :underline="false">
							{{ dateTimeToDate(scope.row.checkInDate) }}/{{ dateTimeToDate(scope.row.checkOutDate) }}
						</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="checkInName" label="入住人" />
				<el-table-column prop="checkInPhone" label="联系电话" />
			</el-table>
		</el-card>
		<el-card class="info">
			<div slot="header">
				<span>支付信息</span>
			</div>
			<el-table :data="paymentOrders">
				<el-table-column prop="paymentNo" label="支付单号" />
				<el-table-column prop="paymentAmount" label="支付金额" />
				<el-table-column prop="paymentStatusDesc" label="支付状态" />
				<el-table-column prop="paymentTypeDesc" label="支付方式" />
				<el-table-column prop="paymentOrderDate" label="支付时间" />
			</el-table>
		</el-card>
		<el-card class="info">
			<div slot="header">
				<span>采购订单信息</span>
				<div class="opt">
					<el-button style="margin-right:2rem" type="primary" size="mini" icon="el-icon-plus"
						@click="purchaseOrderDetail()">新建采购单</el-button>
				</div>
			</div>
			<el-table :data="purchaseOrders">
				<el-table-column prop="purchaseNo" label="采购单号" />
				<el-table-column prop="platformOrderNo" label="采购平台单号" />
				<el-table-column prop="platform" label="采购平台" />
				<el-table-column prop="account" label="采购账号信息" />
				<el-table-column prop="payTypeDesc" label="支付方式" />
				<el-table-column prop="purchasePrice" label="采购金额" />
				<el-table-column prop="purchaseStatusDesc" label="采购状态" />
				<el-table-column prop="contactPhone" label="预留手机号" />
				<el-table-column prop="checkInName" label="采购人" />
				<el-table-column prop="orderDate" label="采购时间" />
				<el-table-column label="操作" fixed="right" width="200">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" @click="purchaseOrderDetail(scope.row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-card v-if="purchaseFormVisiable" class="info">
			<div slot="header">
				<span>采购信息</span>
				<div class="opt" v-if="!Lookdisabled">
					<el-button type="primary" size="mini" @click="submitPurchase()">保存</el-button>
					<el-button type="info" size="mini" @click="closePurchaseForm">关闭</el-button>
				</div>
			</div>
			<el-form :disable="Lookdisabled" ref="purchaseForm" inline size="small" label-width="110px"
				:model="PurchaseOrder" :rules="purchaseFormRules">
				<el-row>
					<el-col :span="7">
						<el-form-item label="采购单号" prop="purchaseNo">
							<el-tag type="info" size="medium">
								{{ PurchaseOrder.purchaseNo }}
							</el-tag>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="采购状态" prop="purchaseStatus">
							<el-tag type="success" size="medium">
								{{ PurchaseOrder.purchaseStatusDesc }}
							</el-tag>
						</el-form-item>
					</el-col>
				</el-row>
				<el-divider />
				<el-row>
					<el-col :span="7">
						<el-form-item label="采购平台" prop="platformId">
							<el-select v-model="PurchaseOrder.platformId" placeholder="平台" size="small"
								style="width:150px">
								<el-option label="美团" :value="6" />
								<el-option label="携程" :value="9" />
							</el-select>
							<el-select v-model="PurchaseOrder.accountType" placeholder="新/老账号" size="small"
								style="margin-left:20px;width:150px">
								<el-option label="新账号" :value="1" />
								<el-option label="老帐号" :value="5" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="采购金额" prop="purchasePrice">
							<el-input-number v-model="PurchaseOrder.purchasePrice" size="small" placeholder="金额"
								:precision="2" :step="100" :max="100000" style="width:220px" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="支付方式" prop="payAccount">
							<el-input v-model="PurchaseOrder.payAccount" placeholder="账号" style="background-color:#fff"
								maxlength="20" show-word-limit>
								<el-select slot="prepend" v-model="PurchaseOrder.payType" placeholder="请选择"
									style="width:90px">
									<el-option label="请选择" :value="0" />
									<el-option label="银行卡" :value="6" />
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="7">
						<el-form-item label="采购账号">
							<el-input v-model="PurchaseOrder.account" placeholder="请输入采购账号" />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="采购密码">
							<el-input v-model="PurchaseOrder.password" placeholder="请输入采购账号密码" maxlength="30"
								show-word-limit />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="采购平台单号">
							<el-input v-model="PurchaseOrder.platformOrderNo" placeholder="请输入采购平台单号" maxlength="20"
								show-word-limit />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-form-item label="订单备注">
						<el-input v-model="PurchaseOrder.remark" type="textarea" :rows="9" placeholder="请输入采购描述"
							style="width:900px" maxlength="500" show-word-limit />
					</el-form-item>
				</el-row>
			</el-form>
		</el-card>
		<el-card class="info">
			<div slot="header">
				<span>退款信息</span>
			</div>
			<el-table :data="refundApplyOrders">
				<el-table-column prop="refundNo" label="退款单号" />
				<el-table-column prop="refundAmount" label="退款金额" />
				<el-table-column prop="paymentStatusDesc" label="退款方式" />
				<el-table-column prop="" label="退款原因" />
				<el-table-column prop="" label="问题描述" />
				<el-table-column prop="refundStatusDesc" label="退款状态" />
				<el-table-column prop="" label="操作人" />
				<el-table-column prop="refundTime" label="退款时间" />
			</el-table>
		</el-card>
		<div class="info">
			<el-divider />
			<div class="card-opt" v-if="!Lookdisabled">
				<el-button type="danger" size="medium" @click="rejectOrder">拒单</el-button>
				<el-button type="success" size="medium" @click="confirm">预订成功</el-button>
				<el-button type="warning" size="medium" @click="confirmFail">预订失败</el-button>
				<el-button type="primary" size="medium" @click="unlockOrder()">解锁订单</el-button>
				<el-button type="success" size="medium" @click="purchaseSuccess">采购成功</el-button>
			</div>
		</div>
		<el-card class="info">
			<!-- <div slot="header">
        <span>订单日志</span>
      </div> -->
			<el-table :data="orderLogs">
				<el-table-column prop="operTime" label="操作时间" />
				<el-table-column prop="userName" label="操作人" />
				<el-table-column prop="operContent" label="操作内容" />
			</el-table>
		</el-card>
	</div>
</template>

<script>
	import {
		GetOrder,
		GetOrderLogs,
		PurchaseFail,
		PurchaseOrderFromPlatform,
		LockOrder,
		UnlockOrder,
		Purchase
	} from '@/api/order/order'
	import moment from 'moment'
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				Order: {},
				PurchaseOrder: {},
				checkInOrders: [],
				paymentOrders: [],
				purchaseOrders: [],
				refundApplyOrders: [],
				orderLogs: [],
				Lookdisabled: false,
				purchaseFormVisiable: false,
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
				purchaseFormRules: {
					platformId: [{
						required: true,
						message: '请选择平台',
						trigger: 'change'
					}],
					reservedPhone: [{
						required: true,
						message: '请填写预留手机号',
						trigger: 'change'
					}],
					bankSerialNumber: [{
						required: true,
						message: '请填写支付流水号',
						trigger: 'change'
					}],
					payType: [{
						required: true,
						message: '请选择支付方式',
						trigger: 'change'
					}],
					purchasePrice: [{
						required: true,
						message: '请填写采购金额',
						trigger: 'change'
					}]
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
						this.goOrderList()
						this.$message('订单解锁成功')
					} else {
						this.$message('订单解锁失败,请刷新重试')
					}

					loading.close()
				})
			},
			lunchOrder(order) {
				this.Order = order
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

				// 退款单
				this.refundApplyOrders = this.Order.refundApplyOrders
			},
			fetchOrderLog() {
				const orderNo = this.Order.orderNo
				GetOrderLogs(orderNo).then(res => {
					this.orderLogs = res.data
				})
			},
			purchaseOrderDetail(purchaseOrder) {
				if (purchaseOrder) {
					this.PurchaseOrder = purchaseOrder
					this.purchaseFormVisiable = true
				} else {
					this.PurchaseOrder = {
						purchaseNo: '系统生成',
						purchaseStatusDesc: '初始',
						purchaseMethod: 2
						this.purchaseFormVisiable = true
					}
				}

				this.purchaseFormVisiable = true
			},
			submitPurchase() {
				var data = {
					...this.PurchaseOrder,
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
				this.$confirm('确定要终止采购?', '提示', {
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
			goOrderList() {
				this.$router.push('/manualwait/list')
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

	.card-opt {
		margin-left: 30%;
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

	::v-deep .el-table th {
		background-color: #ffffff;
		opacity: 1;
	}

	::v-deep .el-table th {
		border-right: 0
	}

	::v-deep .el-table th.el-table__cell {
		background-color: #fff;
	}
</style>
