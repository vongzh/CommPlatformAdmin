<template>
	<div class="content">
		<div class="filter-container">
			<el-card>
				<el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top"
					class="searchForm">
					<el-form-item label="订单号" prop="orderNo">
						<el-input v-model="searchCondition.orderNo" clearable placeholder="订单号"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="退款单号" prop="refundNo">
						<el-input v-model="searchCondition.refundNo" clearable placeholder="退款单号"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="退款类型" prop="refundType">
						<el-select v-model="searchCondition.refundType" clearable>
							<el-option :value="1" label="用户取消" />
							<el-option :value="2" label="预订失败" />
							<el-option :value="3" label="售后退款" />
							<el-option :value="4" label="调账退款" />
						</el-select>
					</el-form-item>
					<el-form-item label="退款状态" prop="RefundOrderStatus">
						<el-select v-model="searchCondition.RefundOrderStatus" clearable>
							<el-option :value="0" label="待审核" />
							<el-option :value="4" label="待退款" />
							<el-option :value="6" label="退款成功" />
							<el-option :value="7" label="退款失败" />
						</el-select>
					</el-form-item>
					<el-form-item label="申请日期" prop="requestDates" style="width: 230px;">
						<el-date-picker v-model="searchCondition.requestDates" value-format="yyyy-MM-dd"
							type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" align="right" />
					</el-form-item>
					<el-form-item label="　" style="user-select: none;width: 200px;">
						<el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search"
							@click="searchRefund(true)">搜索</el-button>
						<el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close"
							@click="handleReset('searchForm')">重置</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
		<el-card>
			<div class="tools">
				<el-row>
					<el-button-group>
						<el-button v-waves size="medium" icon="el-icon-refresh" @click="searchRefund('refresh')" />
					</el-button-group>
					<el-button type="text" style="float:right" @click="exportRefundOrders">导出列表</el-button>
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

			<el-table v-loading="loading" :fit="true" border stripe highlight-current-row :data="applyRefunds">
				<el-table-column label="订单号" min-width="15%" v-if="colData[0].istrue">
					<template slot-scope="scope">
						<el-link type="info" @click="goOrder(scope.row.orderNo)">{{ scope.row.orderNo }}</el-link>
						<i class="el-icon-document-copy copy" v-clipboard:copy="scope.row.orderNo"
							v-clipboard:success="copySuccess" v-clipboard:error="copyError"></i>
					</template>
				</el-table-column>
				<el-table-column prop="refundNo" label="退款单号" min-width="15%" v-if="colData[1].istrue">
					<!-- <template slot-scope="scope">
            <el-link type="info">{{ scope.row.refundNo }}</el-link>
          </template> -->
				</el-table-column>
				<el-table-column prop="refundAmount" label="退款金额" min-width="15%" v-if="colData[2].istrue" />
				<el-table-column prop="refundTypeDesc" label="退款类型" min-width="15%" v-if="colData[3].istrue" />
				<el-table-column prop="refundWayDesc" label="退款方式" min-width="15%" v-if="colData[4].istrue" />
				<el-table-column label="退款状态" min-width="15%" v-if="colData[5].istrue">
					<template slot-scope="scope">
						<!-- <el-popover
                v-if="scope.row.refundStatus === refundApplyOrderStatus.REJECT"
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scope.row.auditDesc"
              >
                <el-link slot="reference" type="warning" style="margin-left:3px">{{ scope.row.refundStatusDesc }}</el-link>
              </el-popover> -->
						<el-col style="margin-left:3px">{{ getStatus(scope.row.refundStatus) }}</el-col>
					</template>
				</el-table-column>
				<el-table-column prop="applyTime" label="申请时间" min-width="20%" v-if="colData[6].istrue" />
				<!-- <el-table-column label="处理进度" width="100">
          <template slot-scope="scope">
            <el-tag effect="plain" :type="getRefundAuditStatusTag(scope.row.auditStatus)">{{ scope.row.auditStatusDesc }}</el-tag>
          </template>
        </el-table-column> -->
				<!-- <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.refundStatus === refundApplyOrderStatus.SUBMIT"
              type="danger"
              size="mini"
              class="btn-opt"
              @click="cancelRefoundApply(scope.row.refundNo)"
            >取消退款申请</el-button>
          </template>
        </el-table-column> -->
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
		GetRefundApplys,
		CancelRefoundApply
	} from '@/api/refund/refund'
	import waves from '@/directive/waves'
	import {
		deepClone
	} from '@/utils/index'
	import {
		AddOperationLog
	} from '@/api/sys/log'

	export default {
		name: 'RefundList',
		directives: {
			waves
		},
		data() {
			return {
				searchCondition1: {
					requestDates: [],
					orderNo: '',
					refundNo: '',
					RefundOrderStatus: '',
					refundType: '',
				},
				searchCondition: {
					requestDates: [],
					orderNo: '',
					refundNo: '',
					RefundOrderStatus: '',
					refundType: '',
				},
				colData: [{
						title: "订单号",
						istrue: true
					},
					{
						title: "退款单号",
						istrue: true
					},
					{
						title: "退款金额",
						istrue: true
					},
					{
						title: "退款类型",
						istrue: true
					},
					{
						title: "退款方式",
						istrue: true
					},
					{
						title: "退款状态",
						istrue: true
					},
					{
						title: "申请时间",
						istrue: true
					},
				],
				colOptions: ["订单号", "退款单号", "退款金额", "退款类型", "退款方式", "退款状态", "申请时间"], //默认全选
				colSelect: ["订单号", "退款单号", "退款金额", "退款类型", "退款方式", "退款状态", "申请时间"], //选中
				applyRefunds: [],
				totalCount: 0,
				pageSize: 10,
				pageIndex: 1,
				refundApplyOrderStatus: {
					WAITAUDIT: 0,
					REJECT: 2,
					WAITREFUND: 4,
					REFUNDING: 5,
					REFUNDSUCCESS: 6,
					REFUNDFAIL: 7,
					CLOSE: -1
				},
				loading: false,
				statusDict: [{
						dictLabel: "待审核",
						dictValue: "0"
					},
					{
						dictLabel: "拒绝退款",
						dictValue: "2"
					},
					{
						dictLabel: "待退款",
						dictValue: "4"
					},
					{
						dictLabel: "退款成功",
						dictValue: "6"
					},
					{
						dictLabel: "退款失败",
						dictValue: "7"
					},
				]
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
				this.fetchRefunds()
			},
			getStatus(status){
				let arr = this.statusDict.filter(item => {
					return item.dictValue == status
				})
				return arr.length > 0 ? arr[0].dictLabel : "";
			},
			searchRefund(type) {
				if (type === 'refresh') {
					this.fetchRefunds()
				} else {
					this.searchCondition1 = deepClone(this.searchCondition)
					this.pageIndex = 1
					this.fetchRefunds(true)
				}
			},
			fetchRefunds(tip) {
				this.loading = true

				const param = {
					...this.searchCondition1,
					requestDate: {
						item1: this.searchCondition1.requestDates ? this.searchCondition1.requestDates[0] : '',
						item2: this.searchCondition1.requestDates ? this.searchCondition1.requestDates[1] : ''
					},
					PageSize: this.pageSize,
					PageIndex: this.pageIndex
				}
				GetRefundApplys(param).then(res => {
					// v-if="scope.row.refundStatus === refundApplyOrderStatus.REJECT"
					let StatusDesc = '退款失败'
					for (var i = 0; i < res.data.rows.length; i++) {
						if (res.data.rows[i].refundStatus === this.refundApplyOrderStatus.REJECT) {
							res.data.rows[i].refundStatusDesc = '退款失败'
						}
					}
					this.applyRefunds = res.data.rows
					this.totalCount = res.data.total

					this.loading = false
					if (tip) {
						this.$message('搜索成功')
					}
				})
			},
			handleReset(formName) {
				this.$refs[formName].resetFields()
			},
			getRefundAuditStatusTag(status) {
				let statusTag = 'primary'
				switch (status) {
					case this.refundApplyOrderAuditStatus.PASS:
						statusTag = 'success'
						break
					case this.refundApplyOrderAuditStatus.REJECT:
						statusTag = 'danger'
						break
				}
				return statusTag
			},
			getRefundStatusTag(status) {
				let statusTag = 'primary'
				switch (status) {
					case this.refundApplyOrderStatus.COMPLETE:
						statusTag = 'success'
						break
					case this.refundApplyOrderStatus.CLOSE:
						statusTag = 'danger'
						break
					case this.refundApplyOrderStatus.PROCESSING:
						statusTag = 'warning'
						break
				}
				return statusTag
			},
			cancelRefoundApply(refundNo) {
				this.$confirm('确定要取消退款申请吗？', '确认提示', {
						distinguishCancelAndClose: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'info'
					})
					.then(() => {
						CancelRefoundApply(refundNo).then(res => {
							if (res.data) {
								this.pageIndex = 1
								this.fetchRefunds()
								this.$message({
									type: 'success',
									message: '取消退款申请成功'
								})
							} else {
								this.$message({
									type: 'error',
									message: '取消退款申请失败'
								})
							}
						})
					})
					.catch(action => {

					})
			},
			onPageChange(index) {
				this.pageIndex = index
				this.fetchRefunds()
			},
			handleSizeChange(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.fetchRefunds()

			},
			goOrder(orderNo) {
				this.$router.push({
					path: `/order/${orderNo}`
				})
			},
			exportRefundOrders() {
				const param = {
					...this.searchCondition1,
					requestDate: {
						item1: this.searchCondition1.requestDates[0],
						item2: this.searchCondition1.requestDates[1]
					},
					PageSize: 1000,
					PageIndex: this.pageIndex
				}
				GetRefundApplys(param).then(res => {
					const orders = res.data.rows
					import('@/vendor/Export2Excel').then(excel => {
						const filterVal = ['refundNo', 'orderNo', 'refundAmount', 'refundReasonDesc',
							'refundDesc', 'applyTime', 'refundStatusDesc', 'auditStatusDesc'
						]
						const data = this.formatJson(filterVal, orders)
						excel.export_json_to_excel({
							header: ['退款单号', '订单号', '退款金额', '退款原因', '问题描述', '申请时间', '退款状态',
								'处理进度'],
							data: data,
							filename: this.filename,
							autoWidth: this.autoWidth,
							bookType: this.bookType
						})
					})
					AddOperationLog('CUSTOMER_EXPORT_REFUNDORDER', JSON.stringify(param))
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
		margin: 0.625rem;
	}

	.pagination {
		margin: 0.625rem;
	}

	.el-form--inline .el-form-item {
		margin-bottom: 0;
	}

	.searchForm>>>.el-form-item {
		width: 120px;
	}

	.searchForm>>>.el-range-editor {
		width: 230px !important;
	}
</style>
