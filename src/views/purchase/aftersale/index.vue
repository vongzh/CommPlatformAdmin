<template>
	<div class="content">
		<div style="margin-bottom: 10px;">
			<el-card style="text-align:center">
				<el-steps :active="3" simple style="width: 1100px;margin: 0 auto">
					<el-step icon="el-icon-edit-outline" style="flex-basis: 33% !important;">
						<div slot="title">
							<span class="tipsText" style="display: inline-block;height: 100%;">提交售后申请</span>
							<el-button v-waves class="tipsBtn" type="primary" size="small" icon="el-icon-paperclip"
								@click="handleApply">申请售后</el-button>
						</div>
					</el-step>
					<el-step icon="el-icon-chat-line-square" style="flex-basis: 40% !important;">
						<div slot="title">
							<span class="tipsText">客服会在30分钟内处理</span>
							<!--<el-button v-waves class="tipsBtn" type="warning" size="small" icon="el-icon-phone"
								@click="handleCustomerService">客服系统</el-button> -->
						</div>
					</el-step>
					<el-step icon="el-icon-document" style="flex-basis: 33% !important;">
						<div slot="title">
							<span class="tipsText">系统反馈处理结果</span>
						</div>
					</el-step>
				</el-steps>
				<!--            <el-steps :active="3" align-center>
              <el-step title="提交申请" description="提交售后申请" />
              <el-step title="客服会在30分钟内处理" description="客服会在30分钟内处理" />
              <el-step title="系统反馈处理结果" description="系统反馈处理结果" />
            </el-steps>
            <el-divider />
            <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-paperclip" @click="handleApply">申请售后</el-button> -->
			</el-card>
		</div>
		<el-card style="margin-bottom: 10px;">
			<div>
				<el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top"
					class="searchForm">
					<el-form-item label="订单号" prop="orderNo">
						<el-input v-model="searchCondition.orderNo" clearable placeholder="订单号"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="订单状态" prop="orderStatus">
						<el-select v-model="searchCondition.orderStatus" clearable>
							<el-option v-for="os in OrderStatus" :key="os.value" :label="os.text" :value="os.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="酒店名称" prop="hotelName" style="width: 230px;">
						<el-input v-model="searchCondition.hotelName" clearable placeholder="酒店名称"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="入离日期" prop="orderDates" style="width: 230px;">
						<el-date-picker v-model="searchCondition.orderDates" type="daterange" value-format="yyyy-MM-dd"
							start-placeholder="入住日期" end-placeholder="离店日期" align="right" />
					</el-form-item>
					<el-form-item label="入住人" prop="checkInName">
						<el-input v-model="searchCondition.checkInName" clearable placeholder="入住人"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="入住人电话" prop="checkInPhone">
						<el-input v-model="searchCondition.checkInPhone" clearable placeholder="入住人电话"
							class="filter-item input-search" />
					</el-form-item>

					<el-form-item label="售后状态" prop="status">
						<el-select v-model="searchCondition.status" clearable>
							<el-option label="待处理" :value="0" />
							<el-option label="处理中" :value="5" />
							<el-option label="处理完成" :value="10" />
						</el-select>
					</el-form-item>
					<el-form-item label="申请时间" prop="applyTimes" style="width: 230px;">
						<el-date-picker v-model="searchCondition.applyTimes" type="daterange" 
							:editable="false" value-format="yyyy-MM-dd" start-placeholder="开始" end-placeholder="结束" />
					</el-form-item>

					<el-form-item label="　" style="user-select: none;width: 200px;">
						<el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search"
							@click="handleSearch()">搜索</el-button>
						<el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close"
							@click="handleReset('searchForm')">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-card>

		<el-card>
			<!-- <div slot="header">
        <el-button type="text" @click="exportOrders">导出列表</el-button>
      </div> -->
			<div class="tools">
				<el-row>
					<el-button-group>
						<el-button v-waves size="medium" icon="el-icon-refresh" @click="handleSearch('refresh')" />
					</el-button-group>
					<el-popover placement="top" width="400" trigger="click">
						<el-col :span="24">
							<el-checkbox-group v-model="colOptions">
								<el-col :span="8" v-for="item in colSelect" :label="item" :key="item">
									<el-checkbox :label="item">{{item}}</el-checkbox>
								</el-col>
							</el-checkbox-group>
						</el-col>
						<el-button slot="reference">设置</el-button>
					</el-popover>
				</el-row>
			</div>

			<el-table ref="tableDataRef" v-loading="tableLoading" :data="afterSaleApplies" :fit="true" border stripe
				highlight-current-row>
				<el-table-column label="订单号" min-width="7%" v-if="colData[0].istrue">
					<template slot-scope="scope">
						<el-link type="info" @click="goDetail(scope.row.orderNo)">{{ scope.row.orderNo }}</el-link>
						<i class="el-icon-document-copy copy" v-clipboard:copy="scope.row.orderNo"
							v-clipboard:success="copySuccess" v-clipboard:error="copyError"></i>
					</template>
				</el-table-column>
				<el-table-column label="售后单号" min-width="7%" v-if="colData[1].istrue">
					<template slot-scope="scope">
						<el-col type="info" :underline="false">{{ scope.row.afterSaleNo }}</el-col>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="platform" label="订单来源" />
        <el-table-column prop="customerName" label="客户" /> -->
				<el-table-column label="酒店名称" prop="hotelName" min-width="15%" v-if="colData[2].istrue">
					<!-- <template slot-scope="scope">
            <el-link type="info" @click="goHotel(scope.row.hotelCode)">{{ scope.row.hotelName }}</el-link>
          </template> -->
				</el-table-column>
				<el-table-column label="入离日期" min-width="14%" v-if="colData[3].istrue">
					<template slot-scope="scope">
						{{ dateTimeToDate(scope.row.checkInDate) }}/{{ dateTimeToDate(scope.row.checkOutDate) }}
					</template>
				</el-table-column>
				<el-table-column prop="orderAmount" label="订单金额" min-width="10%" v-if="colData[4].istrue" />
				<el-table-column prop="checkInName" label="入住人" min-width="8%" v-if="colData[5].istrue" />
				<el-table-column prop="checkInPhone" label="入住人电话" min-width="11%" v-if="colData[6].istrue" />



				<el-table-column prop="orderStatusDesc" label="订单状态" min-width="7%" v-if="colData[7].istrue">
					<template slot-scope="scope">
						<!-- <el-tag type="success" effect="plain">{{ scope.row.orderStatucDesc }}</el-tag> -->
						<el-col type="success" effect="plain">{{ scope.row.orderStatucDesc }}</el-col>
					</template>
				</el-table-column>
				<el-table-column prop="statusDesc" label="售后状态" min-width="7%" v-if="colData[8].istrue">
					<template slot-scope="scope">
						<!-- <el-tag type="success" effect="light">{{ scope.row.statusDesc }}</el-tag> -->
						<el-col type="success" effect="light">{{ scope.row.statusDesc }}</el-col>
					</template>
				</el-table-column>
				<el-table-column prop="applyTime" label="申请时间" min-width="11%" v-if="colData[9].istrue" />
				<!-- <el-table-column prop="optUser" label="售后处理人" /> -->
				<el-table-column label="操作" fixed="right" min-width="7%" v-if="colData[10].istrue">
					<template slot-scope="scope">
						<el-link style="color:#DF9524;margin-right: 10px;" size="mini"
							@click="goDetail(scope.row.orderNo)">详情</el-link>
<!-- 						<el-link style="color:#DF9524;margin-right: 10px;" size="mini"
							@click="openUrl({id:Order.orderNo,statu:Order.orderStatucDesc})">咨询</el-link> -->
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="sizes,total, prev, pager, next, jumper" :total="totalCount"
					:page-size="pageSize" :page-sizes="[10,20, 50, 100]" :current-page="pageIndex"
					@current-change="onPageChange" @size-change="handleSizeChange" />
			</div>
		</el-card>

		<el-dialog title="售后申请" :visible.sync="applyVisible" :modal="true" width="70%" :close-on-click-modal="false"
			@close="closeApplyWindow">
			<el-card style="margin-top:10px;line-height:26px">
				<div slot="header">
					<el-row>
						<el-col :span="8">
							<el-input v-model="orderNo" placeholder="订单号" clearable />
						</el-col>
						<el-col :span="10" :offset="1">
							<el-button size="mini" type="primary" @click="fetchOrder">查 询</el-button>
							<el-button size="mini" @click="clearApplyOrderNo">重 置</el-button>
						</el-col>
					</el-row>
				</div>
				<div v-if="order.orderNo">
					<!-- <div slot="header" style="text-align:center">
            <span style="font-size:medium;margin-bottom:20px;">订单信息</span>
          </div> -->
					<el-row>
						<el-col :span="2">
							<span style="float:right">订单号：</span>
						</el-col>
						<el-col :span="4">
							<el-link style="float:left" :underline="false">{{ order.orderNo }}</el-link>
						</el-col>
						<el-col :offset="3" :span="2">
							<span style="float:right">
								订单金额：
							</span>
						</el-col>
						<el-col :span="4">
							<el-link style="float:left" :underline="false">￥ {{ order.orderAmount }}</el-link>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="2">
							<span style="float:right">酒店名称：</span>
						</el-col>
						<el-col :span="7">
							<el-link style="float:left" :underline="false">{{ order.hotelName }}</el-link>
						</el-col>
						<el-col :span="2">
							<span style="float:right">
								房型：
							</span>
						</el-col>
						<el-col :span="6">
							<el-link style="float:left" :underline="false">
								{{ order.roomTypeName }}({{ order.roomCount }}间)</el-link>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="2">
							<span style="float:right">
								入住人：
							</span>
						</el-col>
						<el-col :span="4">
							<el-link style="float:left" :underline="false">{{ order.checkInName }}</el-link>
						</el-col>
						<el-col :offset="3" :span="2">
							<span style="float:right">
								联系电话：
							</span>
						</el-col>
						<el-col :span="6">
							<el-link style="float:left" :underline="false">{{ order.checkInPhone }}</el-link>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="2">
							<span style="float:right">
								订单状态：
							</span>
						</el-col>
						<el-col :span="4">
							<el-link style="float:left" :underline="false">{{ order.orderStatusDesc }}</el-link>
						</el-col>
						<el-col :offset="3" :span="2">
							<span style="float:right">
								入离日期：
							</span>
						</el-col>
						<el-col :span="6">
							<el-link style="float:left" :underline="false">
								{{ dateTimeToDate(order.checkInDate) }}/{{ dateTimeToDate(order.checkOutDate) }}
							</el-link>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="2"> <span style="float:right">退改政策：</span> </el-col>
						<el-col :span="22">
							<el-link style="float:left" :underline="false">2020-04-21 07:00
								前可免费取消，当前已过最晚可取消时间（4月21日7点），订单确认后不可取消/变更，如未入住，将扣除全额房费。</el-link>
						</el-col>
					</el-row>
				</div>
				<div v-else style="text-align:center;font-size:small">
					<el-link :underline="false"><i class="el-icon-info" style="margin-right:3px" />{{ queryTip }}
					</el-link>
				</div>
			</el-card>
			<el-card v-if="order.orderNo" style="line-height:35px">
				<el-form ref="applyForm" :model="afterSaleApply" :rules="applyFormRule">
					<el-row>
						<!-- <el-col :span="4">售后类型：</el-col> -->
						<el-form-item label="售后类型：" prop="type" :inline-message="true" required>
							<el-col :span="4">
								<el-select v-model="afterSaleApply.type" size="mini">
									<el-option :value="5" label="退款" />
									<el-option :value="1" label="其它" />
								</el-select>
							</el-col>
							<el-col v-if="afterSaleApply.type === afterSaleApplyTypeEnum.else" :span="4">
								<el-input v-model="afterSaleApply.typeDesc" type="text" size="mini" placeholder="请填写类型"
									maxlength="100" show-word-limit />
							</el-col>
						</el-form-item>
					</el-row>

					<el-row>
						<el-form-item label="售后原因：" prop="reason" :inline-message="true" required>
							<el-col :span="4">
								<el-select v-model="afterSaleApply.reason" size="mini">
									<el-option v-for="rs in reason" :key="rs.value" :label="rs.text"
										:value="rs.value" />
								</el-select>
							</el-col>
							<el-col v-if="afterSaleApply.reason === afterSaleApplyReasonEnum.else" :span="4">
								<el-input v-model="afterSaleApply.reasonDesc" type="text" size="mini"
									placeholder="请填写原因" maxlength="300" show-word-limit />
							</el-col>
						</el-form-item>
						<!-- <el-col :span="4">售后原因：</el-col> -->
					</el-row>
					<el-row>
						<!-- <el-col :span="4">问题描述：</el-col> -->
						<el-form-item label="问题描述：" prop="desc" :inline-message="true" style="margin-left:0.6rem">
							<el-col :span="8">
								<el-input v-model="afterSaleApply.desc" type="textarea" rows="3" size="mini"
									maxlength="500" show-word-limit />
							</el-col>
						</el-form-item>
					</el-row>
				</el-form>
				<div v-if="order.orderNo" style="text-align:center;">
					<el-divider class="divider-bottom" />
					<span slot="footer" style="text-align:center;">
						<el-button size="small" type="primary" :loading="applying" :disabled="applying"
							@click="requestApply">申请售后</el-button>
						<el-button size="small" @click="handleCancelApply">取 消</el-button>
					</span>
				</div>
			</el-card>
			<el-card>
				<div style="line-height:30px;color:#A9A9A9">
					<el-row style="font-size:16px">友情提醒</el-row>
					<el-row>1、本功能仅面向前符合退款规则的订单，规则外的请联系客服进行处理。</el-row>
					<el-row>2、单个订单只能提交一次，被拒绝后将不能再次发起，请谨慎操作，订单一旦取消将无法恢复。</el-row>
					<el-row>3、申请提交后，平台将会尽快帮您处理，请耐心等待30分钟（遇周末节假日会适当延长）。</el-row>
				</div>
			</el-card>
		</el-dialog>
	</div>
</template>

<script>
	import {
		GetOrder,
		QueryOrderAfterSales
	} from '@/api/order/order'
	import {
		QueryAfterSaleApplys,
		Apply
	} from '@/api/aftersale/aftersale'
	import waves from '@/directive/waves'
	import moment from 'moment'
	import elDragDialog from '@/directive/el-drag-dialog'
	import {
		deepClone
	} from '@/utils/index'
	export default {
		name: 'AfterSalesList',
		directives: {
			waves,
			elDragDialog
		},
		data() {
			var checkTypeDesc = (rule, value, callback) => {
				if (value === this.afterSaleApplyTypeEnum.else) {
					if (!this.afterSaleApply.typeDesc) {
						return callback(new Error('请填写类型'))
					}
				}
				callback()
			}
			var checkReasonDesc = (rule, value, callback) => {
				if (value === this.afterSaleApplyReasonEnum.else) {
					if (!this.afterSaleApply.reasonDesc) {
						return callback(new Error('请填写类型'))
					}
				}
				callback()
			}
			return {
				searchCondition1: {
					orderDates: [],
					orderNo: '',
					hotelName: '',
					orderStatus: '',
					checkInName: '',
					checkInPhone: '',
					status: '',
					applyTimes: []
				},
				searchCondition: {
					orderDates: [],
					orderNo: '',
					hotelName: '',
					orderStatus: '',
					checkInName: '',
					checkInPhone: '',
					status: '',
					applyTimes: []
				},
				colData: [{
						title: "订单号",
						istrue: true
					},
					{
						title: "售后单号",
						istrue: true
					},
					{
						title: "酒店名称",
						istrue: true
					},
					{
						title: "入离日期",
						istrue: true
					},
					{
						title: "订单金额",
						istrue: true
					},
					{
						title: "入住人",
						istrue: true
					},
					{
						title: "入住人电话",
						istrue: true
					},
					{
						title: "订单状态",
						istrue: true
					},
					{
						title: "售后状态",
						istrue: true
					},
					{
						title: "申请时间",
						istrue: true
					},
					{
						title: "操作",
						istrue: true
					},
				],
				colOptions: ["订单号", "售后单号", "酒店名称", "入离日期", "订单金额", "入住人", "入住人电话", "订单状态", "售后状态", "申请时间", "操作", ], //默认全选
				colSelect: ["订单号", "售后单号", "酒店名称", "入离日期", "订单金额", "入住人", "入住人电话", "订单状态", "售后状态", "申请时间", "操作", ], //选中
				orders: [],
				OrderStatusEnum: {
					WAITPAY: 5,
					RESERVEING: 15,
					WAITCONFIRM: 20
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
				orderSearchCondition: {
					orderNo: '',
					checkInName: '',
					checkInPhone: ''
				},
				OrderStatus: [

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
				reason: [{
						text: '到店无房',
						value: 5
					},
					{
						text: '查无预订',
						value: 10
					},
					{
						text: '酒店不接待',
						value: 15
					},
					{
						text: '酒店设施',
						value: 20
					},
					{
						text: '客户因素',
						value: 25
					},
					{
						text: '不可抗因素',
						value: 30
					},
					{
						text: '其他',
						value: 100
					}
				],
				afterSaleApplies: [],
				tableLoading: false,
				totalCount: 0,
				pageSize: 10,
				pageIndex: 1,
				applyVisible: false,
				order: {},
				orderNo: '',
				queryTip: '请先查询订单',
				afterSaleApply: {},
				applying: false,
				afterSaleApplyTypeEnum: {
					else: 1
				},
				afterSaleApplyReasonEnum: {
					else: 1
				},
				afterSaleApplyStatusEnum: {

				},
				applyFormRule: {
					type: [{
							required: true,
							message: '请选择售后类型',
							trigger: 'change'
						},
						{
							validator: checkTypeDesc,
							trigger: 'change'
						}
					],
					reason: [{
							required: true,
							message: '请选择售后原因',
							trigger: 'change'
						},
						{
							validator: checkReasonDesc,
							trigger: 'change'
						}
					]
				}
			}
		},
		created() {
			this.init()
		},
		watch: {
			colOptions(valArr) {
				var arr = this.colSelect.filter(i => valArr.indexOf(i) < 0); // 未选中
				this.colData.filter(i => {
					if (arr.indexOf(i.title) != -1) {
						i.istrue = false;
						this.$nextTick(() => {
							this.$refs.tableDataRef.doLayout();
						});
					} else {
						i.istrue = true;
						this.$nextTick(() => {
							this.$refs.tableDataRef.doLayout();
						});
					}
				});
			}
		},
		methods: {
			init() {
				this.fetchAfterSaleApplies()
			},
			openUrl(obj) {
				// this.qiyu.Config({
				// 	type: "售后订单",
				// 	orderId: obj.id,
				// 	statu:  obj.statu
				// })
			},
			fetchAfterSaleApplies(tip) {
				this.tableLoading = true

				const condition = {
					...this.searchCondition1,
					orderDate: {
						item1: this.searchCondition1.orderDates ? this.searchCondition1.orderDates[0] : '',
						item2: this.searchCondition1.orderDates ? this.searchCondition1.orderDates[1] : ''
					},
					applyTime: {
						item1: this.searchCondition1.applyTimes ? this.searchCondition1.applyTimes[0] : '',
						item2: this.searchCondition1.applyTimes ? this.searchCondition1.applyTimes[1] : ''
					},
					PageSize: this.pageSize,
					PageIndex: this.pageIndex
				}

				QueryAfterSaleApplys(condition).then(res => {
					this.totalCount = res.data.total
					this.afterSaleApplies = res.data.rows
					this.tableLoading = false

					if (tip) {
						this.$message('搜索成功')
					}
				})
			},
			fetchOrderAfterSales() {
				this.orderSearchTableLoading = true

				const condition = {
					...this.orderSearchCondition1,
					PageSize: this.pageSize1,
					PageIndex: this.pageIndex1
				}
				QueryOrderAfterSales(condition).then(res => {
					this.totalCount1 = res.data.total
					this.orderAfterSales = res.data.rows

					this.orderSearchTableLoading = false
				})
			},
			handleSearch(type) {
				if (type === 'refresh') {
					this.fetchAfterSaleApplies()
				} else {
					this.searchCondition1 = deepClone(this.searchCondition)
					this.pageIndex = 1
					this.fetchAfterSaleApplies(true)
				}
			},
			handleReset(fname) {
				this.$refs[fname].resetFields()
			},
			handleApply(order) {
				this.order = order

				this.applyVisible = true
				this.orderAfterSaleVisible = false
			},
			handleCancelApply() {
				this.applyVisible = false
			},
			fetchOrder() {
				const orderNo = this.orderNo
				if (!orderNo) {
					return
				}

				GetOrder(orderNo).then(res => {
					if (res.result) {
						this.order = res.data
					} else {
						this.queryTip = res.message
					}

					this.loadOrder = false
				}).catch(err => {
					this.queryTip = err.message
				})
			},
			clearApplyOrderNo() {
				this.orderNo = ''
			},
			requestApply() {
				this.applying = true
				this.$refs['applyForm'].validate((valid) => {
					if (!valid) {
						this.applying = true
						return
					}
					const apply = {
						orderNo: this.order.orderNo,
						...this.afterSaleApply
					}
					Apply(apply).then(res => {
						this.applying = false
						if (res.data) {
							this.applyVisible = false
							this.closeApplyWindow()

							this.$message.info('售后申请成功')
							this.fetchAfterSaleApplies()
						} else {
							this.$message.error('售后申请失败，请稍后再试')
						}
					}).catch(err => {
						this.applying = false
					})
				})
			},
			closeApplyWindow() {
				this.orderNo = ''
				this.order = {}
				this.afterSaleApply = {}
				this.orderAfterSaleVisible = true
			},
			closeOrderAfterWindow(auto) {
				if (!auto) {
					this.orderAfterSales = []
					this.handleReset('orderSearchForm')
					this.totalCount1 = 0
					this.pageSize1 = 5
					this.pageIndex1 = 1
				}
			},

			onPageChange(index) {
				this.pageIndex = index
				this.fetchAfterSaleApplies()
			},
			handleSizeChange(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.fetchAfterSaleApplies()
			},
			goDetail(orderNo) {
				this.$router.push({
					path: `/aftersale/detail/${orderNo}`
				})
			},
			goHotel(hotelCode) {
				this.$router.push({
					path: `/hotel/${hotelCode}`
				})
			},
			dateTimeToDate(val) {
				return moment(val).format('YYYY-MM-DD')
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => {
					return v[j]
				}))
			},
			copySuccess() {
				this.$message({
					message: '复制成功',
					type: 'success'
				});
			},
			copyError() {
				this.$message({
					message: '复制失败',
					type: 'warning'
				});
			},
		}
	}
</script>

<style scoped>
	.copy {
		font-size: 12px;
		border: 1px solid #ccc;
		padding: 3px;
		margin-left: 5px;
		border-radius: 3px;
		cursor: pointer;
	}
	
	.copy:hover {
		border: 1px solid #006699;
	}
	.content {
		margin: 10px;
	}

	.pagination {
		margin-top: 1rem;
	}

	.divider {
		margin-top: 15px;
		margin-bottom: 0;
	}

	.divider-bottom {
		margin-top: 0;
		margin-bottom: 15px;
	}
</style>

<style scoped>
	.el-dialog__body {
		padding-top: 10px;
	}

	.el-form--inline .el-form-item {
		margin-bottom: 0;
	}

	.tools-btn {
		margin-top: 1rem;
	}

	.searchForm>>>.el-form-item {
		width: 120px;
	}

	.searchForm>>>.el-range-editor {
		width: 230px !important;
	}

	.el-steps--simple {
		background-color: #fff;
	}

	.content>>>.el-steps--simple {
		padding: 0
	}

	.content>>>.el-step__title,
	.is-flex {
		max-width: 100% !important;
	}
</style>
