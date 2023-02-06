<template>
  <div class="content">
    <el-card class="hotel">
      <el-row>
        <el-link :underline="false" class="hotelName">{{ hotel.hotelName }}</el-link><span class="hotel-type">{{ hotel.typeName }}</span>
      </el-row>
      <el-row>
        <span>酒店地址：</span>
        <el-link class="hotel-address" :underline="false">{{ hotel.hotelAddress }}
          <el-link class="view-map" type="primary" @click="showAmap">查看地图 <i class="el-icon-map-location" /></el-link>
        </el-link>
      </el-row>
      <el-row>
        <span>酒店电话：</span>
        <el-link :underline="false">{{ hotel.hotelPhone }}</el-link>
      </el-row>
      <el-row class="hotel-service">
        <span>服务保障：</span>
        <i class="el-icon-light-rain"> 热水</i>
        <i class="el-icon-lightning"> 冷水</i>
        <i class="el-icon-heavy-rain"> 温水</i>
        <i class="el-icon-sunrise"> 冰水</i>
        <i class="el-icon-cloudy-and-sunny"> 开水</i>
      </el-row>
    </el-card>
    <el-card>
      <div v-for="roomInfo in hotel.roomQuotedPrices" :key="roomInfo.roomID" class="roomType">
        <el-row>
          <el-col :xl="3" :sm="6">
            <el-image class="item-img" :src="hotel.roomTypes.filter((value, index) => value.roomTypeCode==roomInfo.roomTypeCode )[0].roomTypeImgs && hotel.roomTypes.filter((value, index) => value.roomTypeCode==roomInfo.roomTypeCode )[0].roomTypeImgs.length>0?hotel.roomTypes.filter((value, index) => value.roomTypeCode==roomInfo.roomTypeCode )[0].roomTypeImgs[0].imgUrl:''" :preview-src-list="hotel.roomTypes.filter((value, index) => value.roomTypeCode==roomInfo.roomTypeCode )[0].roomTypeImgs && hotel.roomTypes.filter((value, index) => value.roomTypeCode==roomInfo.roomTypeCode )[0].roomTypeImgs.length>0?hotel.roomTypes.filter((value, index) => value.roomTypeCode==roomInfo.roomTypeCode )[0].roomTypeImgs.map((v,i,a)=>{ return v.imgUrl }):[]">
              <div slot="error" style="height: 100%;background-color: #F5F7FA;color: #C0C4CC;padding-left: 45%;padding-top: 20%;">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </el-col>
          <el-col :xl="20" :sm="18">
            <el-row>
              <el-link class="roomtype-name">{{ roomInfo.roomTypeName }}</el-link>
            </el-row>
            <el-row class="devices">
              <el-col :xl="3" :sm="5">
                <span>面积</span>
                <el-link class="device">{{ roomInfo.areaRange }}m²</el-link>
              </el-col>
              <el-col :xl="1" :sm="1">
                <el-divider direction="vertical" />
              </el-col>
              <el-col :xl="3" :sm="4">
                <span>卫浴</span>
                <el-link class="device">{{ roomInfo.tolietDesc === '未知'?'-':roomInfo.tolietDesc }}</el-link>
              </el-col>
              <el-col :xl="1" :sm="1">
                <el-divider direction="vertical" />
              </el-col>
              <el-col :xl="3" :sm="6">
                <span>窗户</span>
                <el-link class="device">{{ roomInfo.windowDesc }}</el-link>
              </el-col>
            </el-row>
            <el-row class="devices">
              <el-col :xl="3" :sm="5">
                <span>可住</span>
                <el-link class="device">{{ roomInfo.liveInCount }}</el-link>
              </el-col>
              <el-col :xl="1" :sm="1">
                <el-divider direction="vertical" />
              </el-col>
              <el-col :xl="3" :sm="6">
                <span>床型</span>
                <el-link class="device">{{ roomInfo.bedTypeName }}</el-link>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row v-if="roomInfo.salePrice>0" class="plan">
          <el-col :xl="2" :sm="4">{{ roomInfo.bedTypeName }}</el-col>
          <el-col :xl="2" :sm="4">{{ roomInfo.breakfastDesc }}</el-col>
          <el-col :xl="2" :sm="4">不可取消</el-col>
          <el-col :xl="2" :sm="4" class="price">￥{{ roomInfo.salePrice }}</el-col>
          <el-col :xl="2" :sm="4">
            <el-button type="primary" size="mini" @click="goBooking(hotel.hotelCode,roomInfo.roomTypeCode,roomInfo.roomID)">预定</el-button>
          </el-col>
        </el-row>
        <el-divider />
      </div>
    </el-card>
    <el-card class="hotel-info">
      <div slot="header">
        <span>酒店信息<el-link type="info" class="aptitude">（资质）</el-link></span>
      </div>
      <el-row>
        <el-col :span="2">酒店电话</el-col>
        <el-col :span="18"><span>{{ hotel.hotelPhone }}</span></el-col>
      </el-row>
      <el-divider />
      <el-row>
        <el-col :span="2">酒店信息</el-col>
        <el-col :span="18"><span>{{ dateToYMD(hotel.decorateDate) }}年装修 / {{ dateToYMD(hotel.openDate) }}年开业</span></el-col>
      </el-row>
      <el-divider />
      <el-row>
        <el-col :span="2">酒店简介</el-col>
        <el-col :span="18"><span class="hotel-desc">{{ hotel.desc }}</span></el-col>
      </el-row>
    </el-card>

    <el-dialog :visible.sync="amapVisiable" title="酒店位置" width="55rem">
      <AMap :hotel="hotel" />
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import AMap from '@/components/Amap'
import { GetHotel } from '@/api/hotel/hotel'
export default {
  components: {
    AMap
  },
  data() {
    return {
      hotel: {
        roomTypes: []
      },
      amapVisiable: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.getUrlParams()) {
        this.fetchHotel()
      }
    },
    getUrlParams() {
      const query = this.$route.query
      if (!query || !query.hotelCode) {
        this.$alert('请返回重试', '酒店查询失败', {
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
      this.hotel.hotelCode = query.hotelCode
      return true
    },
    showAmap() {
      this.amapVisiable = true
    },
    fetchHotel() {
      const hotelCode = this.hotel.hotelCode
      GetHotel({ hotelCode }).then(res => {
        this.hotel = res.data
      })
    },
    dateToYMD(val) {
      if (val) { return moment(val).format('YYYY年MM月') }
    },
    goBooking(hotelCode, roomTypeCode, roomID) {
      const startDate = moment().format('YYYY-MM-DD')
      const endDate = moment().add(1, 'd').format('YYYY-MM-DD')
      const checkDate = [startDate, endDate]
      this.$router.push({
        path: '/booking',
        query: {
          hotelCode,
          roomTypeCode,
          checkDate,
          roomID
        }
      })
    }
  }
}
</script>

<style scoped>
  .content {
    padding: 5px;
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

  .item-img {
    height: 6rem;
    width: 12rem;
    border-radius: 3px;
    position: relative;
  }


  .roomtype-name {
    color: #001528;
    font-size: large;
  }

  .devices {
    margin-top: 10px;
    font-size: medium;
  }

  .devices .el-row {
    margin-bottom: 10px;
  }

  .device {
    margin-left: 0.3125rem;
  }

  .roomType {
    margin-bottom: 50px;
  }

  .plan {
    margin-top: 1rem;
    margin-left: 11%;
    height: 40px;
    line-height: 40px;
    font-size: medium;
  }

  .price {
    font-size: large;
    color: #1890FF;
  }

  .hotel-info .el-row {
    font-size: small;
    margin-bottom: 15px;
  }

  .aptitude {
    margin-left: 5px;
  }

  .hotel-desc{
    font-size: small;
  }
</style>
