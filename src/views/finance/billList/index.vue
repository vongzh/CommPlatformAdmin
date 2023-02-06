<template>
	<div class="content">
		<div class="filter-container">
			<el-card>
				<el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top"
					class="searchForm">
					<el-form-item label="用户名称" prop="userId" v-if="!isCustomer" style="width: 250px ;">
						<el-select v-model="searchCondition.userId" clearable filterable style="width: 250px ;">
							<el-option v-for="(item,index) in userList" :value="item.userId" :label="item.nickName" />
						</el-select>
					</el-form-item>
					<el-form-item label="第三方平台" prop="sourcePlatformId" v-if="!isCustomer">
						<el-select v-model="searchCondition.sourcePlatformId" placeholder="第三方平台" clearable>
							<el-option :label="item.dictLabel" :value="item.dictValue"
								v-for="(item,index) in merchantsDict" />
						</el-select>
					</el-form-item>
					<el-form-item label="订单号" prop="orderNo">
						<el-input v-model="searchCondition.orderNo" clearable placeholder="订单号"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="第三方订单号" prop="thirdOrderNo">
						<el-input v-model="searchCondition.thirdOrderNo" clearable placeholder="第三方订单号"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="采购平台单号" prop="purchasePlatformOrderNo" v-if="!isCustomer">
						<el-input v-model="searchCondition.purchasePlatformOrderNo" clearable placeholder="采购平台单号"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="酒店名称" prop="hotelName" style="width: 230px ;">
						<el-input v-model="searchCondition.hotelName" clearable placeholder="酒店名称"
							style="width: 230px ;" class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="入住人" prop="checkInName">
						<el-input v-model="searchCondition.checkInName" clearable placeholder="入住人"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="订单状态" prop="orderStatus">
						<el-select v-model="searchCondition.orderStatus" clearable>
							<el-option v-for="(item,index) in orderStatusDict" :value="item.dictValue"
								:label="item.dictlabel" />
						</el-select>
					</el-form-item>
					<el-form-item label="退款状态" prop="refundStatus">
						<el-select v-model="searchCondition.refundStatus" clearable>
							<el-option v-for="(item,index) in refundStatusDict" :value="item.dictValue"
								:label="item.dictlabel" />
						</el-select>
					</el-form-item>
					<el-form-item label="支付方式" prop="paymentType">
						<el-select v-model="searchCondition.paymentType" clearable>
							<el-option v-for="(item,index) in payTypeDict" :value="item.dictValue"
								:label="item.dictlabel" />
						</el-select>
					</el-form-item>
					<el-form-item label="预定日期" prop="transactionTime" style="width: 230px;">
						<el-date-picker v-model="searchCondition.transactionTime" type="daterange"
							value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" align="right" />
					</el-form-item>
					<el-form-item label="采购日期" prop="purchaseTime" v-if="!isCustomer" style="width: 230px;">
						<el-date-picker v-model="searchCondition.purchaseTime" type="daterange"
							value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" align="right" />
					</el-form-item>
					<el-form-item label="退款日期" prop="refundTime" style="width: 230px;">
						<el-date-picker v-model="searchCondition.refundTime" type="daterange" value-format="yyyy-MM-dd"
							start-placeholder="开始日期" end-placeholder="结束日期" align="right" />
					</el-form-item>
					<el-form-item label="入离时间" prop="departureDate" style="width: 230px;">
						<el-date-picker v-model="searchCondition.departureDate" type="daterange"
							value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" align="right" />
					</el-form-item>
					<el-form-item label="离店日期" prop="checkOutDate" style="width: 230px;">
						<el-date-picker v-model="searchCondition.checkOutDate" type="daterange"
							value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" align="right" />
					</el-form-item>
					<el-form-item label="　" style="user-select: none;width: 200px;">
						<el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search"
							@click="handleSearch()">搜索</el-button>
						<el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close"
							@click="handleReset('searchForm')">重置</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
		<el-card>
			<div class="tools">
				<el-button-group>
					<el-button v-waves size="medium" icon="el-icon-refresh" @click="handleSearch('refresh')" />
				</el-button-group>
				<el-button type="text" style="float:right" @click="exportOrders"
					v-loading.fullscreen.lock="fullscreenLoading">导出列表</el-button>
			</div>
			<el-table v-loading="tableLoading" :data="orders" :fit="true" border stripe highlight-current-row>
				<el-table-column label="第三方平台" width="90px">
					<template slot-scope="scope">
						{{ getPlatName(scope.row.sourcePlatformId) }}
					</template>
				</el-table-column>
				<el-table-column label="预定日期" prop="orderCreateTime" width="100px" />
				<el-table-column label="订单号" width="110px" prop="orderNo">
					<template slot-scope="scope">
						<el-link type="info" @click="goOrder(scope.row.orderNo)">
							{{ scope.row.orderNo }}
						</el-link>
						<i class="el-icon-document-copy copy" v-clipboard:copy="scope.row.orderNo"
							v-clipboard:success="copySuccess" v-clipboard:error="copyError"></i>
					</template>
				</el-table-column> 
				<el-table-column label="采购平台" prop="platformName" v-if="!isCustomer" />
				<el-table-column label="采购平台单号" prop="platformOrderNo" v-if="!isCustomer" />
				<el-table-column label="第三方订单号" prop="thirdOrderNo" />
				<el-table-column label="酒店名称" prop="hotelName" width="100px" />
				<el-table-column label="房型" prop="roomTypeName" />
				<el-table-column label="入住人" prop="checkInName" />
				<el-table-column label="间/夜" prop="roomNights" />
				<el-table-column label="入离日期" prop="checkInDate" :formatter="TimeFormatter" width="60px" />
				<el-table-column prop="paymentTypeDesc" label="支付方式" v-if="!isCustomer" />
				<el-table-column prop="orderStatusDesc" label="订单状态" />
				<el-table-column prop="orderAmount" label="订单金额" />
				<el-table-column prop="hotelBusinessTypeDesc" label="业务类型" v-if="isCustomer" />
				<el-table-column prop="purchaseAmount" label="采购金额" v-if="!isCustomer" />
				<el-table-column prop="profits" label="利润" v-if="!isCustomer" width="90px">
					<template slot-scope="scope">
						<el-tag :type="scope.row.profits>0?'success':'danger'">{{ scope.row.profits }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="purchaseTime" label="采购时间" width="100px" v-if="!isCustomer" />
				<el-table-column prop="refundAmount" label="退款金额">
					<template slot-scope="scope">
						<span v-if="scope.row.refundAmount != 0"> {{scope.row.refundAmount}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="refundStatusDesc" label="退款状态" />
				<el-table-column label="退款时间" prop="refundTime" width="100px" />

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
	//获取订单列表
	import {
		GetAccountBills
	} from '@/api/account/account'
	import {
		getUserList
	} from '@/api/sys/user'
	import waves from '@/directive/waves'
	import {
		deepClone
	} from '@/utils/index'
	import moment from 'moment'
	import {
		AddOperationLog
	} from '@/api/sys/log'
	import {
		GetPlatformDict,
	} from '@/api/dict/dict'
	export default {
		name: 'BillList',
		directives: {
			waves
		},
		data() {
			return {

				searchCondition1: {
					transactionTime: [],
					purchaseTime: [],
					refundTime: [],
					departureDate: [],
					checkOutDate: [],
					orderNo: '',
					thirdOrderNo: '',
					purchasePlatformOrderNo: '',
					orderStatus: '',
					paymentType: '',
					refundStatus: '',
					hotelName: '',
					checkInName: '',
					userId: '',
					sourcePlatformId: '',
				},
				searchCondition: {
					transactionTime: [],
					purchaseTime: [],
					refundTime: [],
					departureDate: [],
					checkOutDate: [],
					orderNo: '',
					thirdOrderNo: '',
					purchasePlatformOrderNo: '',
					orderStatus: '',
					paymentType: '',
					refundStatus: '',
					hotelName: '',
					checkInName: '',
					sourcePlatformId: '',
					userId: ''
				},
				orders: [],
				tableLoading: false,
				totalCount: 0,
				pageSize: 10,
				pageIndex: 1,
				payTypeDict: [ //支付方式字典
					{
						dictlabel: "微信",
						dictValue: 1,
					}, {
						dictlabel: "支付宝",
						dictValue: 5,
					}, {
						dictlabel: "易宝",
						dictValue: 10,
					}, {
						dictlabel: "云闪付",
						dictValue: 20,
					}, {
						dictlabel: "百度钱包",
						dictValue: 30,
					}, {
						dictlabel: "信用卡",
						dictValue: 40,
					}, {
						dictlabel: "余额",
						dictValue: 50,
					}, {
						dictlabel: "接口",
						dictValue: 60,
					}, {
						dictlabel: "银行卡",
						dictValue: 70,
					}, {
						dictlabel: "优惠券",
						dictValue: 80,
					}, {
						dictlabel: "其他",
						dictValue: 100,
					}
				],
				orderStatusDict: [ //订单状态字典
					{
						dictlabel: "订单生成",
						dictValue: 1,
					}, {
						dictlabel: "待支付",
						dictValue: 5,
					}, {
						dictlabel: "预定中",
						dictValue: 15,
					}, {
						dictlabel: "待确认",
						dictValue: 20,
					}, {
						dictlabel: "预订成功",
						dictValue: 25,
					}, {
						dictlabel: "预订失败",
						dictValue: 30,
					}, {
						dictlabel: "已消费	",
						dictValue: 35,
					}, {
						dictlabel: "已消费退款",
						dictValue: 40,
					}, {
						dictlabel: "已取消",
						dictValue: -1,
					}, {
						dictlabel: "已关闭",
						dictValue: -5,
					}
				],
				refundStatusDict: [ //退款状态字典
					{
						dictlabel: "待审核",
						dictValue: 0,
					}, {
						dictlabel: "审核中",
						dictValue: 1,
					}, {
						dictlabel: "拒绝退款",
						dictValue: 2,
					}, {
						dictlabel: "审核通过",
						dictValue: 3,
					}, {
						dictlabel: "待退款",
						dictValue: 4,
					}, {
						dictlabel: "退款中",
						dictValue: 5,
					}, {
						dictlabel: "退款成功",
						dictValue: 6,
					}, {
						dictlabel: "退款失败",
						dictValue: 7,
					}, {
						dictlabel: "关闭",
						dictValue: -1,
					}
				],
				fullscreenLoading: false,
				isCustomer: true,
				userList: [],
				merchantsDict: []
			}
		},
		watch: {},
		created() {
			this.$nextTick(() => {
				this.init()
			})
		},
		mounted() {

		},

		methods: {
			init() {
				this.fetchOrders()
				this.getUserList()
				this.getDict()
			},
			getPlatName(sourcePlatformId) {
				let arr = this.merchantsDict.filter(item => {
					return item.dictValue == sourcePlatformId
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
			getUserList() {
				getUserList().then(res => {
					this.userList = res.data
				})
			},
			exportOrders() {
				this.validForm()
				this.fullscreenLoading = true;
				const condition = {
					...this.searchCondition,
					purchaseTime: {
						item1: this.searchCondition.purchaseTime ? this.searchCondition.purchaseTime[0] : '',
						item2: this.searchCondition.purchaseTime ? this.searchCondition.purchaseTime[1] : ''
					},
					transactionTime: {
						item1: this.searchCondition.transactionTime ? this.searchCondition.transactionTime[0] : '',
						item2: this.searchCondition.transactionTime ? this.searchCondition.transactionTime[1] : ''
					},
					refundTime: {
						item1: this.searchCondition.refundTime ? this.searchCondition.refundTime[0] : '',
						item2: this.searchCondition.refundTime ? this.searchCondition.refundTime[1] : ''
					},
					departureDate: {
						item1: this.searchCondition.departureDate ? this.searchCondition.departureDate[0] : '',
						item2: this.searchCondition.departureDate ? this.searchCondition.departureDate[1] : ''
					},
					checkOutDate: {
						item1: this.searchCondition.checkOutDate ? this.searchCondition.checkOutDate[0] : '',
						item2: this.searchCondition.checkOutDate ? this.searchCondition.checkOutDate[1] : ''
					},
					PageSize: 10000,
					PageIndex: 1
				}
				GetAccountBills(condition).then(res => {
					const orders = res.data.rows
					import('@/vendor/Export2Excel').then(excel => {

						const filterVal1 = ['userName', 'Time', 'currencyType', 'orderCount',
							'orderAmount', 'refundAmount', 'adjustAmount', 'amount', 'actualAmount'
						]
						const filterVal2 = (this.isCustomer ? ['userName', 'orderCreateTime', 'orderNo',
							'thirdOrderNo', 'hotelName',
							'roomTypeName', 'checkInName', 'roomNights',
							'orderAmount', 'hotelBusinessTypeDesc','paymentStatusDesc',
							'orderStatusDesc', 'checkInDate', 'checkOutDate', 'remark'
						] : ['userName', 'orderCreateTime', 'orderNo',
							'platformName', 'platformOrderNo', 'thirdOrderNo', 'hotelName',
							'roomTypeName', 'checkInName', 'roomNights',
							'paymentTypeDesc', 'paymentStatusDesc', 'orderStatusDesc', 'orderAmount','orderBasePrice','userPaymentAmount', 'purchaseAmount',
							'profits', 'purchaseTime', 'checkInDate', 'checkOutDate',
							'lockUserName', 'remark'
						])
						const filterVal3 = (this.isCustomer ? ['userName', 'orderCreateTime', 'orderNo',
							'thirdOrderNo', 'hotelName',
							'roomTypeName', 'checkInName', 'roomNights',
							'orderStatusDesc', 'hotelBusinessTypeDesc', 'refundStatusDesc',
							'refundAmount',
							'refundTime', 'checkInDate', 'checkOutDate', 'remark'
						] : ['userName', 'orderCreateTime', 'orderNo',
							'platformName', 'platformOrderNo', 'thirdOrderNo', 'hotelName',
							'roomTypeName', 'checkInName', 'roomNights',
							'orderStatusDesc', 'orderAmount', 'refundStatusDesc', 'refundAmount',
							'refundTime', 'checkInDate', 'checkOutDate', 'lockUserName', 'remark'
						])
						const header = (this.isCustomer ? [
							['采购商', '	结算周期', '	结算币种', '	订单数量', '	订单金额', '	退款金额', '	调整金额',
								'	本期应结', '	实结金额'
							],
							['第三方账号', '预订日期', '订单号', '第三方订单号', '酒店名称', '房型', '入住人', '间/夜', '订单金额',
								'业务类型', '支付状态','订单状态', '入住日期', '离店日期', '备注'
							],
							['第三方账号', '预订日期', '订单号', '第三方订单号', '酒店名称',
								'房型',
								'入住人', '间/夜', '订单状态', '业务类型', '退款状态', '退款金额', '退款时间',
								'入住日期', '离店日期', '备注'
							]
						] : [
							['采购商', '	结算周期', '	结算币种', '	订单数量', '	订单金额', '	退款金额', '	调整金额',
								'	本期应结', '	实结金额'
							],
							['用户账号', '预订日期', '订单号', '采购平台', '采购平台单号', '第三方订单号', '酒店名称',
								'房型',
								'入住人', '间/夜', '支付方式','支付状态', '订单状态', '订单金额','订单底价','客户实际支付金额', '采购金额', '利润',
								'采购时间',
								'入住日期', '离店日期', '处理人', '备注'
							],
							['用户账号', '预订日期', '订单号', '采购平台', '采购平台单号', '第三方订单号', '酒店名称',
								'房型',
								'入住人', '间/夜', '订单状态', '订单金额', '退款状态', '退款金额', '退款时间',
								'入住日期', '离店日期', '处理人', '备注'
							]
						])
						excel.export_jsons_to_excel({
							header: header,
							data: [
								this.formatJsonSummary(orders).concat([
									['-', '-', '-', '-', '-', '-', '-', '-', '-'],
									['开户行', '收款账号', '户名', '联系人', '联系方式'],
									['中国银行股份有限公司新乡县支行', '259874899041', '河南易住旅行社有限公司',
										'王纪亮', '13503735670'
									],
								]),
								this.formatJson(filterVal2, orders),
								this.formatJsons(filterVal3, orders, true)
							],
							sheetname: ["总计", "订单明细", "退款明细"],
							filename: this.filename,
							autoWidth: this.autoWidth,
							bookType: this.bookType
						})
						this.fullscreenLoading = false;
					})
					AddOperationLog('EXPORT_PURCHASEORDER', JSON.stringify(condition))
				})
			},
			formatJsonSummary(jsonData) {
				let obj = {}
				let arr = []
				jsonData.map(v => {
					if (!obj[v.userName]) {
						obj[v.userName] = {
							Time: (this.searchCondition.transactionTime && this.searchCondition.transactionTime
								.length > 0) ? (this.searchCondition
								.transactionTime[0] + "至" + this.searchCondition.transactionTime[1]) : "",
							currencyType: 'CNY',
							orderCount: 0,
							orderAmount: 0,
							refundAmount: 0,
							adjustAmount: 0,
							amount: 0,
							actualAmount: 0
						}
					}
					obj[v.userName].orderCount++
					obj[v.userName].orderAmount += v.orderAmount
					obj[v.userName].refundAmount += v.refundAmount
					obj[v.userName].amount += v.orderAmount - v.refundAmount
					obj[v.userName].actualAmount += (v.orderAmount - v.refundAmount)
				})
				Object.keys(obj).forEach(function(key) {
					arr.push([key, obj[key].Time, 'CNY', obj[key].orderCount, obj[key].orderAmount, obj[key]
						.refundAmount,
						obj[key].adjustAmount, obj[key].amount, obj[key].actualAmount
					])
				});
				return arr
			},

			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => {
					return v[j]
				}))
			},

			formatJsons(filterVal, jsonData, type) {

				return jsonData.filter(v => {
					return (v.refundStatusDesc != null && v.refundStatusDesc != undefined) == type
				}).map(i => {
					return filterVal.map(j => {
						return i[j]
					})
				})
			},
			fetchOrders(tip) {
				this.tableLoading = true
				this.validForm()
				const condition = {
					...this.searchCondition1,
					purchaseTime: {
						item1: this.searchCondition1.purchaseTime ? this.searchCondition1.purchaseTime[0] : '',
						item2: this.searchCondition1.purchaseTime ? this.searchCondition1.purchaseTime[1] : ''
					},
					transactionTime: {
						item1: this.searchCondition1.transactionTime ? this.searchCondition1.transactionTime[0] : '',
						item2: this.searchCondition1.transactionTime ? this.searchCondition1.transactionTime[1] : ''
					},
					refundTime: {
						item1: this.searchCondition1.refundTime ? this.searchCondition1.refundTime[0] : '',
						item2: this.searchCondition1.refundTime ? this.searchCondition1.refundTime[1] : ''
					},
					departureDate: {
						item1: this.searchCondition.departureDate ? this.searchCondition.departureDate[0] : '',
						item2: this.searchCondition.departureDate ? this.searchCondition.departureDate[1] : ''
					},
					checkOutDate: {
						item1: this.searchCondition.checkOutDate ? this.searchCondition.checkOutDate[0] : '',
						item2: this.searchCondition.checkOutDate ? this.searchCondition.checkOutDate[1] : ''
					},
					PageSize: this.pageSize,
					PageIndex: this.pageIndex
				}
				GetAccountBills(condition).then(res => {
					if (res.result) {
						if (res.data.rows.length > 0) {
							this.isCustomer = (res.data.rows[0].userType == 100 ? false : true)
						}
						this.orders = res.data.rows
						this.totalCount = res.data.total

						if (tip) {
							this.$message({
								message: '搜索成功',
								type: 'success'
							});
						}
					} else this.$message({
						message: '搜索失败!' + res.message,
						type: 'error'
					});
					this.tableLoading = false
				})
			},
			handleSearch(type) {
				if (type === 'refresh') {
					this.fetchOrders()
				} else {
					this.searchCondition1 = deepClone(this.searchCondition)
					this.pageIndex = 1
					this.fetchOrders(true)
				}
			},
			handleReset(formName) {
				this.$refs[formName].resetFields()
				this.searchCondition = {
					transactionTime: [],
					purchaseTime: [],
					refundTime: [],
					checkOutDate: [],
					orderNo: '',
					thirdOrderNo: '',
					purchasePlatformOrderNo: '',
					orderStatus: '',
					paymentType: '',
					refundStatus: '',
					hotelName: '',
					checkInName: '',
					sourcePlatformId: '',
					userId: ''
				}

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
			goOrder(orderNo) {
				let url = this.isCustomer ? `/order/${orderNo}` : `/allorder/${orderNo}`
				this.$router.push({
					path: url
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
			TimeFormatter(row, column) {
				return row.checkInDate.substring(5, 10) + row.checkOutDate.substring(5, 10)
			},
			nightFormatter(row, column) {
				return row.roomNights.split('/')[1].split('晚')[0];
			},
			validForm() {
				var o = this.searchCondition
				if (o.thirdOrderNo == "" && o.orderNo == "" && o.checkInName == "" && o.orderStatus == "" && !(o
						.purchaseTime && o.purchaseTime.length > 0) && !(o.transactionTime && o.transactionTime.length >
						0) && !(o.refundTime && o.refundTime.length > 0) && !(o.departureDate && o.departureDate.length >
						0) && !(o.checkOutDate && o.checkOutDate.length > 0) && o.hotelName == "" && o.purchasePlatformOrderNo ==
					"" && o.paymentType == "" && o.refundStatus == "" && o.userId == "") {
					this.searchCondition1.transactionTime = [this.dateTimeToDate(new Date(new Date() - 24 * 60 * 60 *
						1000)), this.dateTimeToDate(new Date())]
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

	.pagination {
		margin-top: 1rem;
	}

	/* 	.content>>>.el-table th>.cell {
		color: #000;
	} */

	.searchForm>>>.el-form-item {
		width: 130px;
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
