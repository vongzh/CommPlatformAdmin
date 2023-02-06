<template>
	<div class="content">
		<el-row style="width: 1100px;margin: 0 auto;">

			<el-col :xl="16" :sm="16" class="content-left">
				<el-card style="margin-bottom: 1rem;" shadow="never">
					<el-row>
						<el-col :span="6">
							<el-image class="img" fit="cover" style="height: 200px;"
								:src="roomInfo.roomTypeImgs && roomInfo.roomTypeImgs.length>0?roomInfo.roomTypeImgs[0].imgUrl:''"
								:preview-src-list="roomInfo.roomTypeImgs && roomInfo.roomTypeImgs.length>0?roomInfo.roomTypeImgs.map((v,i,a)=>{ return v.imgUrl }):[]">
								<div slot="error"
									style="height: 100%;width:100%;background-color: #F5F7FA;color: #C0C4CC;padding-left: 45%;padding-top: 20%;">
									<i class="el-icon-picture-outline" />
								</div>
							</el-image>
						</el-col>
						<el-col :span="18" style="padding: 10px 20px 0 20px;">
							<div>
								<div>
									<el-link :underline="false" class="title"
										style="font-weight: bold;font-size: 30px;">{{ roomInfo.hotelName }}</el-link>
								</div>
								<div>

									<el-link :underline="false" class="text"><span class="el-icon-location"
											style="margin-right: 5px;"></span>{{ roomInfo.hotelAddress }}</el-link>
								</div>

							</div>
							<el-row class=" detail">
								<el-row style="margin-bottom: 1rem;">
									<el-link :underline="false" class="sub-title">{{ roomInfo.roomTypeName }}</el-link>
								</el-row>
								<el-descriptions>
									<el-descriptions-item label="面积">{{ roomInfo.areaRange }}</el-descriptions-item>
									<el-descriptions-item label="网络">{{ roomInfo.netDesc }}</el-descriptions-item>
									<el-descriptions-item label="窗户">{{ roomInfo.windowDesc }}</el-descriptions-item>
									<el-descriptions-item label="可住">{{ roomInfo.liveInCount }}</el-descriptions-item>
									<el-descriptions-item label="床型">{{ roomInfo.bedTypeName }}</el-descriptions-item>
									<!-- <el-descriptions-item label="早餐">{{ roomInfo.breakfastDesc }}</el-descriptions-item> -->
								</el-descriptions>


							</el-row>
						</el-col>
					</el-row>
				</el-card>
				<el-card style="margin-bottom: 1rem;" shadow="never">
					<el-row style="border-bottom: 1px dashed #ccc;padding-bottom: 1rem;">
						<!-- <el-row class="first-row">
              <el-col :xl="6">
                <el-link :underline="false" class="right-text">房型名称</el-link>
              </el-col>
              <el-col :xl="10">
                <el-link :underline="false" class="right-text">{{ roomInfo.roomTypeName }}</el-link>
              </el-col>
            </el-row> -->
						<el-row>
							<el-col :span="10">
								<div style="margin:10px 0;">入离日期</div>
								<el-date-picker v-model="Order.checkDate" :picker-options="pickerOptions"
									type="daterange" :editable="false" :clearable="false" value-format="yyyy-MM-dd"
									start-placeholder="入住" end-placeholder="离店" @change="checkDateChange"
									style="width: 230px;" />
							</el-col>
							<el-col :span="7">
								<div style="margin:10px 0;">房间数量</div>
								<el-input-number ref="rooms" v-model="Order.roomCount" :min="1" :max="5" :step="1"
									step-strictly @change="roomCountChange" style="width: 150px;" />
							</el-col>
							<el-col :span="7">
								<div style="margin:10px 0;">用户支付金额</div>
								<el-input-number v-model="Order.UserPaymentAmount" placeholder="金额" :max="5000"
									:step="10" :min="0" :precision="2" style="width: 150px;" />

							</el-col>
						</el-row>
					</el-row>
					<el-row style="margin-top: 1rem;">
						<div style="font-weight: bold;font-size: 20px;">入住信息</div>
						<div>
							<p style="font-size: 14px;">入住人<big style="color:red">*</big></p>
							<div style="width:350px" prop="reservedPhone">
								<el-input v-model="checkInName[0]" placeholder="每间需要填写1人姓名" clearable show-word-limit
									maxlength="12" />
							</div>
						</div>
						<div v-for="i in Order.roomCount - 1" :key="i">
							<p style="font-size: 14px;">入住人({{ i + 1 }})<big style="color:red">*</big></p>
							<div style="width:350px" prop="reservedPhone">
								<el-input v-model="checkInName[i]" placeholder="每间需要填写1人姓名" clearable show-word-limit
									maxlength="12" />
							</div>
						</div>
						<div>
							<p style="font-size: 14px;">入住人手机号<big style="color:red">*</big></p>
							<div style="width:350px" prop="reservedPhone">
								<el-input v-model="Order.checkInPhone" placeholder="用于接收短信通知" show-word-limit
									:maxlength="11" clearable />
							</div>
						</div>
						<div>
							<p style="font-size: 14px;">预计到店<big style="color:red">*</big></p>
							<div style="width:350px" prop="reservedPhone">
								<el-time-select v-model="Order.arrivalTime"
									:picker-options="{start: '14:00',step: '00:30',end: '23:30'}" placeholder="选择时间" />
							</div>
						</div>

					</el-row>
				</el-card>
				<el-card style="margin-bottom: 1rem;" shadow="never">
					<div style="display: flex;justify-content: space-between;">
						<span
							style="line-height: 40px;font-size: x-large;color: orange;font-weight: bold;">￥{{ Order.orderAmount }}</span>
						<el-button type="primary" :disabled="disabledSubmit" :loading="disabledSubmit" plain
							@click="preOrderCheck">提交订单</el-button>
					</div>
				</el-card>
			</el-col>
			<el-col :xl="8" :sm="8" class="content-left" >
				<sticky :sticky-top="marginTop">
					
				<el-card shadow="never">

					<el-row class=" detail" style="border-bottom: 1px dashed #ccc;margin-bottom: 1rem;">
						<div>
							<span class="el-icon-time" style="margin-right: 5px;"></span>{{ Order.checkDate[0] }} 至
							{{ Order.checkDate[1] }}
						</div>
						<el-row style="font-size: 14px;">
							<el-col :span="12">
								{{ Order.roomCount }}间 × {{ roomNight }}晚
							</el-col>
							<el-col :span="12">
								<div style="color: orange;text-align: right;">￥{{ Order.orderAmount }} </div>
							</el-col>
						</el-row>
						<el-row style="font-size: 26px;font-weight: bold;">
							<el-col :span="12">
								总价
							</el-col>
							<el-col :span="12">
								<div style="color: orange;text-align: right;">￥{{ Order.orderAmount }} </div>
							</el-col>
						</el-row>
					</el-row>
					<el-row class=" detail">
						<div style="font-weight: bold;font-size: 20px;">价格日历</div>
						<el-row style="font-size: 14px;">
							<el-col :span="12">
								日期
							</el-col>
							<el-col :span="12">
								价格
							</el-col>
						</el-row>
						<template v-for="cp in priceCalendar">
							<el-row :key="cp.date" style="font-size: 14px;">
								<el-col :span="12">
									{{ cp.date | dateToStr }}
								</el-col>
								<el-col :span="12">
									<div v-if="cp.price===0" style="color: red;">满房
									</div>
									<div v-else style="color: orange;">￥{{ cp.price }}
									</div>
								</el-col>
							</el-row>
						</template>
					</el-row>
				</el-card>
				<el-card style="margin-top: 1rem;" shadow="never">
					<el-row>
						<div style="font-weight: bold;font-size: 20px;">取消规则</div>
						<el-descriptions style="margin-top: 1rem;" :column="1" :colon="false">
							<el-descriptions-item label="规则">{{ roomInfo.cancelPolicyDesc }}</el-descriptions-item>
							<el-descriptions-item label="发票">请联系客服</el-descriptions-item>
						</el-descriptions>
					</el-row>
				</el-card>
				</sticky >
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import {
		GetReserverInfo,
		GetPriceCalender,
		PreOrderCheck
	} from '@/api/hotel/hotel'
	import {
		CreateOrder
	} from '@/api/order/order'
	import moment from 'moment'
	import Sticky from '@/components/Sticky'
	export default {
		components: {
			Sticky
		},
		filters: {
			dateToStr(date) {
				return moment(date).format('YYYY-MM-DD')
			}
		},
		// name: 'Booking',
		data() {
			return {
				Order: {
					hotelCode: 0,
					roomTypeCode: 0,
					roomID: 0,
					ratePlanId:0,
					roomCount: 1,
					orderAmount: 0,
					checkDate: [],
					platformId: 0,
					UserPaymentAmount: undefined
				},
				roomInfo: {},
				priceCalendar: [],
				checkInName: [],
				pickerOptions: {
					disabledDate(date) {
						const startDate = moment().format('YYYYMMDD')
						const currentDate = moment(date).format('YYYYMMDD')
						const endDate = moment()
							.add(21, 'd')
							.format('YYYYMMDD')
						return !(currentDate >= startDate && endDate >= currentDate)
					}
				},
				RoomCheckCode: {
					Success: 0
				},
				disabledSubmit: false,
				roomNight: 1,
				marginTop:90
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				if (this.getUrlParams()) {
					this.fetchReserverInfo()
					this.fetchPriceCalendar()
				}
			},

			getUrlParams() {
				const query = this.$route.query
				const base64 = require('js-base64').Base64
				if (!query || !query.hotelCode || !query.roomTypeCode || !query.roomID || !query.platform || !query
					.checkDate) {
					this.$alert('请返回重试', '预订失败', {
						confirmButtonText: '确定',
						type: 'error',
						callback: action => {
							this.$router.push({
								path: '/hotellist'
							})
						}
					})
					return false
				}

				this.Order.hotelCode = base64.decode(query.hotelCode)
				this.Order.roomTypeCode = base64.decode(query.roomTypeCode)
				this.Order.roomID = base64.decode(query.roomID)
				this.Order.platformId = base64.decode(query.platform)
				this.Order.checkDate = base64.decode(query.checkDate).split(',')
				this.Order.checkInDate = this.Order.checkDate[0]
				this.Order.checkOutDate = this.Order.checkDate[1]

				return true
			},
			fetchReserverInfo() {
				const hotelCode = this.Order.hotelCode
				const roomTypeCode = this.Order.roomTypeCode
				const roomID = this.Order.roomID
				const platform = this.Order.platformId
				GetReserverInfo(hotelCode, roomTypeCode, roomID, platform).then(res => {
					this.roomInfo = res.data
					
				})
			},
			fetchPriceCalendar() {
				GetPriceCalender(this.Order.hotelCode, this.Order.roomTypeCode, this.Order.roomID, this.Order.checkDate[0],
					this.Order.checkDate[1], this.Order.platformId).then(res => {
					this.priceCalendar = res.data
					this.calcTotalAmt()
				})
			},
			calcTotalAmt() {
				if (!this.priceCalendar || this.priceCalendar.length === 0) {
					this.$message.warning('价格日历获取失败')
					return
				}

				let allDayPrice = 0
				const count = this.Order.roomCount
				this.priceCalendar.forEach((item, index, arr) => {
					allDayPrice += item.price
				})
				this.Order.orderAmount = (allDayPrice * count).toFixed(2)
				this.Order.UserPaymentAmount = this.Order.orderAmount
			},
			preOrderCheck() {
				this.disabledSubmit = true
				for (var i = 0; i < this.checkInName.length; i++) {
					// eslint-disable-next-line no-irregular-whitespace
					const reg = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/
					// const reg = /[\u4e00-\u9fa5_a-zA-Z0-9_]+(·[\u4e00-\u9fa5]+)*${1,12}/
					if (!reg.test(this.checkInName[i])) {
						this.$message.error('"入住人"校验不合法')
						this.disabledSubmit = false
						return
					}
				}

				const reg1 =
					/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
				if (!reg1.test(this.Order.checkInPhone)) {
					this.$message.error('手机号校验不合法')
					this.disabledSubmit = false
					return
				}
				if (this.Order.checkInDate === this.Order.checkOutDate) {
					this.$message.error('请选择不同的入离日期')
					this.disabledSubmit = false
					return
				}
				if (this.Order.roomCount !== this.checkInName.length) {
					this.$message.error('请填写入住人')
					this.disabledSubmit = false
					return
				}

				const param = {
					hotelCode: this.Order.hotelCode,
					roomTypeCode: this.Order.roomTypeCode,
					checkInDate: this.Order.checkInDate,
					checkOutDate: this.Order.checkOutDate,
					totalPrice: this.Order.orderAmount,
					roomCount: this.Order.roomCount,
					roomCode: this.Order.roomID,
					platformId: this.Order.platformId
				}
				PreOrderCheck(param).then(res => {
					if (res.data && res.data.code === 0) {
						this.submitOrder()
					} else {
						this.disabledSubmit = false
						this.$message.warning(res.data.msg || res.message)
					}
					// eslint-disable-next-line handle-callback-err
				}).catch(err => {
					this.disabledSubmit = false
				})
			},
			submitOrder() {
				const order = this.Order
				order.personCount = order.roomCount
				order.checkInName = this.checkInName.join()
				order.hotelCode = this.roomInfo.hotelCode
				order.roomPrice = this.roomInfo.salePrice
				order.roomTypeCode = this.roomInfo.roomTypeCode
				order.breakFastNum = this.roomInfo.numberOfBreakfast
				order.roomID = this.roomInfo.roomID
				order.ratePlanId = this.roomInfo.ratePlanId
				order.PriceCalendars = this.priceCalendar

				CreateOrder(order).then(res => {
					this.disabledSubmit = false
					if (res.data) {
						const result = res.data.item1
						if (result) {
							this.$alert('去支付', '预订成功', {
								confirmButtonText: '去支付',
								type: 'info',
								callback: action => {
									if (action === 'cancel') {
										const orderNo = res.data.item2
										this.goOrder(orderNo)
									} else {
										const orderNo = res.data.item2
										this.$store.dispatch('tagsView/delView', this.$route)
										this.toPay(orderNo)
									}
								}
							})
						} else {
							this.$message.error('预订失败')
						}
					} else {
						this.$message.error(res.message)
					}
					// eslint-disable-next-line handle-callback-err
				}).catch(err => {
					this.disabledSubmit = false
				})
			},
			toPay(orderNo) {
				this.$router.push({
					path: '/payment',
					query: {
						orderNo
					}
				})
			},
			goOrder(orderNo) {
				this.$router.push({
					path: `/Order/${orderNo}`,
					query: {
						orderNo
					}
				})
			},
			checkDateChange(val) {
				this.Order.checkDate = val
				this.Order.checkInDate = this.Order.checkDate[0]
				this.Order.checkOutDate = this.Order.checkDate[1]

				this.roomNight = moment(this.Order.checkOutDate).diff(moment(this.Order.checkInDate), 'days')
				if (this.roomNight === 0) {
					this.priceCalendar = []
					this.$message.error('请选择不同的入离日期')
					return
				}

				this.fetchPriceCalendar()
			},
			roomCountChange() {
				
				this.Order.roomCount = Math.round(this.Order.roomCount)
				this.calcTotalAmt()
				if (this.Order.roomCount >= 1) {
					this.checkInName.splice(this.Order.roomCount, 1)
				}
			}

		}
	}
</script>

<style scoped>
	.el-link {
		cursor: default;
	}

	.el-link.el-link--default:hover {
		color: #606266;
	}

	.content-left {
		padding: 0.625rem;
	}

	.content-left .img {
		height: 24rem;
		width: 100%;
		border-radius: 0.2rem;
	}

	.title {
		margin-top: 0rem;
		color: black;
		font-size: x-large;
	}

	.sub-title {
		margin-top: 0rem;
		color: black;
		font-weight: bold;
		font-size: 20px;
	}

	.text {
		margin-top: 1rem;
		font-size: base;
	}

	.border-bottom {
		border-bottom: 0.0625rem solid lightgrey;
	}

	.detail {
		padding-bottom: 1.25rem;
	}

	.detail .el-row {
		font-size: large;
		margin-top: 0.8rem;
	}

	.total-price {
		font-size: x-large;
	}

	.booking {
		padding-bottom: 1rem;
	}


	.right-text {
		font-size: 16px;
	}

	.right-align {
		float: right;
		line-height: 1.6rem;
	}

	.booking .first-row {
		margin-top: 2rem;
	}

	.submit {
		margin-left: 5rem;
		margin-top: 1rem;
	}
</style>
