/* eslint-disable semi */
<template>
	<div ref="content" class="content" style="z-index: 1">
		<el-col :offset="3" :span="17">
			<el-card class="hotel">
				<el-row>
					<span :underline="false" class="hotelName">{{ hotel.hotelName }}</span><span
						class="hotel-type">{{ hotel.typeName }}</span>
				</el-row>
				<el-row>
					<span>酒店电话：</span>
					<span class="hotel-address" :underline="false">{{ hotel.hotelPhone }}
					</span>
				</el-row>
				<el-row>
					<span>酒店地址：</span>
					<span class="hotel-address" :underline="false">{{ hotel.hotelAddress }}
					</span>
				</el-row>
				<!--   <el-row>
          <span>酒店电话：</span>
          <span :underline="false">{{ hotel.hotelPhone }}</span>
        </el-row>
        <el-row class="hotel-service">
          <span>服务保障：</span>
          <i class="el-icon-light-rain"> 热水</i>
          <i class="el-icon-lightning"> 冷水</i>
          <i class="el-icon-heavy-rain"> 温水</i>
          <i class="el-icon-sunrise"> 冰水</i>
          <i class="el-icon-cloudy-and-sunny"> 开水</i>
        </el-row> -->
			</el-card>
		</el-col>
		<el-col :offset="3" :span="17">
			<el-card class="hotelInfo" style="min-width: 660px;height: 400px;">
				<el-row>
					<el-col :span="16" style="position: relative;">
						<el-carousel :interval="5000" arrow="always" style="height: 400px;" :indicator-position="hotelImageTypes.length > 10 ? 'none' : '' ">
							<el-carousel-item v-for="(item,index) in hotelImages[hotelImagesIndex]" :key="index"
								style="background-color: #000000;">
								<div style="display: flex;justify-content: center;">
								<el-image :src="item.imgUrl" fit="contain" > </el-image>
								</div>
							</el-carousel-item>
						</el-carousel>
						<ol class="list-hotel">
							<li v-for="(item,index) in hotelImageTypes" :key="item" @click="changeType(index)"
								:class="hotelImagesIndex == index ? 'activeType' : ''">
								{{item}}({{hotelImages[index].length}})
							</li>
						</ol>
					</el-col>
					<el-col :span="8" v-if="isShowMap">
						<AMap :hotel="currentHotel" style="width: 100%;height: 400px;" />
					</el-col>
				</el-row>
			</el-card>
		</el-col>

		<el-col :offset="3" :span="17">

			<div v-loading="hotelQuotedPricesLoading" element-loading-text="房型加载中"
				element-loading-spinner="el-icon-loading" style="min-height: 60px">
				<el-card v-for="(roomType, index) in RoomTypesList" :key="roomType.roomTypeCode" class="hotelBlock">
					<div
						style="height: 110px;padding: 10px;display: flex;width: 100%;background-color: rgb(250,250,250);border-bottom: 1px solid #eee;">
						<el-image style="width: 150px;height: 90px;" :src="
							    roomType.roomTypeImgs &&
							      roomType.roomTypeImgs.length > 0
							      ? roomType.roomTypeImgs[0].imgUrl
							      : ''
							  " :preview-src-list="
							    roomType.roomTypeImgs &&
							      roomType.roomTypeImgs.length > 0
							      ? roomType.roomTypeImgs.map((v, i, a) => {
							        return v.imgUrl
							      })
							      : []
							  ">
							<div slot="error" style="padding: 25px 0;text-align: center;color: #ccc;font-size: 20px;">
								<div class="el-icon-picture-outline"></div>
								<div style="font-size: 14px;margin-top: 5px;">暂无图片</div>
							</div>
						</el-image>
						<div style="width: 100%;padding-left: 20px;">
							<div style="display: flex;justify-content: space-between;">
								<div>
									<span style="
										    color: #001528;
										    font-size: large;
										    font-weight: bold;
										    cursor: default;
										  ">{{ roomType.roomTypeName }}
									</span>
								</div>
								<div>

								</div>
							</div>
							<div style="margin: 10px 0;font-size: 14px;">
									面积：{{ roomType.area }}m² <span style="margin: 0 5px;">|</span> 网络：{{ roomType.netDesc }}
									<span style="margin: 0 5px;">|</span> 窗户：{{ roomType.windowDesc }}
									<span style="margin: 0 5px;">|</span> 床型：
									<span v-if="roomType.numberOfBeds">{{ roomType.bedTypeName }}
										{{ roomType.numberOfBeds }}张</span><span v-if="roomType.bedWidth">
										{{ roomType.bedWidth }}米</span>
									</span>
							</div>
							<div style="display: flex;justify-content: space-between; ">
								<div>
								<el-link class="details" @click="roomdetails(roomType)">详情</el-link>
									
								</div>
								<div @click="changeFold(roomType)" style="color: #169bd5;cursor: pointer;font-size: 14px;">
									<span v-if="roomType.isFold"> 收起<i class="el-icon-caret-top"
											style="margin-left: 5px;"></i></span>
									<span v-else>更多<i class="el-icon-caret-bottom" style="margin-left: 5px;"></i></span>
								</div>
							</div>
						</div>
					</div>
					<div v-show="roomType.isFold" class="priceTable">
						<el-table :data="RoomQuotedPriceList.filter((x) => {
					        return x.roomTypeCode == roomType.roomTypeCode
					      })" style="width: 100%;font-size: 14px;" header-cell-class-name="headerTh">
							<el-table-column prop="bedTypeName" label="床型">
							</el-table-column>
							<el-table-column prop="breakfastDesc" label="早餐">
							</el-table-column>
							<el-table-column prop="liveInCount" label="入住人数">
							</el-table-column>
							<el-table-column prop="isCancel" label="政策">
								<template slot-scope="scope">
									<div v-if="scope.row.cancelLimitTime">
										<el-popover placement="bottom" trigger="hover">
												【{{scope.row.cancelLimitTime}}】前可免费取消，若未入住或过时取消将收取您的房费。
									
										  <span slot="reference" style="border-bottom: 1px dashed #888;">{{ scope.row.isCancel }}</span>
										</el-popover>
									</div>
									<div v-else>
										  {{ scope.row.isCancel }}
									</div>
								</template>
								
							</el-table-column>
							<el-table-column prop="salePrice" label="是否立即确认">
								<template slot-scope="scope">
									{{ scope.row.salePrice?'立即确认':'非立即确认' }}
								</template>
							</el-table-column>
							<el-table-column prop="price" label="房价" >
								<template slot-scope="scope">
									<div style="font-size: medium; color: #ff714a;text-align: left;width: 100%;">
										￥{{ scope.row.salePrice }}</div>
								</template>
							</el-table-column>
							<el-table-column prop="platform" label="平台" >
								<template slot-scope="scope">
									<el-tag v-if="scope.row.platform == 4" >精选</el-tag><!-- 艺龙分销 -->
									<el-tag v-else-if="scope.row.platform == 9" type="warning">优选</el-tag><!-- 携程分销 -->
									<!-- <el-tag v-else-if="scope.row.platform == " >惠选</el-tag>--><!-- 美团分销 --> 
									<!-- <el-tag v-else-if="scope.row.platform == " >严选</el-tag> --><!-- 飞猪分销 -->
									<el-tag v-else>未知</el-tag>
								</template>
							</el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button v-permission="['Booking']" type="primary" class="buttonstyle" size="mini"
										@click="goBooking(hotel.hotelCode, scope.row.roomTypeCode,scope.row.roomID,scope.row.platform)">
										预订</el-button>
								</template>
							</el-table-column>
						</el-table>
						<div v-if="hotel.roomQuotedPrices.filter((x) => {
                        return x.roomTypeCode == roomType.roomTypeCode
                      }).length>4" style="text-align: center;width: 100%;padding: 10px 0;" >
							
							<el-link  class="lookmore"  @click="changeFoldState2(roomType)" >
												
								<span v-if="roomType.ismore"> 收起<i class="el-icon-arrow-up"
										style="margin-left: 5px;"></i></span>
								<span v-else>查看更多<i class="el-icon-arrow-down" style="margin-left: 5px;"></i></span>
							</el-link>
						</div>
					</div>
				</el-card>
				<el-card style="text-align: center;margin-bottom: 20px;"
					v-if="hotel.roomTypes&&hotel.roomTypes.length>10">
					<el-link class="lookmore" @click="changeFoldState">
						<span v-if="showDisplay"> 收起<i class="el-icon-arrow-up" style="margin-left: 5px;"></i></span>
						<span v-else>查看更多<i class="el-icon-arrow-down" style="margin-left: 5px;"></i></span>
					</el-link>
				</el-card>
			</div>

			<!-- <el-card v-loading="hotelQuotedPricesLoading" element-loading-text="房型加载中"
				element-loading-spinner="el-icon-loading" style="min-height: 60px">
				<div v-for="(roomType, index) in RoomTypesList" :key="roomType.roomTypeCode" class="roomType">
					<transition name="el-zoom-in-center">
						<el-row>
							<el-col :xs="{ offset: 0 }">
								<el-col :span="24">
									<span style="
                      color: #001528;
                      font-size: large;
                      font-weight: bold;
                      height: 50px;
                      line-height: 50px;
                      cursor: default;
                    " :class="{ 'roomtype-name': index }">{{ roomType.roomTypeName }}
									</span>
								</el-col>
								<el-col :xl="4" :lg="6" :md="7" :sm="8" :xs="8">
									<div class="img_div">
										<a>
											<el-image class="item-img" :src="
                          roomType.roomTypeImgs &&
                            roomType.roomTypeImgs.length > 0
                            ? roomType.roomTypeImgs[0].imgUrl
                            : ''
                        " :preview-src-list="
                          roomType.roomTypeImgs &&
                            roomType.roomTypeImgs.length > 0
                            ? roomType.roomTypeImgs.map((v, i, a) => {
                              return v.imgUrl
                            })
                            : []
                        ">
												<div slot="error" style="
                            height: 100%;
                            background-color: #f5f7fa;
                            color: #c0c4cc;
                            padding-left: 33%;
                            padding-top: 25%;
                          ">
													<i class="el-icon-picture-outline" />
													<i>暂无图片</i>
												</div>
											</el-image>
											<div class="mask">
												<el-col>
													<el-row class="devices">
														<el-col :span="10">
															<span
																class="device">面积&nbsp&nbsp{{ roomType.area }}m²</span>
														</el-col>
														<el-col :span="14">
															<span
																class="device">网络&nbsp&nbsp{{ roomType.netDesc }}</span>
														</el-col>
													</el-row>

													<el-row class="devices">
														<el-col :span="10">
															<span
																class="device">窗户&nbsp&nbsp{{ roomType.windowDesc }}</span>
														</el-col>
												
														<el-col :span="14">
															<span class="device">床型&nbsp&nbsp
																<span
																	v-if="roomType.numberOfBeds">{{ roomType.numberOfBeds }}张</span><span
																	v-if="roomType.bedWidth">{{ roomType.bedWidth }}米</span>{{ roomType.bedTypeName }}
															</span>
														</el-col>
													</el-row>
												</el-col>
											</div>
										</a>
									</div>
									<el-link class="details" @click="roomdetails(roomType)">详情</el-link>
								</el-col>
								<template>
									<el-col :xl="{ span: 15, offset: 3 }" :lg="{ span: 15, offset: 2 }" :md="24"
										:sm="24" :xs="24" style="text-align: center">

										<el-row v-for="roomInfo in RoomQuotedPriceList.filter((x) => {
                        return x.roomTypeCode == roomType.roomTypeCode
                      })" :key="roomInfo.roomID" style="font-size: small; height: 30%" class="plan">
											<el-col :xl="3" :lg="2" :md="4" :sm="4" :xs="4" class="roominfo">
												{{ roomInfo.bedTypeName }}
											</el-col>
											<el-col :xl="3" :lg="3" :md="4" :sm="4" :xs="4" class="roominfo">
												{{ roomInfo.breakfastDesc }}
											</el-col>
											<el-col :xl="2" :lg="2" :md="3" :sm="3" :xs="3" class="roominfo">
												{{ roomInfo.liveInCount }}
											</el-col>
											<el-col :xl="4" :lg="3" :md="3" :sm="3" :xs="3" class="roominfo">
												{{ roomInfo.isCancel }}
											</el-col>
											<el-col :xl="3" :lg="3" :md="5" :sm="4" :xs="4" class="roominfo">
												{{ roomInfo.salePrice?'立即确认':'非立即确认' }}
											</el-col>
											<el-col :xl="4" :lg="4" :md="5" :sm="4" :xs="4" class="price"><span
													style="font-size: medium; color: #ff714a">￥</span>{{ roomInfo.salePrice }}
											</el-col>
											<el-col :xl="4" :lg="4" :md="3" :sm="5" :xs="6" class="roominfo">
												<el-button v-permission="['Booking']" type="primary" class="buttonstyle"
													@click="
                            goBooking(
                              hotel.hotelCode,
                              roomInfo.roomTypeCode,
                              roomInfo.roomID,
                              roomInfo.platform
                            )
                          ">预订</el-button>
											</el-col>
										</el-row>
										<el-link v-if="hotel.roomQuotedPrices.filter((x) => {
                        return x.roomTypeCode == roomType.roomTypeCode
                      }).length>4" class="lookmore" @click="changeFoldState2(roomType)">
											<span>{{ roomType.ismore?'&lt&lt            收起            &gt&gt':'&lt&lt                                                                                                 查看更多            &gt&gt' }}</span>
										</el-link>
									</el-col>
								</template>
							</el-col>
						</el-row>
					</transition>
				</div>
				<el-link v-if="hotel.roomTypes&&hotel.roomTypes.length>10" class="lookmore" @click="changeFoldState">
					<span>{{ showDisplay?'&lt&lt            收起            &gt&gt':'&lt&lt                                                                                                 查看更多            &gt&gt' }}</span>
				</el-link>
			</el-card> -->
		</el-col>

		<el-col :offset="3" :span="17">
			<el-card class="hotel-info">
				<el-col>
					<!-- <div slot="header">
            <span>酒店信息<el-link type="info" class="aptitude">（资质）</el-link></span>
          </div> -->
					<el-row>
						<!-- <el-col :span="1">酒店信息</el-col> -->
						<el-col :span="18" style="letter-spacing: 2px"><span
								style="font-size: inherit">酒店信息</span></el-col>
					</el-row>
					<el-divider />
					<el-row>
						<!-- <el-col :span="1"></el-col> -->
						<el-col :span="18"><span v-if="hotel.decorateDate"
								style="letter-spacing: 2px">{{ dateToYMD(hotel.decorateDate) }}年装修</span>
							<span style="letter-spacing: 2px">
								{{ dateToYMD(hotel.openDate) }}年开业</span>
						</el-col>
					</el-row>
					<!-- <el-divider /> -->
					<el-row>
						<el-col :span="1"><br></el-col>
						<el-col :span="20"><span style="letter-spacing: 1.5px" class="hotel-desc" v-html="hotel.desc" />
						</el-col>
					</el-row>
				</el-col>
			</el-card>
		</el-col>

		<el-dialog :visible.sync="amapVisiable" title="酒店位置" width="55rem">
			<AMap :hotel="hotel" />
		</el-dialog>

		<el-dialog :visible.sync="roomVisiable" :close-on-click-modal="false" label-position="right" :inline="true"
			width="48rem">
			<div slot="title">
				<span style="font-size: 22px; margin-right: 3rem">{{
          detailsroom.roomTypeName
        }}</span>
			</div>
			<el-row>
				<el-col :span="9">
					<div class="img_div">
						<a>
							<el-image class="item-img" :src="
                  detailsroom.roomTypeImgs &&
                    detailsroom.roomTypeImgs.length > 0
                    ? detailsroom.roomTypeImgs[0].imgUrl
                    : ''
                " :preview-src-list="
                  detailsroom.roomTypeImgs &&
                    detailsroom.roomTypeImgs.length > 0
                    ? detailsroom.roomTypeImgs.map((v, i, a) => {
                      return v.imgUrl
                    })
                    : []
                ">
								<div slot="error" style="
                    height: 100%;
                    background-color: #f5f7fa;
                    color: #c0c4cc;
                    padding-left: 45%;
                    padding-top: 20%;
                  ">
									<i class="el-icon-picture-outline" />
								</div>
							</el-image>
							<div class="img">共{{ roomlength }}张</div>
						</a>
					</div>
				</el-col>
				<el-col :span="15">
					<el-row>
						<el-col :span="24">
							<span>面积:&nbsp&nbsp</span>
							<span>{{ detailsroom.area }}m²</span>
						</el-col>
						<!-- <el-col :xl="3" :sm="4">
              <span>卫浴</span>
              <el-link>{{ detailsroom.tolietDesc === '未知'?'-':detailsroom.tolietDesc }}</el-link>
            </el-col> -->
						<el-col :span="24">
							<span>窗户:&nbsp&nbsp</span>
							<span>{{ detailsroom.windowDesc }}</span>
						</el-col>
						<el-col :span="24">
							<span>可住:&nbsp&nbsp</span>
							<span>{{ detailsroom.liveInCount }}</span>
						</el-col>
						<el-col :span="24">
							<span>网络:&nbsp&nbsp</span>
							<span>{{ detailsroom.netDesc }}</span>
						</el-col>
						<el-col :span="24">
							<span>床型:&nbsp&nbsp</span>
							<span v-if="detailsroom.numberOfBeds">{{ detailsroom.numberOfBeds }}张</span><span
								v-if="detailsroom.bedWidth">{{ detailsroom.bedWidth }}米{{ detailsroom.bedTypeName }}
							</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="24">
					<el-divider />
				</el-col>
			</el-row>
			<el-row>
				<h4>所有房型设施</h4>
				<el-col :span="24">
					<el-col v-for="(
              roomdetail, index
            ) in detailsroom.roomTypeRelevantFacilities" :key="'index1' + index" :span="4">
						<span> {{ roomdetail.facilitylName }}</span>
					</el-col>
				</el-col>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import moment from 'moment'
	import Sticky from '@/components/Sticky'
	import AMap from '@/components/Amap'
	import {
		GetHotel,
		GetHotelQuotedPrices
	} from '@/api/hotel/hotel'
	// eslint-disable-next-line no-unused-vars
	import {
		deepClone
	} from '@/utils/index'
	import permission from '@/directive/permission'

	export default {
		components: {
			AMap,
			Sticky
		},
		computed: {
			...mapGetters(['sidebar']),
			RoomTypesList() {
				// 当数据不需要完全显示的时候
				if (this.showDisplay == false) {
					
					let testList = [] // 定义一个空数组
					if (this.hotel.roomTypes && this.hotel.roomTypes.length > 10) {
						if (this.hotel.roomQuotedPrices && this.hotel.roomQuotedPrices.length > 0) {
							for (var i = 0; i < 10; i++) {
								testList.push(this.hotel.roomTypes[i])
							}
						} else {
							testList = ''
						}
					} else {
						testList = this.hotel.roomTypes
					}

					return testList // 返回当前数组
				} else {
					return this.hotel.roomTypes
				}
			},
			RoomQuotedPriceList() {
				// 所有价格只显示四条
				// if(this.showDisplay2 == false){
				const testList = [] // 定义一个空数组
				if (this.hotel.roomQuotedPrices && this.hotel.roomQuotedPrices.length > 0) {
					this.hotel.roomTypes.forEach((element, index) => {
						this.hotel.roomQuotedPrices.filter((item, indey) => {
							return item.roomTypeCode == element.roomTypeCode
						}).splice(0, 4).forEach((x) => {
							testList.push(x)
						})
					})
				}
				return testList // 返回当前数组
				//    }else{
				//   return this.hotel.roomQuotedPrices;
				//  }
			}          
		},
		directives: {
			permission
		},
		data() {
			return {
				hotel: {
					roomTypes: []
				},
				hotelQuotedPrices: '',
				showDisplay: false,
				showDisplay2: false,
				roomlength: '',
				detailsroom: {},
				roomVisiable: false,
				currentHotel: {},
				amapVisiable: false,
				hotelQuotedPricesLoading: false,
				marginTop: 80,
				hotelImages: [],
				hotelImageTypes: [],
				hotelImagesIndex: 0,
				isShowMap: false
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				if (this.getUrlParams()) {
					this.fetchHotel()
					this.fetchHotelQuotedPrices()
				}
			},
			changeFoldState() {
				this.showDisplay = !this.showDisplay
			},
			changeFoldState2(roomType) {
				let Price = []
				// 通过当前房型获取价格后2位
				roomType.ismore = !roomType.ismore
				if (roomType.ismore) {
					// Price 是四位以后的价格
					Price = this.hotel.roomQuotedPrices.filter((item, index) => {
						// console.log(item.roomTypeCode = roomType.roomTypeCode);
						return item.roomTypeCode == roomType.roomTypeCode
					}).splice(4)
					// 通过匹配Code 添加后两位的数据
					this.RoomQuotedPriceList.push.apply(this.RoomQuotedPriceList, Price)
				} else {
					let Price = []
					Price = this.hotel.roomQuotedPrices.filter((item, index) => {
						return item.roomTypeCode == roomType.roomTypeCode
					}).splice(4)
					const PriceRoomID = Price.map(item => {
						return item.roomID
					})
					this.RoomQuotedPriceList.forEach((element, index) => {
						PriceRoomID.forEach((y, indey) => {
							const length = PriceRoomID.length
							if (y == element.roomID) {
								// 删除当前相同ID的索引以及长度
								this.RoomQuotedPriceList.splice(index, length)
							}
						})
					})
				}
			},
			roomdetails(room) {
				this.detailsroom = room
				this.roomlength = this.detailsroom.roomTypeImgs.length
				this.roomVisiable = true
			},
			getUrlParams() {
				const query = this.$route.query
				//  console.log(query.hotelCode,query.checkInDate,query.checkOutDate)
				if (!query || !query.hotelCode || !query.checkInDate || !query.checkOutDate) {
					this.$alert('请返回重试', '酒店查询失败', {
						confirmButtonText: '确定',
						type: 'error',
						callback: (action) => {
							this.$router.push({
								path: '/hotellist'
							})
						}
					})
					return false
				}
				this.hotel.hotelCode = query.hotelCode
				this.hotel.checkInDate = query.checkInDate
				this.hotel.checkOutDate = query.checkOutDate
				return true
			},
			showAmap(hotel) {
				this.currentHotel = hotel
				hotel.longitude = this.currentHotel.autoNaviCoordinate.split(',')[0]
				hotel.latitude = this.currentHotel.autoNaviCoordinate.split(',')[1]
				this.amapVisiable = true
			},
			showAmap1(hotel) {
				this.currentHotel = hotel
				hotel.longitude = this.currentHotel.autoNaviCoordinate.split(',')[0]
				hotel.latitude = this.currentHotel.autoNaviCoordinate.split(',')[1]
				this.amapVisiable = true
			},
			fetchHotel() {
				const hotelCode = this.hotel.hotelCode
				GetHotel({
					hotelCode
				}).then((res) => {
					this.hotel = res.data
					
					let hotelImageTypes = ["全部"]
					res.data.images.map((ele, index, arr) => {
						if (hotelImageTypes.indexOf(ele.imgType) < 0) hotelImageTypes.push(ele.imgType)
					})
					let hotelImages = [res.data.images]
					this.hotelImageTypes = hotelImageTypes
					res.data.images.map((ele, index, arr) => {
						if (!(hotelImages[hotelImageTypes.indexOf(ele.imgType)] && hotelImages[
								hotelImageTypes.indexOf(ele.imgType)].length > 0)) {
							hotelImages[hotelImageTypes.indexOf(ele.imgType)] = []
						}
						hotelImages[hotelImageTypes.indexOf(ele.imgType)].push(ele)
					})
					this.hotelImages = hotelImages
					this.currentHotel = res.data
					this.currentHotel.longitude = this.currentHotel.autoNaviCoordinate.split(',')[0]
					this.currentHotel.latitude = this.currentHotel.autoNaviCoordinate.split(',')[1]
					this.isShowMap = true
				})

			},
			fetchHotelQuotedPrices() {
				this.hotelQuotedPricesLoading = true
				const hotelCode = this.hotel.hotelCode
				const checkInDate = this.hotel.checkInDate
				const checkOutDate = this.hotel.checkOutDate
				GetHotelQuotedPrices({
						hotelCode,
						checkInDate,
						checkOutDate
					}).then((res) => {
						const arr = []
						res.data.roomTypes.forEach((element, index) => {
							const ismore = false
							const isFold = true
							element = {
								...element,
								ismore,
								isFold,
							}
							const item = res.data.roomQuotedPrices.find(item => item.roomTypeCode ==
								element.roomTypeCode)
							if (item) {
								arr.unshift(element)
							} else {
								arr.push(element)
							}
						})
						res.data.roomTypes = arr
						this.hotel = {
							...this.hotel,
							...res.data
						}
						this.hotel.roomQuotedPrices.forEach((item) => {
							if (item.breakfastDesc === '不含早') {
								item.breakfastDesc = '无早'
							}
							if (item.breakfastDesc === '含单早') {
								item.breakfastDesc = '单早'
							}
							if (item.breakfastDesc === '含双早') {
								item.breakfastDesc = '双早'
							}
							if (item.breakfastDesc === '含多早（3份）') {
								item.breakfastDesc = '三早'
							}
							if (item.breakfastDesc === '含多早（4份）') {
								item.breakfastDesc = '四早'
							}
							if (item.breakfastDesc === '含多早（5份）') {
								item.breakfastDesc = '五早'
							}
						})
						this.hotelQuotedPricesLoading = false
						
							let roomTypes = this.hotel.roomTypes.filter(item => {
								return (this.RoomQuotedPriceList.filter((x) => {
									return x.roomTypeCode == item.roomTypeCode
								}).length > 0)
							})
							this.hotel.roomTypes = roomTypes
					})
					// eslint-disable-next-line handle-callback-err
					.catch((err) => {
						console.log(err)
						this.hotelQuotedPricesLoading = false
					})
			},
			caleMarginTopHeight() {
				this.$nextTick(() => {
					this.marginTop = this.$refs['content'].getBoundingClientRect().top
				})
			},
			dateToYMD(val) {
				if (val) {
					return moment(val).format('YYYY年MM月')
				}
			},
			goBooking(hotelCode, roomTypeCode, roomID, platform) {
			  
	            platform= platform.toString()
			 
				const base64 = require('js-base64').Base64
				const startDate = moment().format('YYYY-MM-DD')
				const endDate = moment().add(1, 'd').format('YYYY-MM-DD')
				const checkDate = [startDate, endDate]
				this.$router.push({
					path: '/booking',
					query: {
						hotelCode: base64.encode(hotelCode),
						roomTypeCode: base64.encode(roomTypeCode),
						checkDate: base64.encode(checkDate),
						roomID: base64.encode(roomID),
						platform: base64.encode(platform)
					}
				})
			},
			changeType(index) {
				this.hotelImagesIndex = index
			},
			changeFold(roomType){
				roomType.isFold = !roomType.isFold
			}
		}
	}
</script>

<style scoped>
	.content {
		padding: 5px;
		padding-top: 0;
	}

	.hotel .hotelName {
		color: #001528;
		font-size: x-large;
	}

	.hotel .el-row {
		margin-bottom: 15px;
	}

	.hotel span {
		margin-left: 0.32rem;
		font-size: small;
	}

	.hotel-service i {
		font-size: small;
		margin-left: 0.625rem;
	}

	.img_div {
		position: relative;
		width: 13.5rem;
		height: 8.5rem;
		border-radius: 0.3rem;
		overflow: hidden;
	}

	.item-img {
		width: 13.5rem;
		height: 8.5rem;
		border-radius: 0.3rem;
	}

	.mask {
		position: absolute;
		/* bottom: 0; */
		border-radius: 5px;
		width: 13.5rem;
		height: 3.5rem;
		background: rgba(0, 0, 0, 0.5);
		color: #ffffff;
		opacity: 0;
		transition: all 0.25s ease-in-out;
		-webkit-transition: all 0.25s ease-in-out;
		-moz-transition: all 0.25s ease-in-out;
		transition: all 0.25s ease-in-out;
	}

	.imglength {
		/* position: absolute; */
		/* top: ;
    left: 0;
    bottom: 0; */
		position: absolute;
		bottom: 0;
		right: 0;
		width: 2.5rem;
		text-align: center;
		height: 1rem;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		font-size: 12px;
		transition: all 0.25s ease-in-out;
	}

	.img {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 2.5rem;
		text-align: center;
		height: 1rem;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		font-size: 12px;
	}

	.mask h3 {
		text-align: center;
	}

	.img_div a:hover .mask {
		opacity: 1;
		transform: translateY(-3.5rem);
	}

	.img_div a:hover .imglength {
		transform: translateY(-3.3rem);
	}

	.roomtype-name {
		color: #001528;
		font-size: large;
		font-weight: bold;
		height: 50px;
		line-height: 50px;
		width: 100%;
		display: block;
		border-top: 4px solid #f2f2f2;
		margin-right: 3rem;
	}

	.device {
		color: #ffffff;
		font-size: 12px;
		font-style: normal;
		font-family: '微软雅黑', sans-serif;
		font-weight: 400;
	}

	.devices {
		cursor: default;
		margin-top: 12px;
		margin-left: 2px;
		font-size: 12px;
		color: #ffffff;
		font-family: '微软雅黑', sans-serif;
		font-style: normal;
		font-weight: 400;
	}

	.devices .el-row {
		margin-bottom: 10px;
	}

	.device {
		cursor: default;
		margin-left: 0.3125rem;
	}

	.roomType {
		margin-bottom: 20px;
		padding: 20px;
	}

	.plan {
		/* margin-top: 1rem;
    margin-left: 11%;  */
		height: 40px;
		line-height: 40px;
		font-size: medium;
	}

	.price {
		font-size: 20px;
		font-weight: 400;
		line-height: 45px;
		color: #ff714a;
		border-bottom: 1px solid #dee3ec;
	}

	.roominfo {
		line-height: 45px;
		border-bottom: 1px solid #dee3ec;
		cursor: default;
	}

	.hotel-info .el-row {
		font-size: small;
		margin-bottom: 15px;
	}

	.aptitude {
		margin-left: 5px;
		letter-spacing: 2px;
	}

	.hotel-desc {
		font-size: small;
		letter-spacing: 2px;
	}

	.titlestyle {
		height: 40px;
		line-height: 40px;
		background: #eeeeee;
		text-align: center;
		font-weight: bold;
		font-size: small;
	}

	.buttonstyle {
		background: #ff714a;
		border: 0;
	}

	.isFixed {
		position: fixed;
		/* top: 86px; */
		z-index: 1;
	}

	.details {
		color: #169bd5;
		margin-top: 0;
	}

	.el-card {
		transition: none;
	}

	.el-loading-spinner {
		top: 100% !important;
	}

	.CTitle-Content {
		flex: 0 0 60%;
		order: 1;
		font-size: 15px;
	}

	.lookmore {
		font-size: 16px;

	}

	.hotelInfo>>>.el-card__body {
		padding: 0;
	}

	.hotelInfo>>>.el-carousel__container {
		height: 100%;
	}

	.hotelInfo>>>.el-carousel__indicators--horizontal {
		bottom: 45px;
		width: 80%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.hotelInfo>>>.el-carousel__button {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.list-hotel {
		display: flex;
		padding: 0;
		margin: 0;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 2;
		background-color: rgba(0, 0, 0, .3);
		width: 100%;
		color: #fff;
		font-size: 12px;
		list-style: none;
		flex-wrap: wrap;
		padding: 8px 0;
	}

	.list-hotel li {
		padding: 0 10px;
		margin: 6px 0;
		cursor: pointer;
	}

	.list-hotel li {
		border-right: 1px solid #fff;
	}
	
	 .list-hotel li:nth-last-child(1){
		 border: none;
	 }

	.list-hotel .activeType {
		color: #169bd5;
	}

	.hotelBlock {
		margin: 10px 0;
	}

	.hotelBlock:hover {
		border: 1px solid #169bd5;
	}	

	.hotelBlock:hover {}

	.hotelBlock>>>.el-card__body {
		padding: 0;
	}

	.hotelBlock>>>.el-table__cell {
		padding: 5px 0;
		text-align: center !important;
		border-color: #eee;
	}
	
	.priceTable>>>.el-table th > .cell{
		color: #444 !important;
	}
	.priceTable>>>.el-table__cell{
		background-color: #fff;
	}
	.priceTable>>>.cell{
		text-align: left !important;
	}
	.priceTable .headerTh{
		background-color: #ccc !important;	
	}

</style>
