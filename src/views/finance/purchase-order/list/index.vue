<template>
	<div class="content">
		<div class="filter-container">
			<el-card>
				<el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top"
					class="searchForm">
					<el-form-item label="采购单号" prop="purchaseOrderNo">
						<el-input v-model="searchCondition.purchaseOrderNo" clearable placeholder="采购单号"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="订单号" prop="orderNo">
						<el-input v-model="searchCondition.orderNo" clearable placeholder="订单号"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="采购平台单号" prop="platformOrderNo">
						<el-input v-model="searchCondition.platformOrderNo" clearable placeholder="采购平台单号"
							class="filter-item input-search" />
					</el-form-item>
					<!-- 					<el-form-item label="第三方订单号" prop="thirdOrderNo">
						<el-input v-model="searchCondition.thirdOrderNo" clearable placeholder="第三方订单号"
							class="filter-item input-search" />
					</el-form-item> -->
					<el-form-item label="酒店名称" prop="hotelName">
						<el-input v-model="searchCondition.hotelName" clearable placeholder="酒店名称"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="入住人" prop="checkInName">
						<el-input v-model="searchCondition.checkInName" clearable placeholder="入住人"
							class="filter-item input-search" />
					</el-form-item>
					<!--              <el-form-item label="入住人电话" prop="checkInPhone">
                <el-input v-model="searchCondition.checkInPhone" clearable placeholder="入住人电话" class="filter-item input-search" />
              </el-form-item> -->
					<el-form-item label="创建日期" prop="orderDates" style="width: 230px;">
						<el-date-picker v-model="searchCondition.orderDates" type="daterange" value-format="yyyy-MM-dd"
							start-placeholder="开始日期" end-placeholder="结束日期" align="right" />
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
				<el-button type="text" style="float:right" @click="exportOrders">导出列表</el-button>
			</div>
			<el-table v-loading="tableLoading" :data="purchaseOrders" :fit="true" border stripe highlight-current-row>
				<el-table-column label="采购单号" prop="purchaseNo" min-width="6%" />
				<el-table-column label="订单号" min-width="7%">
					<template slot-scope="scope">
						<el-link type="info" @click="goOrder(scope.row.orderNo)">{{ scope.row.orderNo }}<i
								v-if="scope.row.isReminder" class="el-icon-s-flag" style="color: red;" />
						</el-link>
							<i class="el-icon-document-copy copy" v-clipboard:copy="scope.row.orderNo"
								v-clipboard:success="copySuccess" v-clipboard:error="copyError"></i>
					</template>
				</el-table-column>
				<el-table-column label="来源" prop="orderSource" min-width="5%" />
				<el-table-column label="第三方订单号" prop="thirdOrderNo" min-width="6%" />
				<el-table-column label="采购平台单号" prop="platformOrderNo" min-width="6%" />
				<el-table-column label="平台" prop="platform" min-width="6%" />
				<!-- <el-table-column label="方式" prop="purchaseMethodDesc" min-width="5%" /> -->
				<el-table-column label="酒店名称" min-width="6%">
					<template slot-scope="scope">
						<el-link type="info" @click="goHotel(scope.row.hotelCode)">{{ scope.row.hotelName }}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="roomTypeName" label="房型" min-width="6%" />
				<el-table-column prop="checkRoomCount" label="数量" min-width="4%" />
				<el-table-column prop="orderAmount" label="订单金额" min-width="6%" />
				<!-- <el-table-column prop="orderBasePrice" label="底价" min-width="6%" /> -->
				<el-table-column prop="purchasePrice" label="采购金额" min-width="6%" />
				<el-table-column prop="profit" label="利润" width="90px">
					<template #default="scope">
						<el-tag :type="scope.row.profit>0?'success':'danger'">{{ scope.row.profit }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="checkInName" label="入住人" min-width="5%" />
				<!-- <el-table-column prop="contactPhone" label="入住人电话" min-width="7%" /> -->
				<el-table-column prop="remark" label="备注" min-width="7%" />
				<el-table-column label="入离日期" min-width="6%">
					<template slot-scope="scope">
						{{ dateTimeToDate(scope.row.checkInDate) }}/{{ dateTimeToDate(scope.row.checkOutDate) }}
					</template>
				</el-table-column>
				<el-table-column prop="orderDate" label="采购时间" min-width="7%" />
				<el-table-column prop="purchaseStatusDesc" label="采购状态" min-width="6%" />
				<el-table-column label="操作" fixed="right" min-width="5%">
					<template slot-scope="scope">
						<el-link style="color:#DF9524" size="mini" @click="goOrder(scope.row.orderNo)">详情</el-link>
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
		QueryPurchaseOrders
	} from '@/api/order/order'
	import waves from '@/directive/waves'
	import {
		deepClone
	} from '@/utils/index'
	import moment from 'moment'
	import {
		GetPurchasePlatForms
	} from '@/api/sys/dict'
	import {
		AddOperationLog
	} from '@/api/sys/log'
	export default {
		name: 'SupplierPurchaseOrder',
		directives: {
			waves
		},
		data() {
			return {
				searchCondition1: {
					orderDates: [],
					purchaseOrderNo: '',
					orderNo: '',
					platformOrderNo: '',
					hotelName: '',
					checkInName: '',
					checkInPhone: ''
				},
				searchCondition: {
					orderDates: [],
					purchaseOrderNo: '',
					orderNo: '',
					platformOrderNo: '',
					hotelName: '',
					checkInName: '',
					checkInPhone: ''
				},
				purchaseOrders: [],
				tableLoading: false,
				totalCount: 0,
				pageSize: 10,
				pageIndex: 1,
				purchasePlatDict:[]
			}
		},
		watch: {

		},
		created() {
			this.init()
		},
		methods: {
			init() {
				this.fetchOrders()
				//this.getPurchasePlatDict()
			},
			getPurchasePlatDict(){
					GetPurchasePlatForms().then((res) => {
						this.purchasePlatDict = res.data.map(item => {
							return {
								dictLabel: item.configName,
								dictValue: item.id
							}
						})
						console.log(this.purchasePlatDict)
					})
			},
			exportOrders() {
				const condition = {
					...this.searchCondition,
					orderDate: {
						item1: this.searchCondition1.orderDates ? this.searchCondition1.orderDates[0] : '',
						item2: this.searchCondition1.orderDates ? this.searchCondition1.orderDates[1] : ''
					},
					PageSize: 10000,
					PageIndex: 1
				}
				QueryPurchaseOrders(condition).then(res => {
					const orders = res.data.rows
					import('@/vendor/Export2Excel').then(excel => {
						const filterVal = ['purchaseNo', 'orderNo', 'orderSource', 'thirdOrderNo',
							'platformOrderNo', 'platform', 'purchaseMethodDesc', 'hotelName',
							'roomTypeName', 'checkRoomCount', 'orderAmount', 'orderBasePrice',
							'purchasePrice', 'profit', 'checkInName', 'remark', 'checkInDate',
							'checkOutDate', '预定日期', 'orderDate', 'purchaseStatusDesc'
						]
						const data = this.formatJson(filterVal, orders)
						excel.export_json_to_excel({
							header: ['采购单号', '订单号', '订单来源', '第三方订单号', '采购平台单号', '平台', '采购方式',
								'酒店名称', '房型', '数量', '订单金额', '订单底价', '采购金额', '利润', '入住人', '备注',
								'入住日期', '离店日期', '预定日期', '采购时间', '采购状态'
							],
							data: data,
							filename: this.filename,
							autoWidth: this.autoWidth,
							bookType: this.bookType
						})
					})
					AddOperationLog('EXPORT_PURCHASEORDER', JSON.stringify(condition))
				})
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => {
					return v[j]
				}))
			},
			fetchOrders(tip) {
				this.tableLoading = true

				const condition = {
					...this.searchCondition1,
					orderDate: {
						item1: this.searchCondition1.orderDates ? this.searchCondition1.orderDates[0] : '',
						item2: this.searchCondition1.orderDates ? this.searchCondition1.orderDates[1] : ''
					},
					PageSize: this.pageSize,
					PageIndex: this.pageIndex
				}
				QueryPurchaseOrders(condition).then(res => {
					console.log(res.data.rows)
					this.purchaseOrders = res.data.rows
					this.totalCount = res.data.total

					this.tableLoading = false
					if (tip) {
						this.$message('搜索成功')
					}
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
				this.$router.push({
					path: `/allorder/${orderNo}`,
					query: {
						orderNo
					}
				})
			},
			goHotel(hotelCode) {
				this.$router.push({
					path: `/hotel`,
					query: {
						hotelCode: hotelCode,
						checkInDate: new Date(),
						checkOutDate: new Date()
					}
				})
			},
			dateTimeToDate(val) {
				return moment(val).format('YYYY-MM-DD')
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

	.searchForm>>>.el-form-item {
		width: 120px;
	}

	.searchForm>>>.el-range-editor {
		width: 230px !important;
	}
</style>
