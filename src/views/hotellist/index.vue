<template>
	<div class="app-container">
		<el-col :offset="3" :span="17">
			<el-card>
				<el-row :gutter="22">
					<el-col :xl="5" :lg="11" :sm="11">
						<el-popover v-model="cityVisiable" placement="bottom-start" trigger="click"
							:popper-options="{ closeOnClickOutside: true }" :open-delay="300">
							<div class="city-box">
								<el-tabs v-model="currentCityTab" :stretch="true" style="width: 50rem">
									<el-tab-pane label="热门" name="hot">
										<el-col v-for="city in hotCities" :key="city.cityId" :span="2">
											<el-link class="city-item" @click="cityItemClick(city)">{{
                        city.cityName
                      }}</el-link>
										</el-col>
									</el-tab-pane>
									<el-tab-pane :label="allCities.group1.title" name="first" :lazy="true">
										<template v-for="(city, index) in allCities.group1.cities">
											<template v-if="
                          isShowCityLetter(city, allCities.group1.cities, index)
                        ">
												<el-col :key="'split' + city.pinyin.charAt(0).toUpperCase()" :span="24"
													style="height: 1rem" />
												<el-col :key="city.pinyin.charAt(0).toUpperCase()" :span="2">
													<el-tag size="small">{{
                            city.pinyin.charAt(0).toUpperCase()
                          }}</el-tag>
												</el-col>
											</template>
											<el-col :key="city.cityId" :span="2">
												<el-link class="city-item" @click="cityItemClick(city)"
													{{ city.cityName }}</el-link>
											</el-col>
										</template>
									</el-tab-pane>
									<el-tab-pane :label="allCities.group2.title" name="second">
										<template v-for="(city, index) in allCities.group2.cities">
											<template v-if="
                          isShowCityLetter(city, allCities.group2.cities, index)
                        ">
												<el-col :key="'split' + city.pinyin.charAt(0).toUpperCase()" :span="24"
													style="height: 1rem" />
												<el-col :key="city.pinyin.charAt(0).toUpperCase()" :span="2">
													<el-tag size="small">{{
                            city.pinyin.charAt(0).toUpperCase()
                          }}</el-tag>
												</el-col>
											</template>
											<el-col :key="city.cityId" :span="2">
												<el-link class="city-item" @click="cityItemClick(city)">
													{{ city.cityName }}
												</el-link>
											</el-col>
										</template>
									</el-tab-pane>
									<el-tab-pane :label="allCities.group3.title" name="third">
										<template v-for="(city, index) in allCities.group3.cities">
											<template v-if="
                          isShowCityLetter(city, allCities.group3.cities, index)
                        ">
												<el-col :key="'split' + city.pinyin.charAt(0).toUpperCase()" :span="24"
													style="height: 1rem" />
												<el-col :key="city.pinyin.charAt(0).toUpperCase()" :span="2">
													<el-tag size="small">{{
                            city.pinyin.charAt(0).toUpperCase()
                          }}</el-tag>
												</el-col>
											</template>
											<el-col :key="city.cityId" :span="2">
												<el-link class="city-item" @click="cityItemClick(city)">
													{{ city.cityName }}
												</el-link>
											</el-col>
										</template>
									</el-tab-pane>
									<el-tab-pane :label="allCities.group4.title" name="four">
										<template v-for="(city, index) in allCities.group4.cities">
											<template v-if="
                          isShowCityLetter(city, allCities.group4.cities, index)
                        ">
												<el-col :key="'split' + city.pinyin.charAt(0).toUpperCase()" :span="24"
													style="height: 1rem" />
												<el-col :key="city.pinyin.charAt(0).toUpperCase()" :span="2">
													<el-tag size="small">{{
                            city.pinyin.charAt(0).toUpperCase()
                          }}</el-tag>
												</el-col>
											</template>
											<el-col :key="city.cityId" :span="2">
												<el-link class="city-item" @click="cityItemClick(city)">
													{{ city.cityName }}
												</el-link>
											</el-col>
										</template>
									</el-tab-pane>
									<el-tab-pane :label="allCities.group5.title" name="five">
										<template v-for="(city, index) in allCities.group5.cities">
											<template v-if="
                          isShowCityLetter(city, allCities.group5.cities, index)
                        ">
												<el-col :key="'split' + city.pinyin.charAt(0).toUpperCase()" :span="24"
													style="height: 1rem" />
												<el-col :key="city.pinyin.charAt(0).toUpperCase()" :span="2">
													<el-tag size="small">{{
                            city.pinyin.charAt(0).toUpperCase()
                          }}</el-tag>
												</el-col>
											</template>
											<el-col :key="city.cityId" :span="2">
												<el-link class="city-item" @click="cityItemClick(city)">
													{{ city.cityName }}
												</el-link>
											</el-col>
										</template>
									</el-tab-pane>
								</el-tabs>
							</div>
							<el-autocomplete slot="reference" v-model="SearchCondition.CityName"
								:trigger-on-focus="false" :fetch-suggestions="citySearch" value-key="cityName"
								placeholder="入住城市" @select="citySearchClick" clearable style="margin-bottom: 12px">
								<template slot="prepend">入住城市</template>
							</el-autocomplete>
						</el-popover>
					</el-col>
					<el-col :xl="8" :lg="11" :sm="10" class="date" style="margin-bottom: 12px">
						<div class="el-input el-input-group el-input-group--prepend">
							<div class="el-input-group__prepend">入离日期</div>
							<el-date-picker v-model="SearchCondition.CheckInDate" :picker-options="pickerOptions"
								type="daterange" :clearable="false" :editable="false" value-format="yyyy-MM-dd"
								start-placeholder="入住" end-placeholder="离店" @change="checkDateChange" />
						</div>
					</el-col>
					<el-col :xl="7" :lg="10" :sm="16">
						<el-autocomplete v-model="hotelSuggest" :trigger-on-focus="false"
							:fetch-suggestions="hotelSuggestSearch" value-key="hotelName" placeholder="(关键词)酒店名/位置"
							clearable @select="suggestClick" clearable style="margin-bottom: 12px">
							<template slot="prepend" style="width: 20px">关键词</template>
						</el-autocomplete>
					</el-col>
					<el-col :offset="1" :xl="1" :lg="1" :sm="1">
						<el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search"
							@click="searchKeyword">搜索</el-button>
					</el-col>
				</el-row>
			</el-card>
		</el-col>
		<el-col :offset="3" :span="17">
			<el-collapse value="">
				<el-collapse-item name="search">
					<span slot="title" class="collapse-title">酒店搜索</span>
					<!-- <template slot="title">
          酒店搜索&nbsp;&nbsp;&nbsp; <el-tooltip class="item" effect="dark" content="搜索关键词" placement="right"><i class="header-icon el-icon-info" /></el-tooltip>
        </template> -->
					<div class="filter-container">
						<el-card>
							<el-form ref="searchForm" :inline="true" :model="SearchCondition" label-position="top">
								<el-row>
									<el-col :xl="1" :sm="2" style="padding-top: 0.6rem">
										<el-link :underline="false">位置</el-link>
									</el-col>
									<el-col :xl="2" :sm="2" style="padding-top: 0.6rem">
										<el-tag effect="plain" :type="PositionType === 0 ? 'primary' : 'info'"
											@click="defaultPosition()">
											不限
										</el-tag>
									</el-col>
									<el-col :xl="20" :sm="16">
										<el-tabs v-model="tab" class="position" @tab-click="positionTabClick">
											<el-tab-pane name="hot" :lazy="true">
												<span slot="label">热门</span>
												<template v-for="uni in districtElse.filter((item, index) => {
                            return item.typeId === districtElseEnum.HOT
                          })">
													<el-col :xl="4" :sm="6" :key="">
														<el-link :key="uni.id" :underline="false" :style="[
                                { 'line-height': '1rem' },
                                {
                                  color:
                                    SearchCondition.HotId === uni.id
                                      ? '#0A55A3'
                                      : '',
                                },
                              ]" @click="districtItemClick(uni.typeId, uni)">{{ uni.name }}
														</el-link>
													</el-col>
												</template>
											</el-tab-pane>
											<el-tab-pane name="bizarea" :lazy="true">
												<span slot="label">行政区/商圈</span>
												<!-- <template v-for="bizArea in bizAreas.filter((item,index)=>{ return !item.parentId })">
                        <el-link :key="bizArea.id" style="margin-right: 0.5rem;line-height: 1.875rem;">{{ bizArea.areaName }}</el-link>
                      </template> -->
												<el-tabs :stretch="true">
													<template v-for="cityDistrict in cityDistricts">
														<el-tab-pane :key="cityDistrict.id">
															<span slot="label" @click="
                                  districtItemClick(
                                    districtElseEnum.BIZAREA,
                                    cityDistrict
                                  )
                                ">{{ cityDistrict.districtName }}</span>
															<template v-for="bizArea in bizAreas.filter(
                                  (item, index) => {
                                    return (
                                      item.districtId ===
                                      cityDistrict.districtId
                                    )
                                  }
                                )">
																<el-col :xl="4" :sm="6">
																	<el-link :key="bizArea.id" :underline="false"
																		:style="[
                                      { 'line-height': '2rem' },
                                      {
                                        color:
                                          SearchCondition.BizAreaId ===
                                          bizArea.id
                                            ? '#0A55A3'
                                            : '',
                                      },
                                    ]" @click="
                                      districtItemClick(
                                        districtElseEnum.BIZAREA,
                                        bizArea
                                      )
                                    ">{{ bizArea.areaName }}
																	</el-link>
																</el-col>
															</template>
														</el-tab-pane>
													</template>
												</el-tabs>
											</el-tab-pane>
											<el-tab-pane name="station" :lazy="true" :stretch="true">
												<span slot="label">地铁站</span>
												<el-tabs :stretch="true">
													<template v-for="stationLine in stationLines.filter(
                              (item, index) => {
                                return !item.parentLineId
                              }
                            )">
														<el-tab-pane :key="stationLine.id">
															<span slot="label" @click="
                                  districtItemClick(
                                    districtElseEnum.SUBWAYLINE,
                                    stationLine
                                  )
                                ">{{ stationLine.lineName }}</span>
															<template v-for="station in stationLines.filter(
                                  (item, index) => {
                                    return item.parentLineId === stationLine.id
                                  }
                                )">
																<el-col :xl="4" :sm="6">
																	<el-link :key="station.id" :underline="false"
																		:style="[
                                      { 'line-height': '2rem' },
                                      {
                                        color:
                                          SearchCondition.SubWayLineId ===
                                            stationLine.id &&
                                          SearchCondition.SubWayStatationId ===
                                            station.id
                                            ? '#0A55A3'
                                            : '',
                                      },
                                    ]" @click="
                                      districtItemClick(
                                        districtElseEnum.SUBWAYSTATION,
                                        station,
                                        stationLine
                                      )
                                    ">{{ station.stationName }}
																	</el-link>
																</el-col>
															</template>
														</el-tab-pane>
													</template>
												</el-tabs>
											</el-tab-pane>
											<el-tab-pane name="university" :lazy="true">
												<span slot="label">学校</span>
												<!-- <template v-for="uni in districtElse.filter((item,index)=>{ return item.typeId === districtElseEnum.UNIVERSITY || item.typeId === districtElseEnum.MIDDLESCHOOL })">
                        <el-link :key="uni.id" style="margin-right: 0.5rem;line-height: 1.875rem;">{{ uni.name }}</el-link>
                      </template> -->
												<el-tabs :stretch="true">
													<template v-for="(uni, key, index) in toGroup(
                              districtElse.filter((item, index) => {
                                return (
                                  item.typeId === districtElseEnum.UNIVERSITY ||
                                  item.typeId === districtElseEnum.MIDDLESCHOOL
                                )
                              })
                            )">
														<el-tab-pane :key="index" :title="uni">
															<span slot="label">{{ key }}</span>
															<template v-for="it in districtElse.filter(
                                  (item, index) => {
                                    return (
                                      (item.typeId ===
                                        districtElseEnum.UNIVERSITY ||
                                        item.typeId ===
                                          districtElseEnum.MIDDLESCHOOL) &&
                                      uni.indexOf(
                                        item.slug.charAt(0).toUpperCase()
                                      ) > -1
                                    )
                                  }
                                )">
																<el-col :xl="4" :sm="6">
																	<el-link :key="it.key" :underline="false" :style="[
                                      { 'line-height': '2rem' },
                                      {
                                        color:
                                          SearchCondition.CollegeId === it.id
                                            ? '#0A55A3'
                                            : '',
                                      },
                                    ]" @click="districtItemClick(it.typeId, it)">{{ it.name }}</el-link>
																</el-col>
															</template>
														</el-tab-pane>
													</template>
												</el-tabs>
											</el-tab-pane>
											<el-tab-pane name="traffic" :lazy="true">
												<span slot="label">车站/机场</span>
												<template v-for="uni in districtElse.filter((item, index) => {
                            return (
                              item.typeId === districtElseEnum.STATION ||
                              item.typeId === districtElseEnum.AIRPORT
                            )
                          })">
								 <el-col :xl="4" :sm="6" >
														<el-link :key="uni.id" :style="[
                                { 'line-height': '2rem' },
                                {
                                  color:
                                    SearchCondition.AirPortId === uni.id ||
                                    SearchCondition.StationId === uni.id
                                      ? '#0A55A3'
                                      : '',
                                },
                              ]" @click="districtItemClick(uni.typeId, uni)">{{ uni.name }}
														</el-link>
													</el-col>
												</template>
											</el-tab-pane>
											<el-tab-pane name="scenic" :lazy="true">
												<span slot="label">旅游景点</span>
												<!-- <template v-for="uni in districtElse.filter((item,index)=>{ return item.typeId === districtElseEnum.SENIC })">
                        <el-link :key="uni.id" style="margin-right: 0.5rem;line-height: 1.875rem;">{{ uni.name }}</el-link>
                      </template> -->
												<el-tabs :stretch="true">
													<template v-for="(uni, key, index) in toGroup(
                              districtElse.filter((item, index) => {
                                return item.typeId === districtElseEnum.SENIC
                              })
                            )">
														<el-tab-pane :key="index" :title="uni">
															<span slot="label">{{ key }}</span>
															<template v-for="it in districtElse.filter(
                                  (item, index) => {
                                    return (
                                      item.typeId === districtElseEnum.SENIC &&
                                      uni.indexOf(
                                        item.slug.charAt(0).toUpperCase()
                                      ) > -1
                                    )
                                  }
                                )">
																<el-col :xl="4" :sm="6">
																	<el-link :key="it.key" :underline="false" :style="[
                                      { 'line-height': '2rem' },
                                      {
                                        color:
                                          SearchCondition.ScenicSpotId === it.id
                                            ? '#0A55A3'
                                            : '',
                                      },
                                    ]" @click="districtItemClick(it.typeId, it)">{{ it.name }}</el-link>
																</el-col>
															</template>
														</el-tab-pane>
													</template>
												</el-tabs>
											</el-tab-pane>
											<el-tab-pane name="hospital" :lazy="true">
												<span slot="label">医院</span>
												<el-tabs :stretch="true">
													<template v-for="(uni, key, index) in toGroup(
                              districtElse.filter((item, index) => {
                                return item.typeId === districtElseEnum.HOSITAL
                              })
                            )">
														<!-- <el-link :key="uni.id" style="margin-right: 0.5rem;line-height: 1.875rem;">{{ uni.name }}</el-link> -->
														<el-tab-pane :key="index" :title="uni">
															<span slot="label">{{ key }}</span>
															<template v-for="it in districtElse.filter(
                                  (item, index) => {
                                    return (
                                      item.typeId ===
                                        districtElseEnum.HOSITAL &&
                                      uni.indexOf(
                                        item.slug.charAt(0).toUpperCase()
                                      ) > -1
                                    )
                                  }
                                )">
																<!-- && uni.indexOf(item.slug.charAt(0))>-1 -->
																<el-col :xl="4" :sm="6">
																	<el-link :key="it.key" :underline="false" :style="[
                                      { 'line-height': '2rem' },
                                      {
                                        color:
                                          SearchCondition.HospitalId === it.id
                                            ? '#0A55A3'
                                            : '',
                                      },
                                    ]" @click="districtItemClick(it.typeId, it)">{{ it.name }}
																	</el-link>
																</el-col>
															</template>
														</el-tab-pane>
													</template>
												</el-tabs>
											</el-tab-pane>
										</el-tabs>
									</el-col>
								</el-row>
								<el-row>
									<el-col :xl="1" :sm="2">
										<el-link :underline="false">类型</el-link>
									</el-col>
									<el-col :xl="2" :sm="2">
										<el-tag effect="plain" :type="
                        SearchCondition.CategoryIds.length === 0
                          ? 'primary'
                          : 'info'
                      " @click="SearchCondition.TypeIds = []">
											不限
										</el-tag>
									</el-col>
									<el-col :xl="18" :sm="20">
										<el-checkbox-group v-model="SearchCondition.CategoryIds">
											<el-col v-for="(hotelType, index) in hotelTypes" :key="'index1' + index"
												:label="hotelType.id" :xl="4" :sm="5">
												<el-checkbox name="" :label="hotelType.id">{{
                          hotelType.subCategoryName
                        }}</el-checkbox>
											</el-col>
										</el-checkbox-group>
									</el-col>
								</el-row>
								<el-row>
									<el-col :xl="1" :sm="2">
										<el-link :underline="false">星级</el-link>
									</el-col>
									<el-col :xl="2" :sm="2">
										<el-tag effect="plain" :type="
                        SearchCondition.StarLevels.length === 0
                          ? 'primary'
                          : 'info'
                      " @click="SearchCondition.StarLevels = []">
											不限
										</el-tag>
									</el-col>
									<el-col :xl="18" :sm="20">
										<el-checkbox-group v-model="SearchCondition.StarLevels">
											<el-col v-for="(hotelStar, index) in hotelStars" :key="index" :xl="4"
												:sm="5" name="hotelstar" :label="hotelStar.id">
												<el-checkbox name="hotelstar" :label="hotelStar.id">
													{{ hotelStar.starName }}
												</el-checkbox>
											</el-col>
										</el-checkbox-group>
									</el-col>
								</el-row>
								<el-row>
									<el-col :xl="1" :sm="2">
										<el-link :underline="false">品牌</el-link>
									</el-col>
									<el-col :xl="2" :sm="2">
										<el-tag effect="plain" :type="
                        SearchCondition.BrandIds.length === 0
                          ? 'primary'
                          : 'info'
                      " @click="SearchCondition.BrandIds = []">
											不限
										</el-tag>
									</el-col>
									<el-col :xl="18" :sm="20">
										<el-checkbox-group v-model="SearchCondition.BrandIds">
											<el-col v-for="(hotelBrand, index) in moreHotelBrands"
												v-if="hotelBrand.showBrandName.length > 0" :key="'index3' + index"
												:xl="4" :sm="5">
												<el-checkbox name="hotelbrand" :label="hotelBrand.id">
													{{ hotelBrand.showBrandName }}
												</el-checkbox>
											</el-col>
										</el-checkbox-group>
									</el-col>
									<el-col :xl="2" :sm="2">
										<el-link :underline="false" style="color: darkgray"
											@click="hotelBrandMoreClick"><i :class="
                          hotelBrandMore
                            ? 'el-icon-arrow-up'
                            : 'el-icon-arrow-down'
                        " />&nbsp;更多</el-link>
									</el-col>
								</el-row>
								<el-row>
									<el-col :xl="1" :sm="2">
										<el-link :underline="false">价格</el-link>
									</el-col>
									<el-col :xl="2" :sm="2">
										<el-tag effect="plain" :type="
                        priceType === PriceType.default &&
                        SearchCondition.HotelPrice.length === 0
                          ? 'primary'
                          : 'info'
                      " @click="defaultPriceClick(true)">
											不限
										</el-tag>
									</el-col>
									<el-col :xl="16" :sm="16">
										<el-radio-group v-model="SearchCondition.HotelPrice" size="mini">
											<el-radio-button v-for="hotelPrice in HotelPrices" :key="hotelPrice.key"
												:label="hotelPrice.value" @click.native="defaultPriceClick()">
												{{ hotelPrice.text }}
											</el-radio-button>
										</el-radio-group>
									</el-col>
									<el-col :xl="{ span: 16, offset: 1 }" :sm="{ span: 15, offset: 2 }"
										style="margin-top: 1rem">
										<el-col :xl="{ span: 3 }" :sm="{ span: 4 }" style="margin-top: 0.3125rem">
											<el-tag effect="plain" :type="
                          priceType === PriceType.custom ? 'primary' : 'info'
                        " @click="customPriceClick()">
												自定义
											</el-tag>
										</el-col>
										<el-col :xl="{ span: 16 }" :sm="{ span: 16 }">
											<el-slider v-model="priceSetp" :max="3000" :min="0" :step="10" range
												:disabled="priceType !== PriceType.custom" @change="priceSetpChange" />
										</el-col>
									</el-col>
								</el-row>
								<el-row>
									<el-tag v-for="tag in tags" :key="tag.name" closable type="dark" effect="plain"
										size="medium" style="margin-right: 0.625rem" @close="closeTag(tag)">
										{{ tag.name }}
									</el-tag>
									<el-button v-waves class="filter-item" type="primary" size="small"
										icon="el-icon-search" @click="advancedSearch()">搜索</el-button>
									<el-button v-waves class="filter-item" type="warning" size="small"
										icon="el-icon-close" @click="clearAdvancedSearch">重置</el-button>
								</el-row>
								<el-row class="last-el-row">
									<el-link type="warning">{{
                    TotoalCount < 0 ? 0 : TotoalCount
                  }}</el-link>
									<el-link :underline="false">&nbsp;家符合条件的酒店</el-link>
								</el-row>
							</el-form>
						</el-card>
					</div>
				</el-collapse-item>
			</el-collapse>
		</el-col>
		<!-- <el-col :span="12" :offset="3"> -->
		<el-col :span="17" :offset="3">
			<el-card>
				<div class="sort-content">
					<el-row>
						<el-col :xl="2" :sm="5" :xs="5">
							<el-link :underline="false" :class="{
                  active: SearchCondition.SortType === SortType.default,
                }" @click="onSort(SortType.default)">智能排序</el-link>
						</el-col>
						<el-col :xl="2" :sm="5" :xs="5">
							<el-link :underline="false" :class="{
                  active: SearchCondition.SortType === SortType.Comment,
                }" @click="onSort(SortType.Comment)">好评优先</el-link>
						</el-col>
						<el-col :xl="2" :sm="5" :xs="5">
							<el-link :underline="false" :class="{
                  active:
                    SearchCondition.SortType === SortType.PriceUp ||
                    SearchCondition.SortType === SortType.PriceDown,
                }" @click="
                  onSort(
                    SearchCondition.SortType === SortType.PriceUp
                      ? SortType.PriceDown
                      : SortType.PriceUp
                  )
                ">价格排序<i v-if="SearchCondition.SortType === SortType.PriceDown" class="el-icon-caret-bottom" /><i
									v-if="SearchCondition.SortType === SortType.PriceUp" class="el-icon-caret-top" />
							</el-link>
						</el-col>
						<!-- <el-col :xl="2" :sm="5" :xs="5">
              <el-link :underline="false" :class="{active:SearchCondition.SortType===SortType.Popular}" @click="onSort(SortType.Popular)">人气优先</el-link>
            </el-col> -->
					</el-row>
				</div>
				<div class="list-content">
					<el-row v-show="hotelOnLoading" v-loading="hotelOnLoading" class="onloading" />
					<el-row v-show="noData">
						<el-col :offset="10">
							<el-link type="warning">没有数据</el-link>
						</el-col>
					</el-row>
					<el-row v-for="hotel in HotelList" :key="hotel.id" class="content">
						<el-row class="content-header">
							<el-col :xl="6" :lg="6" :md="6" :sm="24" :xs="24">
								<div class="item-img">
									<el-image class="item-img" :src="
                      hotel.images && hotel.images.length > 0
                        ? hotel.images[0].imgUrl
                        : ''
                    " :preview-src-list="
                      hotel.images && hotel.images.length > 0
                        ? hotel.images.map((v, i, a) => {
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
									<div class="imglength">共{{ hotel.images.length }}张</div>
								</div>
							</el-col>

							<el-col :md="11" :xl="11" :lg="11" :sm="13" :xs="24" class="hotel-info"
								style="margin-left: 1.5rem">
								<el-row >
									<el-link class="hotel-title" @click="goHotel(hotel.hotelCode)" v-html="hotel.hotelNameDesc">
										</el-link>
									<el-link class="hoteltp" :underline="false">{{
                    hotel.starLevelName
                  }}</el-link>

									<el-link v-if="hotel.guestOverallRating" :underline="false"
										class="hotel-guestOverallRating">
										<el-rate :value="hotel.guestOverallRating" disabled show-score
											text-color="#ff9900" score-template="{value} 分	" />
									</el-link>
								</el-row>

								<el-row class="hotel-address" >
									<el-link :underline="false">
										<i class="el-icon-location-outline"></i>
										<span v-html="hotel.hotelAddressDesc"></span>
									</el-link>
									<el-link class="view-map" type="primary" @click="showAmap(hotel)">查看地图
										<span class="el-icon-map-location" />
									</el-link>
								</el-row>
								<el-row v-if="hotel.distance">
									<el-link>
										距离目的地{{ (hotel.distance / 1000).toFixed(2) }}公里
									</el-link>
								</el-row>
								<el-row class="hotel-service">
									<!-- <el-tag type="warning" style="margin-right:1rem">价格便宜</el-tag>
                  <el-tag type="danger" style="margin-right:1rem">服务好</el-tag>
                  <el-tag type="success">预订快</el-tag> -->
									<el-tag effect="plain">
									<span class="el-icon-light-rain"> 热水</span>
									</el-tag><el-tag effect="plain">
									<span class="el-icon-lightning"> 冷水</span>
									</el-tag><el-tag effect="plain">
									<span class="el-icon-heavy-rain"> 温水</span>
									</el-tag><el-tag effect="plain">
									<span class="el-icon-sunrise"> 冰水</span>
									</el-tag><el-tag effect="plain">
									<span class="el-icon-cloudy-and-sunny"> 开水</span>
									</el-tag>
								</el-row>
							</el-col>
							<el-col :lg="6" :xl="4" :md="6" :sm="24" :xs="24" class="hotel-comment">
								<el-row v-if="hotel.minPrice">
									<el-link class="hotel-price" :underline="false" type="primary">
										<span style="font-size:medium">￥</span>
										<em>{{ parseFloat(hotel.minPrice).toFixed(2)}}</em>
										<i class="hotel-price-tip">起
										</i>
									</el-link>
									<el-row>
										<el-link :underline="false" type="warning">
											<el-button class="buttonstyle" size="small" type="primary"
												@click="goHotel(hotel.hotelCode)">查看详情</el-button>
										</el-link>
									</el-row>
								</el-row>
								<el-row v-else>
									<el-row>
										<el-link class="hotel-type" :underline="false" type="warning" />
									</el-row>
									<el-link :underline="false" type="warning" style="font-size: Medium">
										<el-button class="buttonstyle" size="small" type="primary"
											@click="goHotel(hotel.hotelCode)">查看详情</el-button>
									</el-link>
								</el-row>
							</el-col>
						</el-row>
						<el-col :span="24" style="padding:0">
							<el-divider />
						</el-col>
					</el-row>
				</div>
				<el-pagination background layout="total, prev, pager, next, jumper" :total="TotoalCount"
					:page-size="PageSize" :current-page="PageIndex" :hide-on-single-page="false"
					@current-change="onPageChange" />
				<back-to-top ref="backToTop" transition-name="fade" />
			</el-card>
		</el-col>
		<!-- <el-col :xl="5" :lg="5" :md="5" :sm="5" :xs="5">
      <el-row>
        <div class="block">
          <span class="demonstration">系统热销酒店</span>
          <el-carousel height="150px">
            <el-carousel-item v-for="item in 4" :key="item">
              <h3 class="small">{{ item }}</h3>
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-row>
    </el-col> -->
		<el-dialog :visible.sync="amapVisiable" title="酒店位置" width="55rem">
			<AMap :hotel="currentHotel" />
		</el-dialog>
	</div>
</template>

<script>
	import {
		GetHotelList,
		GetHotelCategoryByCityId,
		GetHotelStar,
		GetHotelBrandByCityId,
		HotelSuggest
	} from '@/api/hotel/hotel'
	// import {
	//   GetCitiesGroup,
	//   GetHotCities
	// } from '@/api/basic/basic'
	import {
		GetDistrictDetails,
		GetHotDistricts,
		GetGroupDistricts,
		GetDistricts
	} from '@/api/district/district'
	import moment from 'moment'
	import AMap from '@/components/Amap'
	import BackToTop from '@/components/BackToTop'
	import waves from '@/directive/waves'
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'HotelList',
		directives: {
			waves
		},
		components: {
			AMap,
			BackToTop
		},
		data() {
			return {
				/**
				 * 搜索条件
				 */
				HotelPrices: [{
						key: 1,
						value: [0, 100],
						text: '100元以下'
					},
					{
						key: 2,
						value: [100, 200],
						text: '100-200元'
					},
					{
						key: 3,
						value: [200, 300],
						text: '200-300元'
					},
					{
						key: 4,
						value: [300, 400],
						text: '300-400元'
					},
					{
						key: 5,
						value: [400, 500],
						text: '400-500元'
					},
					{
						key: 6,
						value: [500, 999999],
						text: '500元以上'
					}
				],
				SortType: {
					// 默认(智能排序)
					default: 0,
					// 好评
					Comment: 1,
					// 价格升序
					PriceUp: 2,
					// 价格降序
					PriceDown: 3
				},
				hotelOnLoading: false,
				HotelList: [],
				PageIndex: 1,
				PageSize: 20,
				TotoalCount: -1,
				PositionType: 0,
				SearchCondition: {
					// 城市id
					CityId: 0,
					// 城市名
					CityName: '',
					// 排序
					SortType: 0,
					// 类型
					CategoryIds: [],
					// 星级
					StarLevels: [],
					// 品牌
					BrandIds: [],
					// 价格
					HotelPrice: [],
					// 入离日期
					CheckInDate: [],
					// 医院
					HospitalId: '',
					// 旅游景点
					ScenicSpotId: '',
					// 车站/机场
					AirPortId: '',
					// 大学
					CollegeId: '',
					// 车站/机场
					StationId: '',
					// 行政区/商圈
					BizAreaId: '',
					// 热门
					HotId: '',
					// 地铁站
					SubWayLineId: '',
					SubWayStatationId: ''
				},
				tags: [],
				hotelSuggest: '',
				pickerOptions: {
					disabledDate(date) {
						const startDate = moment().format('YYYYMMDD')
						const currentDate = moment(date).format('YYYYMMDD')
						const endDate = moment().add(21, 'd').format('YYYYMMDD')
						return !(currentDate >= startDate && endDate >= currentDate)
					}
				},
				amapVisiable: false,
				currentHotel: {},
				cityVisiable: false,
				currentCityTab: 'hot',
				hotCities: [],
				allCities: {
					group1: {
						cities: []
					},
					group2: {
						cities: []
					},
					group3: {
						cities: []
					},
					group4: {
						cities: []
					},
					group5: {
						cities: []
					},
					group6: {
						cities: []
					}
				},
				tab: '',
				hotelTypes: [],
				hotelStars: [],
				hotelBrands: [],
				priceType: 1,
				PriceType: {
					default: 1,
					custom: 2
				},
				priceSetp: [0, 0],
				bizAreas: [],
				cityDistricts: [],
				stationLines: [],
				stationTab: '',
				districtElse: [],
				districtElseEnum: {
					UNIVERSITY: 1,
					AIRPORT: 4,
					STATION: 2,
					SENIC: 3,
					HOSITAL: 5,
					MARKET: 6,
					MIDDLESCHOOL: 11,
					LANDMARK: 100,
					HOT: 20,
					BIZAREA: 500,
					SUBWAYLINE: 505,
					SUBWAYSTATION: 506
				},
				hotelBrandMore: false
			}
		},
		computed: {
			...mapGetters(['city', 'search']),
			noData() {
				return this.TotoalCount === 0
			},
			moreHotelBrands() {
				return this.hotelBrandMore ?
					this.hotelBrands :
					this.hotelBrands.slice(0, 15)
			}
		},
		watch: {
			SearchCondition: {
				handler(val, oldval) {
					if (this.TotoalCount >= 0) {
						this.PageIndex = 1
					}

					this.$store.dispatch('condition/setSearch', val)
					// 品牌
					let brands = []
					if (
						this.SearchCondition.BrandIds &&
						this.SearchCondition.BrandIds.length > 0
					) {
						brands = this.SearchCondition.BrandIds.map((item) => {
							const brand = this.moreHotelBrands.find((x) => {
								return item === x.id
							})
							return {
								id: brand.id,
								name: brand.showBrandName,
								item: 3
							}
						})
					}
					// 类型
					let types = []
					if (
						this.SearchCondition.CategoryIds &&
						this.SearchCondition.CategoryIds.length > 0
					) {
						types = this.SearchCondition.CategoryIds.map((item) => {
							const type = this.hotelTypes.find((x) => {
								return item === x.id
							})
							return {
								id: type.id,
								name: type.subCategoryName,
								item: 1
							}
						})
					}
					// 星级
					let stars = []
					if (
						this.SearchCondition.StarLevels &&
						this.SearchCondition.StarLevels.length > 0
					) {
						stars = this.SearchCondition.StarLevels.map((item) => {
							const star = this.hotelStars.find((x) => {
								return item === x.id
							})
							return {
								id: star.id,
								leavel: star.starLevel,
								name: star.starName,
								item: 2
							}
						})
					}
					// 价格
					const prices = []
					if (
						this.SearchCondition.HotelPrice &&
						this.SearchCondition.HotelPrice.length > 0
					) {
						const p1 = this.SearchCondition.HotelPrice[0]
						const p2 = this.SearchCondition.HotelPrice[1]

						if (p1 === 500 && p2 === 999999) {
							prices.push({
								id: 1,
								name: '500元以上',
								item: 4
							})
						} else if (p1 === 0 && p2 === 100) {
							prices.push({
								id: 1,
								name: '100元以下',
								item: 4
							})
							// eslint-disable-next-line no-empty
						} else if (p1 === 0 && p2 === 0) {} else {
							prices.push({
								id: 1,
								name: p1 + '-' + p2 + '元',
								item: 4
							})
						}
					}
					// 热门
					const hotAreas = []
					if (this.SearchCondition.HotId) {
						const hotArea = this.districtElse
							.filter((item) => {
								return item.typeId === this.districtElseEnum.HOT
							})
							.find((x) => {
								return this.SearchCondition.HotId === x.id
							})
						hotAreas.push({
							id: 1,
							name: hotArea.name,
							item: 5
						})
					}
					// 行政区、商圈
					const bizAreas = []
					if (this.SearchCondition.BizAreaId) {
						const bizArea = this.bizAreas
							.filter((item) => {
								return item.id === this.SearchCondition.BizAreaId
							})
							.find((x) => {
								return this.SearchCondition.BizAreaId === x.id
							})
						if (bizArea) {
							bizAreas.push({
								id: 1,
								name: bizArea.areaName,
								item: 6
							})
						}
					}
					// 地铁站
					const subwaystatations = []
					if (this.SearchCondition.SubWayStatationId) {
						const subwaystatation = this.stationLines
							.filter((item) => {
								return item.id === this.SearchCondition.SubWayStatationId
							})
							.find((x) => {
								return this.SearchCondition.SubWayStatationId === x.id
							})
						if (subwaystatation) {
							subwaystatations.push({
								id: 1,
								name: subwaystatation.stationName,
								item: 7
							})
						}
					}
					// 学校
					const CollegeIds = []
					if (this.SearchCondition.CollegeId) {
						const CollegeId = this.districtElse
							.filter((item) => {
								return item.id === this.SearchCondition.CollegeId
							})
							.find((x) => {
								return this.SearchCondition.CollegeId === x.id
							})
						if (CollegeId) {
							CollegeIds.push({
								id: 1,
								name: CollegeId.name,
								item: 8
							})
						}
					}
					// 车站、机场(车站)
					const StationIds = []
					if (this.SearchCondition.StationId) {
						const StationId = this.districtElse.filter(item => {
							return item.id === (this.SearchCondition.StationId)
						}).find(x => {
							return this.SearchCondition.StationId === x.id
						})
						if (StationId) {
							StationIds.push({
								id: 1,
								name: StationId.name,
								item: 9
							})
						}
					}

					// 车站、机场(机场)
					const AirPortIds = []
					if (this.SearchCondition.AirPortId) {
						const AirPortId = this.districtElse.filter(item => {
							return item.id === (this.SearchCondition.AirPortId)
						}).find(x => {
							return this.SearchCondition.AirPortId === x.id
						})
						if (AirPortId) {
							AirPortIds.push({
								id: 1,
								name: AirPortId.name,
								item: 9
							})
						}
					}


					// 旅游景点
					const ScenicSpotIds = []
					if (this.SearchCondition.ScenicSpotId) {
						const ScenicSpotId = this.districtElse
							.filter((item) => {
								return item.id === this.SearchCondition.ScenicSpotId
							})
							.find((x) => {
								return this.SearchCondition.ScenicSpotId === x.id
							})
						if (ScenicSpotId) {
							ScenicSpotIds.push({
								id: 1,
								name: ScenicSpotId.name,
								item: 10
							})
						}
					}

					// 医院
					const HospitalIds = []
					if (this.SearchCondition.HospitalId) {
						const HospitalId = this.districtElse
							.filter((item) => {
								return item.id === this.SearchCondition.HospitalId
							})
							.find((x) => {
								return this.SearchCondition.HospitalId === x.id
							})
						if (HospitalId) {
							HospitalIds.push({
								id: 1,
								name: HospitalId.name,
								item: 11
							})
						}
					}
					this.tags = [...types, ...stars, ...brands, ...prices, ...hotAreas, ...bizAreas, ...subwaystatations,
						...CollegeIds, ...StationIds, ...AirPortIds, ...ScenicSpotIds, ...HospitalIds
					]

				},
				deep: true
			},
			'SearchCondition.CityId': {
				handler(val, oldVal) {
					if (val && val !== oldVal) {
						this.PageIndex = 1
						this.cleanPosition() // 清空已选择的地址tag
						this.fetchDistrictInfo(val) // 重新获取地址信息
						this.fetchHotelTypes(val)
						this.fetchHotelBrands(val)
						this.fetchHotelList(val)
					}
				},
				deep: true
			},
			hotCities: {
				handler(val, oldVal) {
					if (!this.SearchCondition || !this.SearchCondition.CityId) {
						if (val) {
							const defaultCity = val[0]
							this.SearchCondition.CityId = defaultCity.cityId
							this.SearchCondition.CityName = defaultCity.cityName
						}
					}
				},
				deep: true
			}
		},
		created() {
			this.init()
			if (this.SearchCondition.CityName) {
				this.searchKeyword()
			}
		},
		methods: {
			init() {
				// 初始化参数
				if (this.search) {
					this.SearchCondition = this.search
				} else {
					const startDate = moment().format('YYYY-MM-DD')
					const endDate = moment().add(1, 'd').format('YYYY-MM-DD')
					this.SearchCondition.CheckInDate = [startDate, endDate]
				}
				this.fetchHotCities()
				this.fetchCities()
				// this.fetchHotelList()

				// this.fetchHotelQuotedPrices()
				this.fetchHotelStars()
			},
			fetchDistrictInfo(cityid) {
				if (!cityid) {
					cityid = this.SearchCondition.CityId
				}
				if (!cityid) {
					return
				}

				GetDistrictDetails(cityid).then((res) => {
					// 行政区
					this.bizAreas = res.data.bizAreas
					// 地铁站
					this.stationLines = res.data.stationLines
					// 行政区地区
					this.districtElse = res.data.landMarks
					this.cityDistricts = res.data.cityDistricts
				})
			},
			// 类型
			fetchHotelTypes(cityId) {
				if (cityId) {
					cityId = this.SearchCondition.CityId
				}
				GetHotelCategoryByCityId(cityId).then((res) => {
					this.hotelTypes = res.data
				})
			},
			fetchHotelStars() {
				GetHotelStar().then((res) => {
					// 星级
					this.hotelStars = res.data
				})
			},
			// 品牌
			fetchHotelBrands(cityid) {
				if (cityid) {
					cityid = this.SearchCondition.CityId
				}
				if (!cityid) {
					return
				}
				GetHotelBrandByCityId(cityid).then((res) => {
					this.hotelBrands = res.data
				})
			},
			fetchHotCities() {
				// const that = this
				// GetHotCities().then(res => {
				//   that.hotCities = res.data
				// })
				const that = this
				GetHotDistricts().then((res) => {
					// 热门
					that.hotCities = res.data
				})
			},
			hotelBrandMoreClick() {
				this.hotelBrandMore = !this.hotelBrandMore
			},
			districtItemClick(type, item, parentItem) {
				this.cleanPosition()

				switch (type) {
					case this.districtElseEnum.HOSITAL:
						this.SearchCondition.HospitalId = item.id
						break
					case this.districtElseEnum.SENIC:
						this.SearchCondition.ScenicSpotId = item.id
						break
					case this.districtElseEnum.UNIVERSITY:
					case this.districtElseEnum.MIDDLESCHOOL:
						this.SearchCondition.CollegeId = item.id
						break
					case this.districtElseEnum.AIRPORT:
						this.SearchCondition.AirPortId = item.id
						break
					case this.districtElseEnum.STATION:
						this.SearchCondition.StationId = item.id
						break
					case this.districtElseEnum.BIZAREA:
						this.SearchCondition.BizAreaId = item.id
						break
					case this.districtElseEnum.HOT:
						this.SearchCondition.HotId = item.id
						break
					case this.districtElseEnum.SUBWAYSTATION:
						this.SearchCondition.SubWayStatationId = item.id

						this.SearchCondition.SubWayLineId = parentItem.id
						break
					case this.districtElseEnum.SUBWAYLINE:
						this.SearchCondition.SubWayLineId = item.id
						break
				}
			},
			citySearch(keyword, callback) {
				if (this.cityVisiable) {
					this.cityVisiable = false
				}
				GetDistricts(keyword).then((res) => {
					callback(res.data)
				})
			},
			hotelSuggestSearch(keyword, callback) {
				const cityId = this.SearchCondition.CityId
				HotelSuggest(cityId, keyword).then((res) => {
					const suggests = res.data.splice(0, 50).map((item) => {
						return {
							hotelName: item
						}
					})
					callback(suggests)
				})
			},
			suggestClick() {
				this.SearchCondition.Keyword = this.hotelSuggest
			},
			citySearchClick(item) {
				this.SearchCondition.CityId = item.cityId
				this.SearchCondition.CityName = item.cityName
			},
			searchKeyword() {
				if (!this.SearchCondition.CityName) {
					this.$message.error('请先选择城市')
					return
				}
				this.clearAdvancedSearch()
				this.fetchHotelList()
			},
			advancedSearch() {
				if (!this.SearchCondition.CityName) {
					this.$message.error('请先选择城市')
					return
				}

				this.fetchHotelList()
			},
			closeTag(tag) {
				this.tags.splice(this.tags.indexOf(tag), 1)
				if (tag.item == 1) {
					this.SearchCondition.CategoryIds.forEach((item, index) => {
						if (item === tag.id) {
							this.SearchCondition.CategoryIds.splice(index, 1)
						}
					})
				} else if (tag.item == 2) {
					this.SearchCondition.StarLevels.forEach((item, index) => {
						if (item === tag.id) {
							this.SearchCondition.StarLevels.splice(index, 1)
						}
					})
				} else if (tag.item == 3) {
					this.SearchCondition.BrandIds.forEach((item, index) => {
						if (item === tag.id) {
							this.SearchCondition.BrandIds.splice(index, 1)
						}
					})
				} else if (tag.item == 4) {
					this.SearchCondition.HotelPrice = []
					this.priceSetp = [0, 0]
					this.SearchCondition.HotelPrice.forEach((item, index) => {
						this.SearchCondition.HotelPrice.splice(index, 1)
					})
				} else if (tag.item == 5) {
					this.SearchCondition.HotId = ''
				} else if (tag.item == 6) {
					this.SearchCondition.BizAreaId = ''
				} else if (tag.item == 7) {
					this.SearchCondition.SubWayStatationId = ''
				} else if (tag.item == 8) {
					this.SearchCondition.CollegeId = ''
				} else if (tag.item == 9) {
					this.SearchCondition.StationId = ''
					this.SearchCondition.AirPortId = ''
				} else if (tag.item == 10) {
					this.SearchCondition.ScenicSpotId = ''
				} else if (tag.item == 11) {
					this.SearchCondition.HospitalId = ''
				}
			},
			clearAdvancedSearch() {
				this.SearchCondition.AirPortId = ''
				this.SearchCondition.BizAreaId = ''
				this.SearchCondition.CollegeId = ''
				this.SearchCondition.HospitalId = ''
				this.SearchCondition.HotId = ''
				this.SearchCondition.ScenicSpotId = ''
				this.SearchCondition.HotelPrice = []
				this.SearchCondition.BrandIds = []
				this.SearchCondition.StarLevels = []
				this.SearchCondition.StationId = ''
				this.SearchCondition.SubWayLineId = ''
				this.SearchCondition.SubWayStatationId = ''
				this.SearchCondition.CategoryIds = []
				this.tag = []
			},
			fetchCities() {
				const that = this
				GetGroupDistricts().then((res) => {
					const allCities = res.data

					let i = 1
					let y = 1
					const count = 5
					let groupTitle = ''
					for (const letter in allCities) {
						const group = 'group' + y
						that.allCities[group].cities.push(...allCities[letter])

						groupTitle += letter.toUpperCase()
						if (i % count === 0) {
							that.allCities[group].title = groupTitle
							groupTitle = ''
							y++
						} else {
							if (count * y - Object.keys(allCities).length < count) {
								that.allCities[group].title = groupTitle
							}
						}
						i++
					}
				})

				// const that = this
				// GetCitiesGroup().then(res => {
				//   const allCities = res.data

				//   let i = 1
				//   let y = 1
				//   const count = 5
				//   let groupTitle = ''
				//   for (const letter in allCities) {
				//     const group = 'group' + y
				//     that.allCities[group].cities.push(...allCities[letter])

				//     groupTitle += letter.toUpperCase()
				//     if (i % count === 0) {
				//       that.allCities[group].title = groupTitle
				//       groupTitle = ''
				//       y++
				//     } else {
				//       if (count * y - Object.keys(allCities).length < count) {
				//         that.allCities[group].title = groupTitle
				//       }
				//     }
				//     i++
				//   }
				// })
			},
			fetchHotelList() {
				const that = this
				let stars1 = []

				if (
					this.SearchCondition.StarLevels &&
					this.SearchCondition.StarLevels.length > 0
				) {
					stars1 = this.SearchCondition.StarLevels.map((item) => {
						const star = this.hotelStars.find((x) => {
							return item === x.id
						})
						return {
							id: star.id,
							leavel: star.starLevel,
							name: star.starName,
							item: 2
						}
					})
				}
				var arr = []
				stars1.forEach((item) => {
					arr.push(item.leavel)
				})
				const param = {
					...this.SearchCondition,
					CheckInDate: {
						item1: this.SearchCondition.CheckInDate[0],
						item2: this.SearchCondition.CheckInDate[1]
					},
					PageSize: this.PageSize,
					PageIndex: this.PageIndex
				}
				param.StarLevels = arr
				if (this.hotelSuggest && !param.keyword) {
					param.Keyword = this.hotelSuggest
				} else {
					param.Keyword = ''
				}

				this.hotelOnLoading = true
				GetHotelList(param).then((res) => {
					that.HotelList = res.data.rows
					that.TotoalCount = res.data.total
					this.hotelOnLoading = false
				})
			},
			// fetchHotelQuotedPrices() {
			//   this.hotelOnLoading = true

			//   const hotelCode = this.HotelList.hotelCode
			//   console.log(hotelCode);
			//   GetHotelQuotedPrices({ hotelCode }).then(res => {
			//     this.HotelList = { ...this.HotelList, ...res.data }
			//     console.log(this.HotelList);
			//     this.hotelOnLoading = false
			//   }).catch(err => {
			//     this.hotelOnLoading = false
			//   })
			// },
			toGroup(arr) {
				let letters = []
				letters = arr.reduce((letters, item, index, array) => {
					const letter = item.slug.trim().charAt(0).toUpperCase()
					if (letters.indexOf(letter) === -1) {
						letters.push(letter)
					}
					return letters.sort()
				}, [])

				// 分组数量
				let groupSize = 4
				if (letters.length <= 5) {
					groupSize = 1
				} else if (letters.length <= 10) {
					groupSize = 2
				} else if (letters.length <= 15) {
					groupSize = 3
				}
				const groupCount =
					letters % groupSize === 0 ?
					parseInt(letters.length / groupSize) :
					Math.ceil(letters.length / groupSize)

				// 分组
				const groupItems = []
				for (var i = 0; i < groupCount; i++) {
					groupItems.push(letters.slice(i * groupSize, i * groupSize + groupSize))
				}
				const group = {}
				groupItems.forEach((item, index, arr) => {
					const key = item.join('')
					group[key] = item
				})
				return group
			},
			onSort(type) {
				this.SearchCondition.SortType = type
				if (this.SearchCondition.SortType === this.SortType.PriceUp) {
					return this.HotelList.sort(function(a, b) {
						var x = a['minPrice']
						var y = b['minPrice']
						return x > y ? -1 : x < y ? 1 : 0
					})
				} else if (this.SearchCondition.SortType === this.SortType.PriceDown) {
					return this.HotelList.sort(function(a, b) {
						var x = a['minPrice']
						var y = b['minPrice']
						return x < y ? -1 : x > y ? 1 : 0
					})
				} else if (this.SearchCondition.SortType === this.SortType.Comment) {
					return this.HotelList.sort(function(a, b) {
						var x = a['guestOverallRating']
						var y = b['guestOverallRating']
						return x > y ? -1 : x < y ? 1 : 0
					})
				} else if (this.SearchCondition.SortType === this.SortType.default) {
					return this.HotelList.sort(function(a, b) {
						var x = a['minPrice']
						var y = b['minPrice']
						return x > y ? -1 : x < y ? 1 : 0
					})
				}
			},
			onPageChange(index) {
				this.PageIndex = index
				this.fetchHotelList()
				this.$refs.backToTop.backToTop()
			},
			showAmap(hotel) {
				this.currentHotel = hotel
				hotel.longitude = this.currentHotel.longitude
				hotel.latitude = this.currentHotel.latitude
				this.amapVisiable = true
			},
			showCityBox() {
				this.cityVisiable = !this.cityVisiable
			},
			isShowCityLetter(city, cityList, index) {
				// this.allCities = this.allCities.sort((a, b) => {
				//  return [a.pinyin, b.pinyin].sort().shift() === a.pinyin ? -1 : 1
				// })
				if (index === 0) {
					return true
				} else {
					return (
						city.pinyin.charAt(0).toUpperCase() !==
						cityList[index - 1].pinyin.charAt(0).toUpperCase()
					)
				}
			},
			cityItemClick(city) {
				this.TotoalCount = -1

				this.SearchCondition.CityId = city.cityId
				this.SearchCondition.CityName = city.cityName

				this.cityVisiable = false
			},
			priceSetpChange(val) {
				this.SearchCondition.HotelPrice = val
			},
			defaultPriceClick(isDefault) {
				this.priceType = this.PriceType.default
				if (isDefault) {
					this.SearchCondition.HotelPrice = []
				}
			},
			customPriceClick() {
				this.priceType = this.PriceType.custom
				this.SearchCondition.HotelPrice = [0, 0]
			},
			checkDateChange(val) {
				this.SearchCondition.checkDate = val
				this.SearchCondition.checkInDate = this.SearchCondition.CheckInDate[0]
				this.SearchCondition.checkOutDate = this.SearchCondition.CheckInDate[1]
				this.roomNight = moment(this.SearchCondition.checkOutDate).diff(moment(this.SearchCondition.checkInDate),
					'days')
				if (this.roomNight === 0) {
					this.priceCalendar = []
					this.$message.error('请选择不同的入离日期')
					return
				}
				// this.fetchPriceCalendar()
			},
			goHotel(hotelCode) {
				this.SearchCondition.checkInDate = this.SearchCondition.CheckInDate[0]
				this.SearchCondition.checkOutDate = this.SearchCondition.CheckInDate[1]
				debugger
				this.$router.push({
					// path: `/hotel/${hotelCode}`,
					path: `/hotel`,
					query: {
						hotelCode: hotelCode,
						checkInDate: this.SearchCondition.checkInDate,
						checkOutDate: this.SearchCondition.checkOutDate
					}
				})
			},
			goBooking(hotelCode, roomTypeCode, roomID) {
				const base64 = require('js-base64').Base64
				const checkDate = this.SearchCondition.CheckInDate
				this.$router.push({
					path: '/booking',
					query: {
						hotelCode: base64.encode(hotelCode),
						roomTypeCode: base64.encode(roomTypeCode),
						checkDate: base64.encode(checkDate),
						roomID: base64.encode(roomID)
					}
				})
			},
			defaultPosition() {
				this.PositionType = 0
				this.tab = '0'

				this.cleanPosition()
			},
			cleanPosition() {
				this.SearchCondition.HospitalId = ''
				this.SearchCondition.ScenicSpotId = ''
				this.SearchCondition.CollegeId = ''
				this.SearchCondition.AirPortId = ''
				this.SearchCondition.StationId = ''
				this.SearchCondition.BizAreaId = ''
				this.SearchCondition.HotId = ''
				this.SearchCondition.SubWayStatationId = ''
				this.SearchCondition.SubWayLineId = ''
			},
			positionTabClick(tab) {
				this.PositionType = tab.name

				const name = tab.name
				switch (name) {
					case 'hot':
						break
					case 'bizarea':
						break
					case 'station':
						break
					case 'university':
						break
					case 'traffic':
						break
					case 'scenic':
						break
					case 'hospital':
						break
				}
			}
		}
	}
</script>

<style scoped>
	.position {
		font-size: small;
	}

	.position .el-tabs__nav-wrap::after {
		height: 0 !important;
	}

	.position .tabs__header {
		margin: 0 !important;
	}

	.position .el-tabs__item {
		height: 1.875rem !important;
		line-height: 1.5625rem !important;
	}

	.position .el-tabs__header {
		margin: 0;
	}

	.position .el-tabs__content {
		margin-top: 0.625rem;
		/* margin-left: -8rem; */
	}

	.position .el-tabs__nav-prev {
		margin-top: -0.5rem;
	}

	.position .el-tabs__nav-next {
		margin-top: -0.5rem;
	}
</style>
<style scoped>
	.filter-container .el-row {
		margin-bottom: 1.25rem;
		padding-bottom: 0.625rem;
		border-bottom: 1px solid lightgray;
	}

	.filter-container .last-el-row {
		margin-bottom: 0;
		padding-bottom: 0;
		border-bottom: none;
	}

	.sort-content {
		height: 3rem;
		line-height: 1.6rem;
	}

	.sort-content .active {
		color: #1890ff;
	}

	.list-content {
		margin-top: 0.625rem;
	}

	.content {
		/* margin-top: 1.5rem; */
		padding-top: 20px;
		/* padding-bottom: 1.5rem; */
		/* border-bottom: 1px solid #D3D3D3; */
	}
		.content:hover{
			background-color: rgb(250,250,250);
		}
		
		.content>>>.el-divider--horizontal{
			margin-top: 20px;
			margin-bottom: 0;
		}

	.item-img {
		height: 8vw;
		width: 13.5vw;
		border-radius: 0.3rem;
		min-width: 10rem;
		min-height: 6rem;
		position: relative;
		margin: 0 0.5rem;
	}

	.imglength {
		/* position: absolute; */
		/* top: ;
    left: 0;
    bottom: 0; */
		cursor: pointer;
		display: inline-block;
		position: absolute;
		bottom: 0;
		right: 0;
		text-align: center;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		font-size: 12px;
		padding: 5px ;
	}

	.buttonstyle {
		width: 80px;
		height: 35px;
		border: 0;
		height: 35px;
		background: #ff714a;
		border: 0;
		text-align: left;
		margin-left: 2rem;
		margin-top: 1rem;
	}

	.hotel-info {
		/* border-right: 0.0625rem solid lightgrey; */
	}

	.hotel-title {
		color: #1890ff;
		font-size: large;
	}

	.hotel-guestOverallRating {
		color: #f59a38;
		font-size: large;
		cursor: pointer;
	}

	.hoteltp {
		padding: 8px;
		cursor: pointer;
	}

	::v-deep .hotel-cityname {
		font-size: small;
		line-height: 10px;
		margin-top: 8px;
		margin-bottom: 10px;
		font-weight: 400;
		font-family: '微软雅黑';
	}

	::v-deep .hotel-address {
		font-size: small;
		/* height: 15px; */
		/* line-height: 10px; */
		margin: 10px 0;
		font-weight: 400;
		line-height: 20px;
		font-family: '微软雅黑';
	}

	.hotel-service {
	}
	
	.hotel-service .el-tag{
		margin-right: 5px;
	}

	.hotel-comment {
		padding-left: 1rem;
	}

	.hotel-comment .hotel-type {
		font-size: medium;
	}

	.hotel-comment .hotel-price {
		color: #ff714a;
		font-size: xx-large;
		word-break: keep-all;
		white-space: nowrap;
	}

	.hotel-price-tip {
		font-size: small;
		color: #ff714a;
		font-weight: 500;
		cursor: default;
	}

	.date {
		display: flex;
	}

	.onloading {
		height: 12.5rem;
	}

	.goods-price {
		color: red;
		font-size: medium;
	}

	.city-box .el-col {
		height: 2rem;
	}

	.el-carousel__item h3 {
		color: #475669;
		font-size: 14px;
		opacity: 0.75;
		line-height: 150px;
		margin: 0;
	}

	.el-carousel__item:nth-child(2n) {
		background-color: #99a9bf;
	}

	.el-carousel__item:nth-child(2n + 1) {
		background-color: #d3dce6;
	}

	.el-range-editor.el-input__inner {
		width: 239px;
	}

	.view-map {
		margin-left: 10px;
	}
</style>
