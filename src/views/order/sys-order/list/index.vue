<template>
	<div class="content">
		<div class="filter-container">
			<el-card>
				<el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top"
					class="searchForm">
					<el-form-item label="第三方订单号" prop="thirdOrderNo" style="width: 140px;">
						<el-input v-model="searchCondition.thirdOrderNo" clearable placeholder="第三方订单号"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="订单号" prop="orderNo">
						<el-input v-model="searchCondition.orderNo" clearable placeholder="订单号"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="订单状态" prop="orderStatus">
						<el-select v-model="searchCondition.orderStatus" clearable>
							<el-option v-for="os in OrderStatus" :key="os.value" :label="os.text" :value="os.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="酒店名称" prop="hotelName">
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
					<el-form-item label="预定日期" prop="orderTimes" style="width: 230px;">
						<el-date-picker v-model="searchCondition.orderTimes" type="daterange" value-format="yyyy-MM-dd"
							start-placeholder="开始日期" end-placeholder="结束日期" align="right" />
					</el-form-item>
					<el-form-item label="入离日期" prop="orderDates" style="width: 230px;">
						<el-date-picker v-model="searchCondition.orderDates" type="daterange" value-format="yyyy-MM-dd"
							start-placeholder="入住日期" end-placeholder="离店日期" align="right" />
					</el-form-item>
							<el-form-item label="　" style="user-select: none;width: auto;"> <!-- width: 100%;margin-top: 10px;text-align: center; -->
						<el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search"
							@click="handleSearch()">搜索</el-button>
						<el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close"
							@click="handleReset('searchForm')">重置</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
		<el-card>
			<!-- <div slot="header">
        <el-button type="text" @click="exportOrders"><br></el-button>
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
			<el-table ref="tableDataRef" v-loading="tableLoading" :data="orders" :fit="true"  stripe>
				<el-table-column v-if="colData[0].istrue" label="订单号/酒店名称" min-width="7%">
					<template slot-scope="scope">
								<el-link type="info" @click="goOrder(scope.row.orderNo)">
									<i v-if="scope.row.sourcePlatformId===30">
										<svg-icon icon-class="qunaer" />
									</i>
									<i v-if="scope.row.sourcePlatformId===40" style="font-size:24px">
										<svg-icon icon-class="tongcheng" />
									</i>
									<i v-if="scope.row.sourcePlatformId===2" style="font-size:24px">
										<svg-icon icon-class="meituan" />
									</i>
									<i v-if="scope.row.sourcePlatformId===9">
										<svg-icon icon-class="xiecheng" />
									</i>
									<i v-if="scope.row.sourcePlatformId===5" style="font-size:24px">
										<svg-icon icon-class="feizhu" />
									</i>
									{{ scope.row.orderNo }}
								</el-link>
<i class="el-icon-document-copy copy" v-clipboard:copy="scope.row.orderNo"
							v-clipboard:success="copySuccess" v-clipboard:error="copyError"></i>
								<br />
						<span>{{ scope.row.hotelName }}</span>
						<span>{{ scope.row.tags }}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column label="平台" min-width="35%">
          <template slot-scope="scope">
            {{ scope.row.platform }}
          </template>
        </el-table-column> -->
				<!-- <el-table-column label="酒店名称" prop="hotelName" min-width="10%" v-if="colData[1].istrue"> -->
				<!-- <template slot-scope="scope">
            <el-link type="info" @click="goHotel(scope.row.hotelCode)">{{ scope.row.hotelName }}</el-link>
          </template> -->
				</el-table-column>
				<el-table-column prop="roomTypeName" label="房型" min-width="5%" v-if="colData[2].istrue" />
				<el-table-column prop="bookingDaysShow" label="间/夜" min-width="4%" v-if="colData[3].istrue" />
				<el-table-column label="入离日期" min-width="4%" v-if="colData[4].istrue">
					<template slot-scope="scope">
						{{ dateTimeToDate(scope.row.checkInDate).substr(5) }}<br />{{ dateTimeToDate(scope.row.checkOutDate).substr(5) }}
					</template>
				</el-table-column>
				<el-table-column prop="orderAmount" label="订单金额" min-width="4%" v-if="colData[5].istrue" >
					<template slot-scope="scope">
						¥{{scope.row.orderAmount}}
					</template>
				</el-table-column>
				<el-table-column prop="checkInName" label="入住人" min-width="4%" v-if="colData[6].istrue" />
				<el-table-column prop="checkInPhone" label="入住人电话" min-width="6%" v-if="colData[7].istrue" />
				<!-- <el-table-column prop="invoiceDrawerDesc" label="开票方" /> -->
				<el-table-column prop="orderDate" label="预定日期" min-width="7%" v-if="colData[8].istrue" />
				<!-- <el-table-column prop="customerName" label="客户名称" />
        <el-table-column prop="customerNo" label="客户编号" /> -->
				<el-table-column label="订单状态" min-width="4%" v-if="colData[9].istrue">
					<template slot-scope="scope">
						  <font v-if="scope.row.orderStatus==OrderStatusEnum.RESERVEING&&(scope.row.minutes> 2
							|| scope.row.hours>=1)" style="color:#EC9316">{{ scope.row.orderStatusDesc }} </font>
						         <font v-else-if="scope.row.orderStatus==OrderStatusEnum.Canceled" style="color:green">
							{{ scope.row.orderStatusDesc }}
						</font>  
						        <font v-else style="color:##606266">{{ scope.row.orderStatusDesc }}</font>
					</template>
				</el-table-column>
				<el-table-column label="采购状态" min-width="5%" v-if="colData[10].istrue">
					<template slot-scope="scope">
						<!-- <el-tag effect="plain" :type="getOrderPaymentStatusTag(scope.row.paymentStatus)">{{ scope.row.paymentStatusDesc }}</el-tag> -->
						<el-col>{{ scope.row.purchaseStatusDesc }}</el-col>
					</template>
				</el-table-column>
				<!-- <el-table-column label="处理状态">
          <template slot-scope="scope">
            <el-tag effect="plain" :type="getOrderHandlerStatusTag(scope.row.orderHandleStatus)">{{ scope.row.orderHandleStatusDesc }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="确认状态">
          <template slot-scope="scope">
            <el-tag effect="plain" :type="getOrderConfirmStatusTag(scope.row.confirmStatus)">{{ scope.row.confirmStatusDesc }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="退款状态">
          <template slot-scope="scope">
            <el-tag effect="plain">{{ scope.row.refundStatusDesc }}</el-tag>
          </template>
        </el-table-column> -->
				<el-table-column label="操作" min-width="3%" v-if="colData[11].istrue">
					<template slot-scope="scope">
						<el-link style="color:#DF9524" size="mini" @click="goOrder(scope.row.orderNo)"
							v-if="colData[12].istrue">详情</el-link>
					</template>
				</el-table-column>
				<el-table-column label="处理时间" min-width="5%" v-if="colData[13].istrue">
					<template slot-scope="scope">
						{{ scope.row.remaining }}
					</template>
				</el-table-column>
				<el-table-column label="第三方单号" min-width="6%" v-if="colData[12].istrue">
					<template slot-scope="scope">
						{{ scope.row.thirdOrderNo }}<span
							v-if="scope.row.thirdOrderNo">【{{ getPlatName(scope.row.sourcePlatformId)  }}】</span>
					</template>
				</el-table-column>
					<el-table-column v-if="colData[14].istrue" label="数据渠道/开票方" min-width="7%">
					<template slot-scope="scope">
						{{ scope.row.platform }}
							<span><b v-if="scope.row.invoiceTypeDesc">【{{scope.row.invoiceTypeDesc }}】</b> </span>
					</template>
				</el-table-column>

				<!-- <el-table-column prop="modifierDesc" label="操作人" min-width="5%"/> -->
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
		QueryBackOrders
	} from '@/api/order/order'
	import waves from '@/directive/waves'
	import moment from 'moment'
	import {
		deepClone
	} from '@/utils/index'
	import {
		AddOperationLog
	} from '@/api/sys/log'
	import {
		GetPlatformDict,
	} from '@/api/dict/dict'
	export default {
		name: 'SysOrderList',
		directives: {
			waves
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
					orderType: 2001,
					platformId: '',
					thirdOrderNo: '',
					orderTimes: ''
				},
				searchCondition: {
					orderDates: [],
					orderNo: '',
					hotelName: '',
					orderStatus: '',
					checkInName: '',
					checkInPhone: '',
					orderType: 2001,
					platformId: '',
					thirdOrderNo: '',
					orderTimes: ''
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
						title: "间/夜",
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
						title: "下单日期",
						istrue: true
					},
					{
						title: "订单状态",
						istrue: true
					},
					{
						title: "采购状态",
						istrue: true
					},
					{
						title: "操作",
						istrue: true
					},
					{
						title: "第三方订单号",
						istrue: true
					},
					{
						title: "处理时间",
						istrue: true
					},
					{
						title: '数据渠道',
						istrue: true
					}
				],
				colOptions: ["订单号", "酒店名称", "房型", "间/夜", "入离日期", "订单金额", "入住人", "入住人电话", "下单日期", "订单状态", "采购状态", "操作",
					"第三方订单号", "处理时间",
				], //默认全选
				colSelect: ["订单号", "酒店名称", "房型", "间/夜", "入离日期", "订单金额", "入住人", "入住人电话", "下单日期", "订单状态", "采购状态", "操作",
					"第三方订单号", "处理时间",
				], //选中
				orders: [],
				orderHandlerTypeEnum: {
					SysOrder: 2001
				},
				OrderStatusEnum: {
					//待支付
					WAITPAY: 5,
					//预定中
					RESERVEING: 15,
					//待确认
					WAITCONFIRM: 20,
					//预定成功
					BookSuccessfully: 25,
					//预定失败
					BookingFailure: 30,
					//已消费
					Consumed: 35,
					//已消费退款
					RefundConsumed: 40,
					//已取消
					Canceled: -1,
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
				OrderStatus: [{
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
				timer: {},
				merchantsDict: [{
						dictLabel: "51Zhu",
						dictValue: "1",
					},
					{
						dictLabel: "美团",
						dictValue: "2",
					},
					{
						dictLabel: "51ZhuAPI",
						dictValue: "3",
					},
					{
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
				clearTimeout(this.timer)
				this.fetchOrders()
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
			getPlatName(platformId){
				let arr = this.merchantsDict.filter(item => {
					return item.dictValue == platformId
				})
				return arr.length > 0 ? arr[0].dictLabel : "未知";
			},
			fetchOrders(tip) {
				this.tableLoading = true
				const condition = {
					...this.searchCondition1,
					orderDate: {
						item1: this.searchCondition1.orderDates ? this.searchCondition1.orderDates[0] : '',
						item2: this.searchCondition1.orderDates ? this.searchCondition1.orderDates[1] : ''
					},
					OrderTime: {
						item1: this.searchCondition1.orderTimes ? this.searchCondition1.orderTimes[0] : '',
						item2: this.searchCondition1.orderTimes ? this.searchCondition1.orderTimes[1] : ''
					},
					PageSize: this.pageSize,
					PageIndex: this.pageIndex
				}
				QueryBackOrders(condition).then(res => {
					this.totalCount = res.data.total
					this.orders = res.data.rows
					if (res.data.rows && res.data.rows.length > 0) {
						this.timer = setInterval(() => {
							this.orders = this.orders.map((value, arr, index) => {
									if (value.paymentStatus === this.OrderPaymentStatusEnum
									.PAYSUCCESS && (value.orderStatus === this.OrderStatusEnum
									.RESERVEING||value.orderStatus === this.OrderStatusEnum
									.WAITCONFIRM)) {
									var currentDate = moment()
									var releaseDate = moment(value.payTime)
									const diff = currentDate.diff(releaseDate)
									const diffDuration = moment.duration(diff)
									const months = diffDuration.months()
									const days = diffDuration.days()
									const hours = diffDuration.hours()
									const minutes = diffDuration.minutes()
									const seconds = diffDuration.seconds()
									value.remaining = `${hours}时${minutes}分${seconds}秒`
									value.minutes = `${minutes}`
									value.hours = `${hours}`
									if (months > 0 || days > 0) {
										value.remaining = '-'
									}
									return value
								} else {
									return {
										...value,
										remaining: '-'
									}
								}
							})
						}, 1000)

						// this.orders = res.data.rows.map((value, index, arr) => {
						//   if (value.paymentStatus === this.OrderPaymentStatusEnum.PAYSUCCESS && value.orderStatus === this.OrderStatusEnum.RESERVEING) {
						//     var currentDate = moment(value.orderDate).add(1, 'h')
						//     var releaseDate = moment()
						//     const diff = currentDate.diff(releaseDate)
						//     const diffDuration = moment.duration(diff)

						//     const months = diffDuration.months()
						//     const days = diffDuration.days()
						//     const hours = diffDuration.hours()
						//     const minutes = diffDuration.minutes()
						//     const seconds = diffDuration.seconds()

						//     let remaining = minutes + '分' + seconds + '秒'
						//     if (months < 0 || days < 0 || hours < 0 || minutes < 0) {
						//       remaining = '-'
						//     }
						//     return { ...value, remaining: remaining }
						//   } else {
						//     return { ...value, remaining: '-' }
						//   }
						// })
					} else {
						this.orders = []
					}

					this.tableLoading = false

					if (tip) {
						this.$message('搜索成功')
					}
				})
			},
			handleSearch(type) {
				if (type === 'refresh') {
					clearTimeout(this.timer)
					this.fetchOrders()
				} else {
					this.searchCondition1 = deepClone(this.searchCondition)
					this.pageIndex = 1
					clearTimeout(this.timer)
					this.fetchOrders(true)
				}
			},
			handleReset(formName) {
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
			getOrderHandlerStatusTag(handlerStatus) {
				let tag = ''
				switch (handlerStatus) {
					case this.OrderHandlerStatus.fail:
						tag = 'danger'
						break
					case this.OrderHandlerStatus.handling:
						tag = 'warning'
						break
					case this.OrderHandlerStatus.success:
						tag = 'success'
						break
				}
				return tag
			},
			getOrderConfirmStatusTag(confirmStatus) {
				let tag = ''
				switch (confirmStatus) {
					case this.OrderConfirmStatusEnum.CONFIRMFAIL:
						tag = 'danger'
						break
					case this.OrderConfirmStatusEnum.CONFIRMSSUCCESS:
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
				clearTimeout(this.timer)
				this.fetchOrders()

			},
			onPageChange(index) {
				this.pageIndex = index
				clearTimeout(this.timer)
				this.fetchOrders()
			},
			goOrder(orderNo) {
				this.$router.push({
					path: `/sysorder/${orderNo}`
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
				const condition = {
					...this.searchCondition,
					orderDate: {
						item1: this.searchCondition.orderDates[0],
						item2: this.searchCondition.orderDates[1]
					},
					OrderTime: {
						item1: this.searchCondition1.orderTimes ? this.searchCondition1.orderTimes[0] : '',
						item2: this.searchCondition1.orderTimes ? this.searchCondition1.orderTimes[1] : ''
					},
					PageSize: 10000,
					PageIndex: 1
				}
				QueryBackOrders(condition).then(res => {
					const orders = res.data.rows
					import('@/vendor/Export2Excel').then(excel => {
						const filterVal = ['orderNo', 'hotelName', 'roomTypeName', 'checkInName',
							'checkInPhone', 'checkInDate', 'checkOutDate', 'roomCount', 'orderDate',
							'invoiceDrawerDesc', 'orderAmount', 'orderStatusDesc', 'paymentStatusDesc',
							'refundStatusDesc', 'customerName'
						]
						const data = this.formatJson(filterVal, orders)
						excel.export_json_to_excel({
							header: ['订单号', '酒店', '房型', '入住人', '入住人电话', '入住日期', '离店日期', '数量',
								'下单日期', '开票方', '订单金额', '订单状态', '支付状态', '退款状态', '客户名称'
							],
							data: data,
							filename: this.filename,
							autoWidth: this.autoWidth,
							bookType: this.bookType
						})
					})
					AddOperationLog('EXPORT_SYSTEMORDER', JSON.stringify(condition))
				})
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
	.content {
		margin: 10px;
	}

	.pagination {
		margin-top: 1rem;
	}

	.el-form-item {
		margin-bottom: 0;
	}

	.searchForm>>>.el-form-item {
		width: 120px;
	}

	.searchForm>>>.el-range-editor {
		width: 230px !important;
	}
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
</style>
