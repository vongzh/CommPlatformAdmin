<template>
	<div class="content">
		<el-card style="margin-bottom: 10px;" class="search">
			<el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
				<el-form-item label="直连商家" prop="directPlatformId">
					<el-select v-model="searchCondition.directPlatformId" clearable>
						<el-option v-for="(item,index) in merchantsDict" :value="item.dictValue"
							:label="item.dictLabel" />
					</el-select>
				</el-form-item>
				<el-form-item label="计划任务名称" prop="offerConfigName">
					<el-input v-model="searchCondition.offerConfigName" placeholder="请输入计划任务名称"
						class="filter-item input-search" />
				</el-form-item>
				<el-form-item label="采购平台" prop="purchaseConfigId">
					<el-select v-model="searchCondition.purchaseConfigId" clearable>
						<el-option v-for="(item,index) in purchasePlatDict" :value="item.dictValue"
							:label="item.dictLabel" />
					</el-select>
				</el-form-item>
				<el-form-item label="状态" prop="isEffect">
					<el-select v-model="searchCondition.isEffect" clearable>
						<el-option v-for="(item,index) in statusDict" :value="item.dictValue" :label="item.dictLabel" />
					</el-select>
				</el-form-item>
				<el-form-item label="起止时间" prop="hotelOfferDates" style="width: 230px;">
					<el-date-picker v-model="searchCondition.hotelOfferDates" type="daterange" value-format="yyyy-MM-dd"
						start-placeholder="开始日期" end-placeholder="结束日期" align="right" style="width: 230px;" />
				</el-form-item>
				<el-form-item label="　" style="width: auto;user-select: none">
					<el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search"
						@click="handleSearch()">搜索</el-button>
					<el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close"
						@click="resetForm('searchForm')">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card>
			<div class="tools">
				<el-button-group>
					<el-button v-waves size="medium" icon="el-icon-plus" @click="add()" />
					<el-button v-waves size="medium" icon="el-icon-refresh" @click="handleSearch('refresh')" />
				</el-button-group>
			</div>
			<el-table v-loading="loading" :data="dataList" :fit="true" border stripe highlight-current-row >
				<el-table-column type="index" label="序号" width="90" />
				<el-table-column prop="directPlatformId" label="直连商家" :formatter="merchantsDictFormatter" />
				<el-table-column prop="offerConfigName" label="计划任务名称" />
				<el-table-column prop="purchaseConfigId" label="采购平台" :formatter="purchasePlatDictFormatter" width="140" />
				<el-table-column prop="premiumRate" label="溢价率" width="90" />
				<el-table-column prop="premiumAmount" label="溢价金额" width="90" />
				<el-table-column label="状态"  width="70" >
					<template slot-scope="scope">
						<el-tag effect="plain" :type="scope.row.isEffect == 1 ? '' : 'danger'">
							{{statusDictFormatter(scope.row)}}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="offerStartDate" label="计划任务起始时间" width="150" />
				<el-table-column prop="offerEndDate" label="计划任务结束时间" width="150" />
				<el-table-column prop="modifyTime" label="编辑时间" width="150" />
				<el-table-column prop="createTime" label="创建时间" width="150" />
				<el-table-column label="操作" fixed="right">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" @click="editData(scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
						<!-- <el-button icon="el-icon-download" @click="exportOrders(scope.row)">下载</el-button> -->
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<div style="margin-top: 0.625rem;">
			<el-pagination background layout="total, prev, pager, next, jumper" :total="totalCount"
				:page-size="pageSize" :current-page="pageIndex" @current-change="handlePageChange" />
		</div>
		<el-dialog :visible.sync="dataVisiable" label-position="left" :inline="true" width="70%"
			:close-on-click-modal="false" @close="closeForm">
			<div slot="title">
				<span>数据配置</span>
			</div>
			<el-form label-width="100px" ref="addForm" :model="form" class="addForm	" :rules="rules">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="任务名称" prop="offerConfigName">
							<el-input v-model="form.offerConfigName" placeholder="请输入任务名称" maxlength="15"
								show-word-limit />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="直连商家" prop="directPlatformId">
							<el-select v-model="form.directPlatformId" clearable>
								<el-option v-for="(item,index) in merchantsDict" :value="item.dictValue"
									:label="item.dictLabel" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="是否生效" prop="isEffect">
							<el-radio-group v-model="form.isEffect">
								<el-radio :label="1">有效</el-radio>
								<el-radio :label="0">无效</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="任务描述" prop="offerConfigDesc">
							<el-input v-model="form.offerConfigDesc" placeholder="请输入任务描述" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="酒店配置">
							<div :class=" isFold ? 'el-icon-arrow-down' : 'el-icon-arrow-up' " @click="changeFold"
								style="cursor: pointer;"></div>
						</el-form-item>
					</el-col>
					<div v-show="!isFold">
						<el-col :span="8">
							<el-form-item label="星级" prop="hotelStar">
								<el-select v-model="form.hotelStar" clearable>
									<el-option v-for="(item,index) in starDict" :value="item.dictValue"
										:label="item.dictLabel" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="省份" prop="hotelProvince">
								<el-select v-model="form.hotelProvince" clearable>
									<el-option v-for="(item,index) in provinceDict" :value="item.dictValue"
										:label="item.dictLabel" @change="provinceChange" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="城市" prop="hotelCity">
								<el-select v-model="form.hotelCity" clearable>
									<el-option v-for="(item,index) in cityDict" :value="item.dictValue"
										:label="item.dictLabel" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="品牌" prop="hotelBrand">
								<el-select v-model="form.hotelBrand" clearable>
									<el-option v-for="(item,index) in brandDict" :value="item.dictValue"
										:label="item.dictLabel" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="标签" prop="hotelTag">
								<el-select v-model="form.hotelTag" clearable>
									<el-option v-for="(item,index) in labelDict" :value="item.dictValue"
										:label="item.dictLabel" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="物理酒店ID" prop="hotelId">
								<el-input v-model="form.hotelId" placeholder="请输入物理酒店ID(以英文逗号分割)" />
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="物理房型ID" prop="roomTypeId">
								<el-input v-model="form.roomTypeId" placeholder="请输入物理房型ID(以英文逗号分割)" />
							</el-form-item>
						</el-col>
					</div>
					<el-col :span="24">
						<el-form-item label="溢价类型" prop="type">
							<el-checkbox-group v-model="form.type" @change="changeType">
								<el-checkbox name="type" label=1>按百分比</el-checkbox>
								<el-checkbox name="type" label=2>按金额</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="溢价率" prop="premiumRate" v-if="form.type.indexOf('1') > -1">
							<el-input-number v-model="form.premiumRate" label="请输入溢价率" :step="0.01" :min="0.9">
							</el-input-number>
							<el-popover placement="bottom" trigger="hover" content="默认为1，+1为1.01，-1为0.99">
								<el-button slot="reference" icon="el-icon-question" type="text"
									style="font-size: 16px !important;color: #666 !important;margin: 0 !important;border: none;padding: 8px;">
								</el-button>
							</el-popover>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="溢价金额" prop="premiumAmount" v-if="form.type.indexOf('2') > -1">
							<el-input-number v-model="form.premiumAmount" :min="-100" :max="100" label="请输入溢价金额">
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="库存" prop="inventory">
							<el-input-number v-model="form.inventory" :min="1"  label="请输入溢价金额">
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="开始时间" prop="offerStartDate">

							<el-date-picker v-model="form.offerStartDate" type="datetime" placeholder="选择时间"
								style="width: 200px;" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
								:picker-options="pickerOptionsStart">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="结束时间" prop="offerEndDate">

							<el-date-picker v-model="form.offerEndDate" type="datetime" placeholder="选择时间"
								style="width: 200px;" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
								:picker-options="pickerOptionsEnd">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="采购平台" prop="purchaseConfigId">
							<el-select v-model="form.purchaseConfigId" placeholder="请选择">
								<el-option v-for="(item,index) in purchasePlatDict" :value="item.dictValue"
									:label="item.dictLabel" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" type="primary" @click="saveData('addForm')">提交</el-button>
				<el-button size="small" @click="closeForm">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		GetHotelQuotes,
		DeleteHotelQuote,
		HotelQuote,
		CheckHotelQuote
	} from '@/api/sys/hotelOffer'
	import {
		GetPurchasePlatForms
	} from '@/api/sys/dict'
	import waves from '@/directive/waves'
	import {
		deepClone
	} from '@/utils/index'
	import moment from 'moment'
	import {
		AddOperationLog
	} from '@/api/sys/log'
	import {
		GetHotelCategoryByCityId,
		GetHotelStar,
		GetHotelBrandByCityId,
	} from '@/api/hotel/hotel'
	import {
		GetPlatformDict,
	} from '@/api/dict/dict'
	export default {
		name: 'hotelOffer',
		directives: {
			waves
		},
		data() {
			var checkName = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('请输入任务名称'));
				}
				if (value != this.name) {
					CheckHotelQuote({
						offerConfigName: value
					}).then(res => {
						if (res.data) {
							return callback(new Error('名称已存在'));
						} else return callback();
					})
				} else {
					return callback()
				}
			};
			var checkStartTime = (rule, value, callback) => {
				if (new Date(this.form.offerEndDate).getTime() - new Date(value).getTime() <= 0) {
					callback(new Error('开始时间不得晚于结束时间'));
				} else callback()
			};
			var checkEndTime = (rule, value, callback) => {
				if (new Date(value).getTime() - new Date(this.form.offerStartDate).getTime() <= 0) {
					callback(new Error('结束时间不得早于开始时间'));
				} else callback()
			};
			return {
				searchCondition: {
					derectPlatformId: "",
					offerConfigName: "",
					purchaseConfigId: "",
					isEffect: "",
					hotelOfferDates: [],
					hotelOfferDate: ""
				},
				pageSize: 10,
				pageIndex: 1,
				dataList: [],
				dataVisiable: false,
				totalCount: 0,
				data: {},
				loading: false,
				form: {
					id:"",
					offerConfigName: "",
					directPlatformId: "",
					isEffect: 1,
					offerConfigDesc: "",
					hotelStar: "0",
					hotelProvince: "0",
					hotelCity: "0",
					hotelBrand: "0",
					hotelTag: "0",
					hotelId: "",
					roomTypeId: "",
					premiumType: "",
					premiumRate: 1,
					premiumAmount: "",
					inventory: "",
					offerStartDate: "",
					offerEndDate: "",
					purchaseConfigId: "",
					type: []
				},

				rules: {
					offerConfigName: [{
							required: true,
							message: '请输入任务名称',
							trigger: 'blur'
						},
						{
							validator: checkName,
							trigger: 'blur'
						}
					],
					directPlatformId: [{
						required: true,
						message: '请选择直连商家',
						trigger: 'change'
					}],
					offerConfigDesc: [{
						required: true,
						message: '请输入任务描述',
						trigger: 'blur'
					}],
					// hotelStar: [{
					// 	required: true,
					// 	message: '请选择星级',
					// 	trigger: 'change'
					// }],
					// hotelProvince: [{
					// 	required: true,
					// 	message: '请选择省份',
					// 	trigger: 'change'
					// }],
					// hotelCity: [{
					// 	required: true,
					// 	message: '请选择城市',
					// 	trigger: 'change'
					// }],
					// hotelBrand: [{
					// 	required: true,
					// 	message: '请选择品牌',
					// 	trigger: 'change'
					// }],
					// hotelTag: [{
					// 	required: true,
					// 	message: '请选择标签',
					// 	trigger: 'change'
					// }],
					hotelId: [{
							required: false,
							message: '请输入酒店ID',
							trigger: 'blur'
						},
						{
							pattern: /^(([0-9]+)(\,*))+$/,
							message: 'ID请以英文逗号分割',
							trigger: 'blur'
						}
					],
					roomTypeId: [{
							required: false,
							message: '请输入房型ID',
							trigger: 'blur'
						},
						{
							pattern: /^(([0-9]+)(\,*))+$/,
							message: 'ID请以英文逗号分割',
							trigger: 'blur'
						}
					],
					type: [{
						type: 'array',
						required: true,
						message: '请至少选择一个类型',
						trigger: 'change'
					}],
					premiumRate: [{
						required: true,
						message: '请输入溢价率',
						trigger: 'change'
					}],
					premiumAmount: [{
						required: true,
						message: '请输入溢价金额',
						trigger: 'change'
					}],
					inventory: [{
						required: true,
						message: '请输入库存',
						trigger: 'change'
					}],
					offerStartDate: [{
						required: true,
						message: '请选择开始时间',
						trigger: 'change'
					}],
					offerEndDate: [{
						required: true,
						message: '请选择结束时间',
						trigger: 'change'
					}],
					purchaseConfigId: [{
						required: true,
						message: '请选择采购平台',
						trigger: 'change'
					}],
				},
				starDict: [{
					dictLabel: "全部",
					dictValue: "0",
				}],
				provinceDict: [{
					dictLabel: "全部",
					dictValue: "0",
				}],
				cityDict: [{
					dictLabel: "全部",
					dictValue: "0",
				}],
				brandDict: [{
					dictLabel: "全部",
					dictValue: "0",
				}],
				labelDict: [{
					dictLabel: "全部",
					dictValue: "0",
				}],
				purchasePlatDict: [{
						dictLabel: "美团分销",
						dictValue: 6,
					},
					{
						dictLabel: "携程商旅",
						dictValue: 7,
					},
					{
						dictLabel: "携程代订",
						dictValue: 8,
					},
					{
						dictLabel: "携程分销",
						dictValue: 9,
					},
					{
						dictLabel: "快跑",
						dictValue: 12,
					},
				],
				merchantsDict: [{
						dictLabel: "51ZhuWeb",
						dictValue: 1,
					},
					{
						dictLabel: "美团",
						dictValue: 2,
					},
					{
						dictLabel: "51ZhuAPI",
						dictValue: 3,
					},
					{
						dictLabel: "携程",
						dictValue: 10,
					},
					{
						dictLabel: "艺龙",
						dictValue: 70,
					},
					{
						dictLabel: "去哪儿",
						dictValue: 30,
					},
					{
						dictLabel: "同程",
						dictValue: 40,
					},
					{
						dictLabel: "飞猪",
						dictValue: 5,
					},
					{
						dictLabel: "武汉胜意",
						dictValue: 15,
					},
					{
						dictLabel: "易沃思",
						dictValue: 16,
					},
				],
				statusDict: [{
					dictLabel: "无效",
					dictValue: "0",
				}, {
					dictLabel: "有效",
					dictValue: "1",
				}],
				isFold: true,
				name: "",
				pickerOptionsStart: {
					disabledDate: (time) => {
						if (this.form.offerEndDate) {
							return (
								time.getTime() >= new Date(this.form.offerEndDate).getTime()
							);
						}
					}
				},
				pickerOptionsEnd: {
					disabledDate: (time) => {
						if (this.form.offerStartDate) {
							return (
								time.getTime() <= new Date(this.form.offerStartDate).getTime()
							);
						}
					}
				},
			}
		},
		watch: {

		},
		created() {
			this.init()
		},
		methods: {
			init() {
				this.fetchDatas()
				this.getPurchasePlatDict()
				this.getDict()
				//this.fetchHotelStars()
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
			// fetchHotelTypes() {
			// 	GetHotelCategoryByCityId().then((res) => {
			// 		this.labelDict = res.data
			// 		console.log(res.data)
			// 	})
			// },
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
			fetchHotelStars() {
				GetHotelStar().then((res) => {
					this.starDict = res.data.map(item => {
						return {
							dictLabel: item.starName,
							dictValue: item.starLevel
						}
					})
				})
			},
			// fetchHotelBrands() {
			// 	GetHotelBrandByCityId().then((res) => {
			// 		this.brandDict = res.data
			// 		console.log(res.data)
			// 	})
			// },
			merchantsDictFormatter(row, column) {
				let arr = this.merchantsDict.filter(item => {
					return item.dictValue == row.directPlatformId
				})
				if (arr.length > 0) return arr[0].dictLabel
				else return ""
			},
			purchasePlatDictFormatter(row, column) {
				let arr = this.purchasePlatDict.filter(item => {
					return item.dictValue == row.purchaseConfigId
				})
				if (arr.length > 0) return arr[0].dictLabel
				else return ""
			},
			statusDictFormatter(row, column) {
				let arr = this.statusDict.filter(item => {
					return item.dictValue == row.isEffect
				})
				if (arr.length > 0) return arr[0].dictLabel
				else return ""
			},
			// 	searchDatas() {
			// 		this.searchConditionRequest = this.searchCondition

			// 		this.pageIndex = 1
			// 		this.fetchDatas(true)
			// 	},
			fetchDatas(tip) {

				const param = {
					...this.searchCondition,
					hotelOfferDate: {
						item1: this.searchCondition.hotelOfferDates ? this.searchCondition.hotelOfferDates[0] : '',
						item2: this.searchCondition.hotelOfferDates ? this.searchCondition.hotelOfferDates[1] : ''
					},
					PageSize: this.pageSize,
					PageIndex: this.pageIndex
				}
				this.loading = true

				GetHotelQuotes(param).then(res => {
					this.dataList = res.data.rows
					this.totalCount = res.data.total

					if (tip) {
						this.$message('搜索成功')
					}
					this.loading = false
				})
			},
			handleDelete(config) {
				const tip = '删除后不能恢复,确定要删除吗?'
				this.$confirm(tip, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					DeleteHotelQuote({
						id: config.id
					}).then(res => {
						if (res.result) {
							this.fetchDatas()
							this.$message('删除成功')
						} else {
							this.$message(res.message || '删除失败')
						}
					})
				})
			},
			editData(config) {
				this.dataVisiable = true
				this.edit = true
				this.$nextTick(() => {
					this.form = deepClone(config)
					this.name = config.offerConfigName
					if (this.form.premiumType == 3) {
						this.$set(this.form, "type", ['1', '2'])
					} else {
						this.$set(this.form, "type", [String(this.form.premiumType)])
					}
				});
			},
			saveData(form) {
				this.$refs[form].validate((valid) => {
					if (valid) {
						var type = this.form.type
						if (type.length == 2) {
							this.form.premiumType = 3
						} else this.form.premiumType = type[0]
						HotelQuote(this.form).then(res => {
							if (res.result) {
								this.resetForm('addForm')
								this.form.id = ""
								this.form.premiumRate = 1
								this.form.premiumAmount = ""
								this.dataVisiable = false
								this.fetchDatas()
								this.$message({
									message: '保存成功',
									type: 'success'
								})
							} else {
								this.$message.error('保存失败')
							}
						})
					} else {
						return false;
					}
				});
			},
			handlePageChange(index) {
				this.pageIndex = index
				this.fetchDatas()
			},
			add() {
				this.dataVisiable = true
				this.$nextTick(() => {
					this.name = ""
					this.resetForm('addForm')
				})
			},
			handleSearch(type) {
				if (type === 'refresh') {
					this.fetchDatas()
				} else {
					this.pageIndex = 1
					this.fetchDatas()
				}
			},
			closeForm() {
				this.resetForm('addForm')
								this.form.id = ""
								this.form.premiumRate = 1
								this.form.premiumAmount = ""
				this.dataVisiable = false
			},
			resetForm(form) {
				this.$refs[form].resetFields()
			},
			exportQuotes() {
				const condition = {
					...this.searchCondition,
					orderDate: {
						item1: this.searchCondition.orderDates[0],
						item2: this.searchCondition.orderDates[1]
					},
					PageSize: 10000,
					PageIndex: this.pageIndex
				}
				GetHotelQuote(condition).then(res => {
					const orders = res.data.rows
					import('@/vendor/Export2Excel').then(excel => {
						const filterVal = ["merchants", "purchasePlat", "hotelId", "hotelName",
							"province",
							"city", "roomId", "roomName", "taskName", "ratio", "amount"
						]
						const data = this.formatJson(filterVal, orders)

						excel.export_json_to_excel({
							header: ["直连商家", "采购平台", "酒店id", "酒店名称", "省份", "城市", "房型id",
								"房型名称",
								"酒店报价任务计划名称", "利润比", "金额"
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
			dateTimeToDate(val) {
				return moment(val).format('YYYY-MM-DD')
			},
			provinceChange(val) {
				this.cityDict = []
			},
			changeFold() {
				this.isFold = !this.isFold
			},
			changeType() {
				console.log(this.form.type)
			}
		}
	}
</script>

<style scoped>
	.content {
		margin: 10px;
	}

	.dialog-footer {
		text-align: center;
	}

	.content>>>.el-dialog__body {
		padding: 30px 50px
	}

	.search>>>.el-form-item {
		width: 160px;
	}

	.addForm>>>.el-form-item {
		margin-bottom: 0px !important;
	}
</style>
