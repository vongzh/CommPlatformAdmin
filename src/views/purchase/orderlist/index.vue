<template>
	<div class="content">
		<SearchBlock class="filter-container" :show="false">
			<el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top" class="searchForm">
				<el-form-item label="第三方订单号" prop="thirdOrderNo" style="width: 200px;">
					<el-input v-model="searchCondition.thirdOrderNo" clearable placeholder="第三方订单号"
						class="filter-item input-search" />
				</el-form-item>
				<el-form-item label="订单号" prop="orderNo">
					<el-input v-model="searchCondition.orderNo" clearable placeholder="订单号"
						class="filter-item input-search" />
				</el-form-item>
				<el-form-item label="酒店名称" prop="hotelName" style="width: 200px;">
					<el-input v-model="searchCondition.hotelName" clearable placeholder="酒店名称"
						class="filter-item input-search" />
				</el-form-item>
				<el-form-item label="入住人" prop="checkInName">
					<el-input v-model="searchCondition.checkInName" clearable placeholder="入住人"
						class="filter-item input-search" />
				</el-form-item>
				<el-form-item label="入住人电话" prop="checkInPhone">
					<el-input v-model="searchCondition.checkInPhone" clearable placeholder="入住人电话"
						class="filter-item input-search" />
				</el-form-item>
				<el-form-item label="订单状态" prop="orderStatus">
					<el-select v-model="searchCondition.orderStatus" clearable>
						<el-option v-for="os in OrderStatus" :key="os.value" :label="os.text" :value="os.value" />
					</el-select>
				</el-form-item>
				<el-form-item prop="orderDates" style="width: 230px;">
					<span slot="label">
						<el-radio-group v-model="dateType" @change="changeDate">
							<el-radio :label="1">预定日期</el-radio>
							<el-radio :label="0">入离日期</el-radio>
						</el-radio-group>
					</span>
					<el-date-picker v-model="date" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始日期"
						end-placeholder="结束日期" align="right" @change="changeDate" />
				</el-form-item>

				<el-form-item label="　" style="user-select: none;width: 200px;">
					<el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search"
						@click="searchOrder()">搜索</el-button>
					<el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close"
						@click="handleReset('searchForm')">重置</el-button>
				</el-form-item>
				<br />
			</el-form>
		</SearchBlock>
		<el-card>

			<div class="tools">
				<el-row>
<!-- 					<el-button-group>
						<el-button v-waves size="medium" icon="el-icon-refresh" @click="searchOrder('refresh')" />
					</el-button-group> -->
					<el-button type="text" style="float:right" @click="exportOrders()">导出列表</el-button>
<!-- 					<el-popover placement="top" width="400" trigger="click">
						<el-col :span="24">
							<el-checkbox-group v-model="colOptions">
								<el-col :span="8" v-for="item in colSelect" :label="item" :key="item">
									<el-checkbox :label="item">{{item}}</el-checkbox>
								</el-col>
							</el-checkbox-group>
						</el-col>
						<el-button slot="reference">设置</el-button>
					</el-popover> -->
				</el-row>
			</div>

			<el-table ref="tableDataRef" id="ordersTable" v-loading="tableLoading" :data="orders" :fit="true" stripe
				highlight-current-row>
				<el-table-column label="订单号/酒店名称" min-width="8%" v-if="colData[0].istrue">
					<template slot-scope="scope">
						<el-link type="info" @click="goOrder(scope.row.orderNo)">{{ scope.row.orderNo }}</el-link><br />
						{{ scope.row.hotelName }}
					</template>
				</el-table-column>
				<!-- 			<el-table-column label="酒店名称" min-width="8%" v-if="colData[1].istrue">
					<template slot-scope="scope">
						<el-link type="info" @click="goHotel(scope.row.hotelCode)">{{ scope.row.hotelName }}</el-link>
					</template>
				</el-table-column> -->
				<el-table-column prop="roomTypeName" label="房型" min-width="8%" v-if="colData[2].istrue" />

				<el-table-column v-if="colData[3].istrue" label="入离日期" min-width="5%">
					<template slot-scope="scope">
						{{ dateTimeToDate(scope.row.checkInDate).substr(5) }}<br />{{ dateTimeToDate(scope.row.checkOutDate).substr(5) }}
					</template>
				</el-table-column>
				<el-table-column prop="orderAmount" label="订单金额" min-width="6%" v-if="colData[4].istrue">
					<template slot-scope="scope">
						¥{{scope.row.orderAmount}}
					</template>
				</el-table-column>
				<el-table-column prop="checkInName" label="入住人" min-width="5%" v-if="colData[5].istrue" />
				<el-table-column prop="checkInPhone" label="入住人电话" min-width="6%" v-if="colData[6].istrue" />

				<el-table-column prop="roomCount" label="数量" min-width="3%" v-if="colData[7].istrue" />
				<el-table-column prop="orderDate" label="预定日期" min-width="8%" v-if="colData[8].istrue" />

				<el-table-column label="订单状态" min-width="5%" v-if="colData[9].istrue">
					<template slot-scope="scope">
						<!-- <el-tag effect="light" :type="getOrderStatusTag(scope.row.orderStatus)">{{ scope.row.orderStatusDesc }}</el-tag> -->
						<el-col effect="light" :type="getOrderStatusTag(scope.row.orderStatus)">
							{{ scope.row.orderStatusDesc }}
						</el-col>
					</template>
				</el-table-column>
				<el-table-column v-if="colData[10].istrue" label="第三方订单号" min-width="7%">
					<template slot-scope="scope">
						{{ scope.row.thirdOrderNo }}<span
							>【{{ getPlatName(scope.row.sourcePlatformId) }}】</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" min-width="10%" v-if="colData[11].istrue">
					<template slot-scope="scope">
						<!-- <el-button v-if="OrderStatusEnum.WaitPay===scope.row.orderStatus" type="danger" size="mini" @click="goPay(scope.row.orderNo)">支付</el-button>
            <el-button v-if="OrderStatusEnum.WaitConfirm===scope.row.orderStatus" type="warning" size="mini" @click="remind(scope.row.orderNo)">{{ scope.row.isReminder === YNEnum.Y?'已':'' }}催单</el-button> -->
						<div style="display: flex;">
							<el-link style="color:#DF9524;margin-right: 10px;" size="mini" @click="goOrder(scope.row.orderNo)" >详情</el-link>
							<!-- <el-link style="color:#DF9524;margin-right: 10px;" size="mini" @click="openUrl({id:scope.row.orderNo,statu:scope.row.orderStatusDesc})" >咨询</el-link> -->
						</div>
					</template>
				</el-table-column>
			</el-table>

			<div class="pagination">
				<el-pagination background layout="sizes,total, prev, pager, next, jumper" :total="totalCount"
					:page-size="pageSize" :page-sizes="[10,20, 50, 100]" :current-page="pageIndex"
					@current-change="onPageChange" @size-change="handleSizeChange" />
			</div>
		</el-card>
	</div>
</template>

<script>
	import {
		Reminder
	} from '@/api/order/order'
	import {
		QueryCustomerOrders
	} from '@/api/order/order'
	import waves from '@/directive/waves'
	import moment from 'moment'
	import {
		deepClone
	} from '@/utils/index'
	import {
		AddOperationLog
	} from '@/api/sys/log'
	import SearchBlock from '@/components/SearchBlock'
	import {
		GetPlatformDict,
	} from '@/api/dict/dict'
	export default {
		name: 'OrderList',
		directives: {
			waves
		},
		components: {
			SearchBlock
		},
		data() {
			return {
				searchCondition1: {
					orderDates: [],
					orderNo: '',
					hotelName: '',
					orderStatus: '',
					checkInName: '',
					checkInPhone: '',
					orderDate: {},
					thirdOrderNo: ""
				},
				searchCondition: {
					orderDates: [],
					orderNo: '',
					hotelName: '',
					orderStatus: '',
					checkInName: '',
					checkInPhone: '',
					orderDate: {},
					thirdOrderNo: ''
				},
				colData: [{
						title: "订单号",
						istrue: true
					},
					{
						title: "酒店名称",
						istrue: true
					},
					{
						title: "房型",
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
						title: "数量",
						istrue: true
					},
					{
						title: "下单日期",
						istrue: true
					},
					{
						title: "订单状态",
						istrue: true
					},
					{
						title: "第三方订单号",
						istrue: true
					},
					{
						title: "操作",
						istrue: true
					},
				],
				colOptions: ["订单号", "酒店名称", "房型", "入离日期", "订单金额", "入住人", "入住人电话", "数量", "下单日期", "订单状态", "第三方订单号",
					"操作",
				], //默认全选
				colSelect: ["订单号", "酒店名称", "房型", "入离日期", "订单金额", "入住人", "入住人电话", "数量", "下单日期", "订单状态", "第三方订单号",
					"操作",
				], //选中
				orders: [],
				OrderStatusEnum: {
					WAITPAY: 5,
					RESERVEING: 15
				},
				OrderPaymentStatusEnum: {
					WAITPAY: 0,
					PAYSUCCESS: 2,
					PAYFAILTURE: 4
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
				tableLoading: false,
				totalCount: 0,
				pageSize: 10,
				pageIndex: 1,
				dateType: 1,
				date: [],
				merchantsDict: [{
						dictLabel: "51Zhu",
						dictValue: "1",
					},
					{
						dictLabel: "美团",
						dictValue: "2",
					},{
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
						dictLabel: "携程代订",
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
			}
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
		created() {
			this.init()
		},
		methods: {
			init() {
				this.fetchOrders()
				this.getDict()
			},
			openUrl(obj){
				this.qiyu.Config({
					type: "订单列表",
					orderId: obj.id,
					statu: obj.statu
				})
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
			getPlatName(platformId){
				let arr = this.merchantsDict.filter(item => {
					return item.dictValue == platformId
				})
				return arr.length > 0 ? arr[0].dictLabel : "未知";
			},
			searchOrder(type) {
				if (type === 'refresh') {
					this.fetchOrders()
				} else {
					this.searchCondition1 = deepClone(this.searchCondition)
					this.pageIndex = 1
					this.fetchOrders(true)
				}
			},
			fetchOrders(tip) {
				this.tableLoading = true
				this.validForm()
				const condition = {
					...this.searchCondition1,
					orderDate: {
						item1: this.searchCondition.orderDates ? this.searchCondition.orderDates[0] : '',
						item2: this.searchCondition.orderDates ? this.searchCondition.orderDates[1] : ''
					},
					orderTime: {
						item1: this.searchCondition.OrderTimes ? this.searchCondition.OrderTimes[0] : '',
						item2: this.searchCondition.OrderTimes ? this.searchCondition.OrderTimes[1] : ''
					},
					pageSize: this.pageSize,
					pageIndex: this.pageIndex
				}

				QueryCustomerOrders(condition).then(res => {
					this.orders = res.data.rows
					for (var i = 0; i < this.orders.length; i++) {
						this.orders[i].roomCount += '间'
					}

					this.totalCount = res.data.total

					this.tableLoading = false

					if (tip) {
						this.$message('搜索成功')
					}
				})
			},
			remind(orderNo) {
				Reminder(orderNo).then(res => {
					if (res.data) {
						this.pageIndex = 1
						this.fetchOrders()
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
			handleReset(formName) {
				this.date = []
				this.$refs[formName].resetFields()
			},
			getOrderPaymentStatusTag(paymentStatus) {
				let tag = ''
				switch (paymentStatus) {
					case this.OrderPaymentStatusEnum.PAYFAILTURE:
						tag = 'danger'
						break
					case this.OrderPaymentStatusEnum.PAYSUCCESS:
						tag = 'success'
						break
				}
				return tag
			},
			getOrderStatusTag(orderStatus) {
				let tag = ''
				switch (orderStatus) {
					case this.OrderStatusEnum.WaitConfirm:
						tag = 'danger'
						break
					case this.OrderStatusEnum.Service:
						tag = 'warning'
						break
					case this.OrderStatusEnum.WaitIn:
						tag = 'success'
						break
				}
				return tag
			},
			handleSizeChange(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.fetchOrders()

			},
			onPageChange(index) {
				this.pageIndex = index
				this.fetchOrders()
			},
			goPay(orderNo) {
				this.$router.push({
					path: '/payment',
					query: {
						orderNo
					}
				})
			},
			goOrder(orderNo) {
				this.$router.push({
					path: `/order/${orderNo}`
					// query: {
					//   orderNo
					// }
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
			exportOrders() {
				this.validForm()
				const condition = {
					...this.searchCondition,
					orderDate: {
						item1: this.searchCondition.orderDates ? this.searchCondition.orderDates[0] : '',
						item2: this.searchCondition.orderDates ? this.searchCondition.orderDates[1] : ''
					},
					orderTime: {
						item1: this.searchCondition.OrderTimes ? this.searchCondition.OrderTimes[0] : '',
						item2: this.searchCondition.OrderTimes ? this.searchCondition.OrderTimes[1] : ''
					},
					PageSize: 10000,
					PageIndex: this.pageIndex
				}
				QueryCustomerOrders(condition).then(res => {
					const orders = res.data.rows
					import('@/vendor/Export2Excel').then(excel => {
						const filterVal = ['orderNo', 'hotelName', 'roomTypeName', 'checkInName',
							'checkInPhone', 'checkInDate', 'checkOutDate', 'roomCount', 'orderDate',
							'invoiceDrawerDesc', 'orderAmount', 'orderStatusDesc', 'paymentStatusDesc',
							'refundStatusDesc'
						]
						const data = this.formatJson(filterVal, orders)
						excel.export_json_to_excel({
							header: ['订单号', '酒店', '房型', '入住人', '入住人电话', '入住日期', '离店日期', '数量',
								'下单日期', '开票方', '订单金额', '订单状态', '支付状态', '退款状态'
							],
							data: data,
							filename: this.filename,
							autoWidth: this.autoWidth,
							bookType: this.bookType
						})
					})
					AddOperationLog('CUSTOMER_EXPORT_ALLORDER', JSON.stringify(condition))
				})
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => {
					return v[j]
				}))
			},
			changeDate() {
				let val = this.date
				if (val) {
					if (this.dateType == 0) {
						this.searchCondition.orderDates = val
						this.searchCondition.OrderTimes = []
					} else {
						this.searchCondition.orderDates = []
						this.searchCondition.OrderTimes = val
					}
				} else {
					this.searchCondition.orderDates = []
					this.searchCondition.OrderTimes = []
				}
			},
			validForm() {
				var o = this.searchCondition
				if (o.thirdOrderNo == "" && o.orderNo == "" && o.checkInName == "" && o.orderStatus == "" && !(this.date &&
						this.date.length > 0) &&
					o.hotelName == "" && o.checkInPhone == "") {
						let year = moment(new Date()).format('YYYY')
					this.searchCondition.OrderTimes = [year + '-01-01', (Number(year) + 1) + '-01-01']
					// this.searchCondition.OrderTimes = [this.dateTimeToDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)),
					// 	this.dateTimeToDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))
					// ]
				} else {
					if (!(this.date && this.date.length > 0)) {
						this.searchCondition.orderDates = []
						this.searchCondition.OrderTimes = []
					}
				}
			},
		}
	}
</script>

<style scoped>
	.content {
		margin: 10px;
	}

	.el-form--inline .el-form-item {
		margin-bottom: 0;
	}

	.pagination {
		margin-top: 1rem;
	}

	.searchForm>>>.el-form-item {
		width: 120px;
	}

	.searchForm>>>.el-range-editor {
		width: 230px !important;
	}
</style>
