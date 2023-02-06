<template>
	<div class="content">
		<el-card style="margin-bottom: 10px;">
			<el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top" class="searchForm"
				@submit.native.prevent>
				<!-- :class="showAll ? '' : 'formConstraint'" -->
				<el-form-item label="第三方订单号" prop="thirdOrderNo" style="width: 200px;">
					<el-input v-model="searchCondition.thirdOrderNo" clearable placeholder="第三方订单号"
						class="filter-item input-search" />
				</el-form-item>
				<el-form-item label="订单号" prop="orderNo">
					<el-input v-model="searchCondition.orderNo" clearable placeholder="订单号"
						class="filter-item input-search" />
				</el-form-item>
				<el-form-item label="入住人" prop="checkInName">
					<el-input v-model="searchCondition.checkInName" clearable placeholder="入住人"
						class="filter-item input-search" />
				</el-form-item>
				<el-form-item label="订单状态" prop="orderStatus" clearable>
					<el-select v-model="searchCondition.orderStatus" clearable placeholder="订单状态">
						<el-option v-for="os in OrderStatus" :key="os.value" :label="os.text" :value="os.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="第三方平台" prop="sourcePlatformId">
					<el-select v-model="searchCondition.sourcePlatformId" placeholder="第三方平台" clearable>
						<el-option :label="item.dictLabel" :value="item.dictValue" :key="item.dictValue"
							v-for="item in merchantsDict" />
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
				<el-form-item label="酒店名称" prop="hotelName" style="width: 200px;">
					<el-input v-model="searchCondition.hotelName" clearable placeholder="酒店名称"
						class="filter-item input-search" />
				</el-form-item>
				<!-- 				<el-form-item label="入住人电话" prop="checkInPhone">
					<el-input v-model="searchCondition.checkInPhone" clearable placeholder="入住人电话"
						class="filter-item input-search" />
				</el-form-item> -->
				<el-form-item label="客户" prop="customerName">
					<el-input v-model="searchCondition.customerName" clearable placeholder="客户"
						class="filter-item input-search" />
				</el-form-item>
				<el-form-item label="采购方式" prop="orderType">
					<el-select v-model="searchCondition.orderType" placeholder="采购方式" clearable>
						<el-option label="系统" :value="2001" />
						<el-option label="人工" :value="1001" />
					</el-select>
				</el-form-item>
				<el-form-item label="处理人" prop="confirmUser">
					<el-input v-model="searchCondition.confirmUser" clearable placeholder="处理人"
						class="filter-item input-search" />
				</el-form-item>
				<el-form-item label="　" style="user-select: none;width: auto;">
					<el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search"
						native-type="submit" @click="handleSearch('search')">搜索</el-button>
					<el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close"
						@click="handleReset('searchForm')">重置</el-button>
				</el-form-item>
				<!-- <el-form-item label="来源平台" prop="PlatformId">
					<el-select v-model="searchCondition.PlatformId" placeholder="来源平台" clearable>
						<el-option label="美团" :value="2" />
						<el-option label="携程" :value="9" />
						<el-option label="去哪儿" :value="30" />
					</el-select>
				</el-form-item>
		
		
				<el-form-item label="支付状态" prop="paymentStatus">
					<el-select v-model="searchCondition.paymentStatus" placeholder="支付状态" clearable>
						<el-option label="待支付" :value="0" />
						<el-option label="支付成功" :value="2" />
						<el-option label="支付取消" :value="-1" />
					</el-select>
				</el-form-item>
		
				<el-form-item label="采购状态" prop="purchaseStatus">
					<el-select v-model="searchCondition.purchaseStatus" prop="purchaseStatus"
						placeholder="采购状态" clearable>
						<el-option v-for="ps in purchaseStatus" :key="ps.value" :label="ps.text"
							:value="ps.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="来源订单号" prop="platformOrderNo">
					<el-input v-model="searchCondition.platformOrderNo" clearable placeholder="来源订单号"
						class="filter-item input-search" />
				</el-form-item>
				<el-form-item label="创建时间" prop="orderTimes" style="width: 230px;">
					<el-date-picker style="width:350px" v-model="searchCondition.orderTimes"
						start-placeholder="开始日期" end-placeholder="结束日期" type="datetimerange"
						range-separator="-" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"
						align="right" :default-time="['00:00:00']" :picker-options="pickerOptions">
					</el-date-picker>
				</el-form-item> -->

			</el-form>
		</el-card>
		<!-- 		<div class="filter-container">
			<el-card>
				<div style="display: flex;">
					<div>

					</div>
								<div >
						<el-button @click="changeShow()"
							:icon="this.showAll ? 'el-icon-arrow-up' : 'el-icon-arrow-down' " style="margin-top: 35px;"></el-button>
					</div>
				</div>

				<div class="tools-btn">
				</div>
			</el-card>
		</div> -->

		<el-card>
			<div class="tools">
				<el-row>
					<!-- 		<el-button-group>
						<el-button v-waves size="medium" icon="el-icon-refresh" @click="handleSearch('refresh')" />
					</el-button-group> -->
					<el-button type="text" style="float:right" @click="exportOrders">导出列表</el-button>
					<!-- <el-popover placement="top" width="400" trigger="click">
						<el-col :span="24">
							<el-checkbox-group v-model="colOptions">
								<el-col v-for="item in colSelect" :key="item" :span="8" :label="item">
									<el-checkbox :label="item">{{item}}</el-checkbox>
								</el-col>
							</el-checkbox-group>
						</el-col>
						<el-button slot="reference">设置</el-button>
					</el-popover> -->
				</el-row>
			</div>

			<el-table v-loading="tableLoading" :data="orders" :fit="true" ref="tableDataRef" stripe
				highlight-current-row   >
				<el-table-column v-if="colData[0] .istrue" label="订单号/酒店名称" min-width="8%" style="text-align: left;">
					<template slot-scope="scope">
						<el-link type="info" @click="goOrder(scope.row.orderNo)">
							<!-- 				<i v-if="scope.row.sourcePlatformId===30">
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
							</i> -->
							{{ scope.row.orderNo }}
						</el-link><i class="el-icon-document-copy copy" v-clipboard:copy="scope.row.orderNo"
							v-clipboard:success="copySuccess" v-clipboard:error="copyError"></i><br>
						<!-- 					【{{ scope.row.platform }}】<span v-if="scope.row.isReminder" class="el-icon-s-flag"
							style="color: red;" /> -->
						<span>{{ scope.row.hotelName }}</span>
						<span>{{ scope.row.tags }}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column label="平台" min-width="35%">
          <template slot-scope="scope">
            {{ scope.row.platform }}
          </template>
        </el-table-column> -->

				<!-- <el-table-column v-if="colData[1].istrue" label="酒店名称" prop="hotelName" min-width="10%"> -->
				<!-- <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.hotelName"
            >
            <el-link slot="reference" type="info" @click="goHotel(scope.row.hotelCode)">{{ scope.row.hotelName}}</el-link>
            </el-popover>
          </template> -->
			 
				<el-table-column v-if="colData[2].istrue" prop="roomTypeName" label="房型" min-width="5%" />
				<el-table-column v-if="colData[3].istrue" prop="bookingDaysShow" label="间/夜" min-width="4%" />

				<el-table-column v-if="colData[4].istrue" label="入离日期" min-width="4%">
					<template slot-scope="scope">
						{{ dateTimeToDate(scope.row.checkInDate).substr(5) }}<br />{{ dateTimeToDate(scope.row.checkOutDate).substr(5) }}
					</template>
				</el-table-column>
				<el-table-column v-if="colData[5].istrue" prop="orderAmount" label="订单金额" min-width="4%">
					<template slot-scope="scope">
						¥{{scope.row.orderAmount}}
					</template>
				</el-table-column>
				<el-table-column v-if="colData[6].istrue" prop="checkInName" label="入住人" min-width="5%" />
				<!-- 			<el-table-column v-if="colData[7].istrue" prop="checkInPhone" label="入住人电话" min-width="7%" /> -->


				<!-- <el-table-column prop="invoiceDrawerDesc" label="开票方" /> -->

				<el-table-column v-if="colData[8].istrue" prop="orderDate" label="预定日期" min-width="5%" />
				<!-- <el-table-column prop="customerName" label="客户名称" />
        <el-table-column prop="customerNo" label="客户编号" /> -->
				<el-table-column v-if="colData[9].istrue" label="订单状态" min-width="4%">
					<template slot-scope="scope">
						<!-- <el-tag :type="getOrderStatusTag(scope.row.orderStatus,scope.row.lockUserName)">
            {{ scope.row.orderStatusDesc }}
        </el-tag> -->
						<!--  预定中待确定有处理人订单状态黄色-->
						<font v-if="(scope.row.orderStatus==OrderStatusEnum.RESERVEING||scope.row.orderStatus==OrderStatusEnum.WAITCONFIRM)&&(scope.row.lockUserName && scope.row.lockUserName.length>
							0)" style="color:#EC9316">{{ scope.row.orderStatusDesc }}</font>
						<!--  预定中待确定没有处理人订单状态红色-->
						 
						<font v-else-if="scope.row.orderStatus==OrderStatusEnum.RESERVEING||scope.row.orderStatus==OrderStatusEnum.WAITCONFIRM" style="color:red">
							{{ scope.row.orderStatusDesc }}
						</font>
						<!--  订单状态已取消绿色-->
						         <font v-else-if="scope.row.orderStatus==OrderStatusEnum.Canceled" style="color:green">
							{{ scope.row.orderStatusDesc }}
						</font>
						<!--  否则为黑色-->
						        <font v-else style="color:#606266">{{ scope.row.orderStatusDesc }}</font>
						</font v-else-if="scope.row.orderstatus==orderstatusenum.reserveing||scope.row.orderstatus==orderstatusenum.waitconfirm" style="color:red">
						</font v-else-if="scope.row.orderstatus==orderstatusenum.canceled" style="color:green">
						</font v-else style="color:#606266">
						</font v-if="(scope.row.orderstatus==orderstatusenum.reserveing||scope.row.orderstatus==orderstatusenum.waitconfirm)&&(scope.row.lockusername && scope.row.lockusername.length>
						</font v-else-if="scope.row.orderstatus==orderstatusenum.reserveing||scope.row.orderstatus==orderstatusenum.waitconfirm" style="color:red">
						</font v-else-if="scope.row.orderstatus==orderstatusenum.canceled" style="color:green">
						</font v-else style="color:#606266">
					</template>
				</el-table-column>
				<el-table-column v-if="colData[10].istrue" label="支付状态" min-width="5%">
					<template slot-scope="scope">
						{{ scope.row.paymentStatusDesc }}
					</template>
				</el-table-column>
				<el-table-column v-if="colData[11].istrue" label="采购状态" min-width="4%" prop="purchaseStatusDesc" />
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
				<el-table-column v-if="colData[12].istrue" label="操作" min-width="3%">
					<template slot-scope="scope">
						<el-link style="color:#DF9524" size="mini" @click="goOrder(scope.row.orderNo)" >详情</el-link>
					</template>
				</el-table-column>
				<el-table-column v-if="colData[13].istrue" label="处理时间" min-width="5%">
					<template slot-scope="scope">
						{{ scope.row.remaining }}
					</template>
				</el-table-column>
				<el-table-column v-if="colData[14].istrue" label="第三方订单号" min-width="6%">
					<template slot-scope="scope">
						<b>{{ scope.row.thirdOrderNo }}</b><b
							v-if="scope.row.thirdOrderNo">【{{ getPlatName(scope.row.sourcePlatformId) }}】</b>
					</template>
				</el-table-column>
				
				<el-table-column v-if="colData[16].istrue" label="数据渠道/开票方" min-width="7%">
					<template slot-scope="scope">
						<span>{{ scope.row.platform }}</span>
						<span><b v-if="scope.row.invoiceTypeDesc">【{{scope.row.invoiceTypeDesc }}】</b> </span>
					</template>
				</el-table-column>
				<el-table-column v-if="colData[15].istrue" label="处理人" min-width="4%">
					<template slot-scope="scope">
						{{ scope.row.lockUserName }}
					</template>
				</el-table-column>

			</el-table>
			<div class="pagination">
				<el-pagination background layout="sizes,total, prev, pager, next, jumper" :total="totalCount"
					:page-sizes="[10,20, 50, 100]" :page-size="pageSize" :current-page="pageIndex"
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
	// import { purchaseStatus } from '@/enum/options.js'
	import SearchBlock from '@/components/SearchBlock'
	import {
		GetPlatformDict,
	} from '@/api/dict/dict'

	export default {
		name: 'AllOrderList',
		filters: {
			ellipsis(value) {
				if (!value) return ''
				if (value.length > 5) {
					return value.slice(0, 5) + '...'
				}
				return value
			}
		},
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
					paymentStatus: '',
					purchaseStatus: '',
					customerName: '',
					confirmUser: '',
					thirdOrderNo: '',
					platformOrderNo: '',
					orderTimes: [],
					sourcePlatformId: ''
				},
				searchCondition: {
					orderDates: [],
					orderNo: '',
					hotelName: '',
					orderStatus: '',
					checkInName: '',
					checkInPhone: '',
					paymentStatus: '',
					purchaseStatus: '',
					customerName: '',
					confirmUser: '',
					thirdOrderNo: '',
					platformOrderNo: '',
					orderTimes: [],
					sourcePlatformId: ''
				},
				colData: [{
						title: '订单号',
						istrue: true
					},
					{
						title: '酒店名称',
						istrue: true
					},
					{
						title: '房型',
						istrue: true
					},
					{
						title: '间/夜',
						istrue: true
					},
					{
						title: '入离日期',
						istrue: true
					},
					{
						title: '订单金额',
						istrue: true
					},
					{
						title: '入住人',
						istrue: true
					},
					{
						title: '入住人电话',
						istrue: true
					},
					{
						title: '下单日期',
						istrue: true
					},
					{
						title: '订单状态',
						istrue: true
					},
					{
						title: '支付状态',
						istrue: true
					},
					{
						title: '采购状态',
						istrue: true
					},
					{
						title: '操作',
						istrue: true
					},
					{
						title: '处理时间',
						istrue: true
					},
					{
						title: '第三方订单号',
						istrue: true
					},
				
					{
						title: '处理人',
						istrue: true
					},
					{
						title: '数据渠道',
						istrue: true
					}
				],
				colOptions: ['订单号', '酒店名称', '房型', '间/夜', '入离日期', '订单金额', '入住人', '入住人电话', '下单日期', '订单状态', '支付状态', '采购状态',
					'操作', '处理时间', '第三方订单号', '处理人'
				], // 默认全选
				colSelect: ['订单号', '酒店名称', '房型', '间/夜', '入离日期', '订单金额', '入住人', '入住人电话', '下单日期', '订单状态', '支付状态', '采购状态',
					'操作', '处理时间', '第三方订单号', '处理人'
				], // 选中
				pickerOptions: {
					shortcuts: [{
						text: '今天',
						onClick(picker) {
							picker.$emit('pick', new Date())
						}
					}, {
						text: '最近一小时',
						onClick(picker) {
							const end = new Date()
							const start = new Date()
							start.setTime(start.getTime() - 3600 * 1000)
							picker.$emit('pick', [start, end])
						}
					}]
				},
				orders: [],
				OrderStatusEnum: {
					// 待支付
					WAITPAY: 5,
					// 预定中
					RESERVEING: 15,
					// 待确认
					WAITCONFIRM: 20,
					// 预定成功
					BookSuccessfully: 25,
					// 预定失败
					BookingFailure: 30,
					// 已消费
					Consumed: 35,
					// 已消费退款
					RefundConsumed: 40,
					// 已取消
					Canceled: -1
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
				purchaseStatus: [
					// {
					//     text: '待采购',
					//     value: 10
					// },
					{
						text: '采购中',
						value: 15
					},
					// {
					//     text: '采购成功',
					//     value: 25
					// },
					{
						text: '采购失败',
						value: 20
					},
					{
						text: '待确认',
						value: 30
					},
					{
						text: '已确认',
						value: 45
					},
					{
						text: '确认失败',
						value: 40
					},
					{
						text: '已退款',
						value: 50
					}
				],
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
				timer: {},
				showAll: false,
				dateType: 1,
				date: [],
				merchantsDict: [{
						dictLabel: "51Zhu",
						dictValue: "1",
					},
					{
						dictLabel: "美团",
						dictValue: "2",
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
				var arr = this.colSelect.filter(i => valArr.indexOf(i) < 0) // 未选中
				this.colData.filter(i => {
					// eslint-disable-next-line eqeqeq
					if (arr.indexOf(i.title) != -1) {
						i.istrue = false
						this.$nextTick(() => {
							this.$refs.tableDataRef.doLayout()
						})
					} else {
						i.istrue = true
						this.$nextTick(() => {
							this.$refs.tableDataRef.doLayout()
						})
					}
				})
			}
		},
		created() {
			this.init()
		},

		methods: {
			sortKey(array, key) {
				return array.sort(function(a, b) {
					var x = a[key]
					var y = b[key]
					return x < y ? -1 : x > y ? 1 : 0
				})
			},
			init() {
				clearTimeout(this.timer)
				this.fetchOrders()
				this.getDict()
			},
			getPlatName(platformId) {
				let arr = this.merchantsDict.filter(item => {
					return item.dictValue == platformId
				})
				return arr.length > 0 ? arr[0].dictLabel : "未知";
			},
			getDict() {
				GetPlatformDict().then(res => {
					this.merchantsDict = res.data.map(item => {
						return {
							dictLabel: item.platformName,
							dictValue: item.platformId
						}
					})
				})
			},
			fetchOrders(tip) {
				this.validForm()
				this.tableLoading = true
				const condition = {
					...this.searchCondition,
					orderDate: {
						item1: this.searchCondition.orderDates ? this.searchCondition.orderDates[0] : '',
						item2: this.searchCondition.orderDates ? this.searchCondition.orderDates[1] : ''
					},
					orderTime: {
						item1: this.searchCondition.orderTimes ? this.searchCondition.orderTimes[0] : '',
						item2: this.searchCondition.orderTimes ? this.searchCondition.orderTimes[1] : ''
					},
					PageSize: this.pageSize,
					PageIndex: this.pageIndex
				}
				QueryBackOrders(condition).then(res => {
					this.totalCount = res.data.total
					// this.orders = this.orders.concat(res.data.rows)
					this.orders = res.data.rows
					if (res.data.rows && res.data.rows.length > 0) {
						this.timer = setInterval(() => {
							this.orders = this.orders.map((value, arr, index) => {
								if (value.paymentStatus === this.OrderPaymentStatusEnum
									.PAYSUCCESS && (value.orderStatus === this.OrderStatusEnum
										.RESERVEING || value.orderStatus === this.OrderStatusEnum
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
			getOrderStatusTag(orderStatus, lockUserName) {
				let tag = ''
				if (lockUserName) {
					switch (orderStatus) {
						case this.OrderStatusEnum.RESERVEING:
							tag = 'warning'
							break
						case this.OrderStatusEnum.WAITCONFIRM:
							tag = 'warning'
							break
					}
					return tag
				} else {
					switch (orderStatus) {
						case this.OrderStatusEnum.RESERVEING:
							tag = 'danger'
							break
						case this.OrderStatusEnum.WAITCONFIRM:
							tag = 'danger'
							break
					}
					return tag
				}
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
					path: `/allorder/${orderNo}`
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
						item1: this.searchCondition.orderTimes ? this.searchCondition.orderTimes[0] : '',
						item2: this.searchCondition.orderTimes ? this.searchCondition.orderTimes[1] : ''
					},
					PageSize: 50000,
					PageIndex: this.pageIndex
				}
				QueryBackOrders(condition).then(res => {
					const orders = res.data.rows
					import('@/vendor/Export2Excel').then(excel => {
						const filterVal = ['sourcePlatform', 'orderNo', 'hotelName', 'roomTypeName',
							'bookingDaysShow', 'checkInName', 'checkInPhone', 'checkInDate',
							'checkOutDate', 'roomCount', 'lockUserName', 'orderDate', 'orderAmount',
							'orderStatusDesc', 'paymentStatusDesc', 'platform', 'purchaseStatusDesc',
							'orderDate', 'thirdOrderNo', 'customerName'
						]
						const data = this.formatJson(filterVal, orders)
						excel.export_json_to_excel({
							header: ['来源平台', '订单号', '酒店', '房型', '间/夜', '入住人', '入住人电话', '入住日期',
								'离店日期', '数量', '处理人', '下单日期', '订单金额', '订单状态', '支付状态', '采购平台',
								'采购状态', '创建时间', '第三方订单号', '客户名称'
							],
							data: data,
							filename: this.filename,
							autoWidth: this.autoWidth,
							bookType: this.bookType
						})
					})
					AddOperationLog('EXPORT_ALLORDER', JSON.stringify(condition))
				})
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => {
					return v[j]
				}))
			},
			changeShow() {
				this.showAll = !this.showAll
			},
			changeDate() {
				let val = this.date
				if (val) {
					if (this.dateType == 0) {
						this.searchCondition.orderDates = val
						this.searchCondition.orderTimes = []
					} else {
						this.searchCondition.orderDates = []
						this.searchCondition.orderTimes = val
					}
				} else {
					this.searchCondition.orderDates = []
					this.searchCondition.orderTimes = []
				}
			},
			validForm() {
				var o = this.searchCondition
				if (o.thirdOrderNo == "" && o.orderNo == "" && o.checkInName == "" && o.orderStatus == "" && !(this.date &&
						this.date.length > 0) &&
					o.hotelName == "" && o.checkInPhone == "" && o.sourcePlatformId == "" && o.confirmUser == "" && o
					.customerName == "") {
					//this.searchCondition.orderTimes = [this.dateTimeToDate(new Date(new Date()-24*60*60*1000)), this.dateTimeToDate(new Date())]
					let year = moment(new Date()).format('YYYY')
					this.searchCondition.orderTimes = [year + '-01-01', (Number(year) + 1) + '-01-01']
				} else {
					if (!(this.date && this.date.length > 0)) {
						this.searchCondition.orderDates = []
						this.searchCondition.orderTimes = []
					}
				}
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

	.collapse-title {
		flex: 1 0 90%;
		order: 1;
	}

	.pagination {
		margin-top: 1rem;
	}

	.table-th {
		color: red;
	}

	.formConstraint {
		height: 82px;
		overflow-y: hidden;
	}

	.el-form-item {
		margin-bottom: 0;
	}

	i {
		font-size: 20px;
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
