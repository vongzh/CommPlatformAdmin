<template>
  <div class="content">
    <el-row>
      <el-col :span="6" class="content-left">
        <el-card>
          <el-row>
            <el-image
              class="img"
              :src="RoomType.roomTypeImgs && RoomType.roomTypeImgs.length>0?RoomType.roomTypeImgs[0].imgUrl:''"
              :preview-src-list="RoomType.roomTypeImgs && RoomType.roomTypeImgs.length>0?RoomType.roomTypeImgs.map((v,i,a)=>{ return v.imgUrl }):[]"
            >
              <div
                slot="error"
                style="height: 100%;background-color: #F5F7FA;color: #C0C4CC;padding-left: 45%;padding-top: 20%;"
              >
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </el-row>
          <el-row class="border-bottom detail">
            <el-link :underline="false" class="title">订单信息</el-link>
            <el-row>
              <el-col :span="6">
                <el-link :underline="false">日期</el-link>
              </el-col>
              <el-col :span="16">
                <el-link :underline="false">{{ Order.checkInDate }} 至 {{ Order.checkOutDate }}</el-link>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-link :underline="false">数量</el-link>
              </el-col>
              <el-col :span="16">
                <el-link :underline="false">{{ Order.roomCount }}</el-link>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col :span="6">
                <el-link :underline="false">单价</el-link>
              </el-col>
              <el-col :span="16">
                <el-link :underline="false">{{ Order.price }}</el-link>
              </el-col>
            </el-row>-->
            <el-row>
              <el-col :span="6">
                <el-link :underline="false">总价</el-link>
              </el-col>
              <el-col :span="16">
                <el-link
                  :underline="false"
                  class="total-price"
                  type="danger"
                >￥{{ Order.orderAmount }}</el-link>
              </el-col>
            </el-row>
          </el-row>
          <el-row class="border-bottom detail">
            <el-link :underline="false" class="title">价格日历</el-link>
            <el-row>
              <el-col :span="16">
                <el-link :underline="false">日期</el-link>
              </el-col>
              <el-col :span="8" />
              <el-col :span="4">
                <el-link :underline="false">价格</el-link>
              </el-col>
            </el-row>
            <template v-for="cp in priceCalendar.calendar">
              <el-row :key="cp.date">
                <el-col :span="16">
                  <el-link :underline="false">{{ cp.date }}</el-link>
                </el-col>
                <el-col :span="8" />
                <el-col :span="4">
                  <el-link :underline="false">￥{{ cp.price }}</el-link>
                </el-col>
              </el-row>
            </template>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="18" class="content-left">
        <el-card>
          <el-row class="border-bottom" style="padding-bottom:1rem">
            <el-link :underline="false" class="title">{{ Hotel.hotelName }}</el-link>
            <el-link :underline="false" class="text">{{ Hotel.hotelAddress }}</el-link>
          </el-row>
          <el-row class="border-bottom detail">
            <el-row>
              <el-link :underline="false" class="sub-title">{{ RoomInfo.roomTypeName }}</el-link>
            </el-row>
            <el-row style="margin-left:5rem;">
              <el-col :span="8">
                <el-row>
                  <el-col :span="5">
                    <el-link :underline="false">面积</el-link>
                  </el-col>
                  <el-col :span="6">
                    <el-link :underline="false">{{ RoomInfo.areaRange }}</el-link>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">
                    <el-link :underline="false">窗户</el-link>
                  </el-col>
                  <el-col :span="6">
                    <el-link :underline="false">{{ RoomInfo.windowDesc }}</el-link>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">
                    <el-link :underline="false">床型</el-link>
                  </el-col>
                  <el-col :span="6">
                    <el-link :underline="false">{{ RoomInfo.bedTypeName }}</el-link>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="8">
                <el-row>
                  <el-col :span="5">
                    <el-link :underline="false">网络</el-link>
                  </el-col>
                  <el-col :span="6">
                    <el-link :underline="false">{{ RoomInfo.netDesc }}</el-link>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">
                    <el-link :underline="false">可住</el-link>
                  </el-col>
                  <el-col :span="6">
                    <el-link :underline="false">{{ RoomInfo.liveInCount }}</el-link>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="5">
                    <el-link :underline="false">早餐</el-link>
                  </el-col>
                  <el-col :span="6">
                    <el-link :underline="false">{{ RoomInfo.breakfastDesc }}</el-link>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <el-row style="margin-left:5rem;">
              <el-col :span="5">
                <el-link :underline="false">面积</el-link>
              </el-col>
              <el-col :span="6">
                <el-link :underline="false">{{ RoomInfo.areaRange }}</el-link>
              </el-col>
              <el-col :span="5">
                <el-link :underline="false">网络</el-link>
              </el-col>
              <el-col :span="6">
                <el-link :underline="false">{{ RoomInfo.netDesc }}</el-link>
              </el-col>
            </el-row>
            <el-row style="margin-left:5rem;">
              <el-col :span="5">
                <el-link :underline="false">窗户</el-link>
              </el-col>
              <el-col :span="6">
                <el-link :underline="false">{{ RoomInfo.windowDesc }}</el-link>
              </el-col>
              <el-col :span="5">
                <el-link :underline="false">可住</el-link>
              </el-col>
              <el-col :span="6">
                <el-link :underline="false">{{ RoomInfo.liveInCount }}</el-link>
              </el-col>
            </el-row>
            <el-row style="margin-left:5rem;">
              <el-col :span="5">
                <el-link :underline="false">床型</el-link>
              </el-col>
              <el-col :span="6">
                <el-link :underline="false">{{ RoomInfo.bedTypeName }}</el-link>
              </el-col>
              <el-col :span="5">
                <el-link :underline="false">早餐</el-link>
              </el-col>
              <el-col :span="6">
                <el-link :underline="false">{{ RoomInfo.breakfastDesc }}</el-link>
              </el-col>
            </el-row>-->
          </el-row>
          <el-row class="booking border-bottom">
            <el-link :underline="false" class="title">预订信息</el-link>
            <el-row class="first-row">
              <el-col :span="6">
                <el-link :underline="false" class="right-text">房型名称</el-link>
              </el-col>
              <el-col :span="10">
                <el-link :underline="false" class="right-text">{{ RoomInfo.roomTypeName }}</el-link>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-link :underline="false" class="right-text">入离日期</el-link>
              </el-col>
              <el-col :span="10">
                <el-date-picker
                  v-model="checkDate"
                  :picker-options="pickerOptions"
                  type="daterange"
                  :editable="false"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  start-placeholder="入住"
                  end-placeholder="离店"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-link :underline="false" class="right-text">房间数量</el-link>
              </el-col>
              <el-col :span="10">
                <el-input-number v-model="Order.roomCount" :min="1" :max="5" />
              </el-col>
            </el-row>
          </el-row>
          <el-row class="booking border-bottom">
            <el-link :underline="false" class="title">入住信息</el-link>
            <el-row class="first-row">
              <el-col :span="6">
                <el-link :underline="false" class="right-text">入住人</el-link>
              </el-col>
              <el-col :span="6">
                <el-input v-model="checkInName[0]" placeholder="每间需要填写1人姓名" clearable />
              </el-col>
            </el-row>
            <el-row v-for="i in Order.roomCount - 1" :key="i">
              <el-col :span="6">
                <el-link :underline="false" class="right-text">入住人 {{ i + 1 }}</el-link>
              </el-col>
              <el-col :span="6">
                <el-input v-model="checkInName[i]" placeholder="每间需要填写1人姓名" clearable />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-link :underline="false" class="right-text">联系手机</el-link>
              </el-col>
              <el-col :span="6">
                <el-input v-model="Order.checkInPhone" placeholder="用于接收短信通知" clearable />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-link :underline="false" class="right-text">预计到店</el-link>
              </el-col>
              <el-col :span="6">
                <el-time-select
                  v-model="Order.arrivalTime"
                  :picker-options="{start: '14:00',step: '00:30',end: '23:30'}"
                  placeholder="选择时间"
                />
              </el-col>
            </el-row>
          </el-row>
          <el-row class="booking border-bottom">
            <el-link :underline="false" class="title">取消规则</el-link>
            <el-row class="first-row">
              <el-col :span="6">
                <el-link :underline="false" class="right-text">规则</el-link>
              </el-col>
              <el-col :span="12">
                <el-link :underline="false" class="right-text">入住前三天18:00前可取消</el-link>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-link :underline="false" class="right-text">发票</el-link>
              </el-col>
              <el-col :span="12">
                <el-link :underline="false" class="right-text">如需发票,请向酒店前台索取</el-link>
              </el-col>
            </el-row>
          </el-row>
          <el-row class="submit">
            <el-button type="primary" plain @click="submitOrder">提交订单</el-button>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { GetHotel } from '@/api/hotel/hotel'
import { CreateOrder } from '@/api/order/order'
import moment from 'moment'
export default {
  // name: 'Booking',
  data() {
    return {
      Order: {
        hotelCode: 0,
        roomTypeCode: 0,
        roomID: 0,
        price: 0,
        roomCount: 1,
        orderAmount: 0
      },
      Hotel: {
        images: []
      },
      RoomInfo: {
        salePrice: 0
      },
      RoomType: {
        roomTypeImgs: [],
        roomTypeRelevantFacilities: []
      },
      priceCalendar: {
        canBooking: false,
        calendar: []
      },
      checkDate: [],
      checkInName: [],
      pickerOptions: {
        disabledDate(date) {
          const startDate = moment().format('YYYYMMDD')
          const currentDate = moment(date).format('YYYYMMDD')
          const endDate = moment()
            .add(30, 'd')
            .format('YYYYMMDD')
          return !(currentDate >= startDate && endDate >= currentDate)
        }
      }
    }
  },
  watch: {
    checkDate: {
      handler(val, oldval) {
        this.Order.checkInDate = this.checkDate[0]
        this.Order.checkOutDate = this.checkDate[1]

        this.fetchPriceCalendar()
      },
      deep: true
    },
    'Order.roomCount': {
      handler(count, oldCount) {
        this.calcTotalAmt()
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.getUrlParams()) {
        this.fetchHotelInfo()
        this.fetchPriceCalendar()
      }
    },
    getUrlParams() {
      const query = this.$route.query
      if (!query || !query.hotelCode || !query.roomTypeCode || !query.roomID) {
        this.$alert('请返回重试', '预订失败', {
          confirmButtonText: '确定',
          type: 'error',
          callback: action => {
            this.$router.push({ path: '/hotellist' })
          }
        })
        return false
      }

      this.Order.hotelCode = query.hotelCode
      this.Order.roomTypeCode = query.roomTypeCode
      this.Order.roomID = query.roomID
      this.checkDate = query.checkInDate

      return true
    },
    fetchHotelInfo() {
      const hotelCode = this.Order.hotelCode
      GetHotel({
        hotelCode
      }).then(res => {
        this.Hotel = res.data

        if (this.Hotel.roomTypes && this.Hotel.roomTypes.length > 0) {
          this.RoomType = this.Hotel.roomTypes.find((value, index, array) => {
            return value.roomTypeCode === this.Order.roomTypeCode
          })
        }
        if (this.Hotel.roomQuotedPrices && this.Hotel.roomQuotedPrices.length > 0) {
          this.RoomInfo = this.Hotel.roomQuotedPrices.find(
            (value, index, array) => {
              return value.roomID === this.Order.roomID
            }
          )
        }
      })
    },
    fetchPriceCalendar() {
      const checkDates = []
      const days = moment(this.Order.checkOutDate).diff(moment(this.Order.checkInDate), 'days')
      for (var i = 0; i < days; i++) {
        checkDates.push((moment(this.Order.checkInDate).add(i, 'day')).format('YYYY-MM-DD'))
      }

      this.priceCalendar = {
        canBooking: true,
        calendar: checkDates.map((item, index) => {
          return { date: item, price: 100 + ((index + 1) * 100 / 10) }
        })
        // [
        //   { date: '2020-04-24', price: 100.00 },
        //   { date: '2020-04-25', price: 100.00 },
        //   { date: '2020-04-26', price: 200.00 },
        //   { date: '2020-04-27', price: 300.00 }
        // ]
      }

      this.calcTotalAmt()
    },
    calcTotalAmt() {
      if (this.priceCalendar.canBooking) {
        if (this.priceCalendar.calendar.length > 0) {
          let allDayPrice = 0
          const count = this.Order.roomCount
          this.priceCalendar.calendar.forEach((item, index, arr) => {
            allDayPrice += item.price
          })
          this.Order.orderAmount = allDayPrice * count
        }
      }
    },
    submitOrder() {
      const order = this.Order
      order.personCount = this.checkInName.length
      order.checkInName = this.checkInName.join()
      order.hotelName = this.Hotel.hotelName
      order.hotelCode = this.Hotel.hotelCode
      order.roomPrice = this.RoomInfo.salePrice
      order.roomTypeCode = this.RoomInfo.roomTypeCode
      order.roomTypeName = this.RoomInfo.roomTypeName
      order.breakFastNum = this.RoomInfo.numberOfBreakfast
      order.roomID = this.RoomInfo.roomID

      CreateOrder(order).then(res => {
        if (res.data) {
          const result = res.data.item1
          if (result) {
            this.$alert('去支付', '预订成功', {
              confirmButtonText: '去支付',
              type: 'info',
              callback: action => {
                const orderNo = res.data.item2
                this.$store.dispatch('tagsView/delView', this.$route)
                this.toPay(orderNo)
              }
            })
          } else {
            this.$message.error('预订失败')
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    toPay(orderNo) {
      this.$router.push({
        path: '/payment',
        query: { orderNo }
      })
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
  border-radius: 0.2rem;
}

.title {
  margin-top: 2rem;
  color: black;
  font-size: x-large;
}

.sub-title {
  margin-top: 1rem;
  color: black;
  font-size: larger;
}

.text {
  margin-top: 2.6rem;
  margin-left: 5px;
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

.booking .el-row {
  height: 2rem;
  padding-left: 5rem;
  margin-top: 1rem;
}

.right-text {
  font-size: large;
}

.booking .first-row {
  margin-top: 2rem;
}

.submit {
  margin-left: 5rem;
  margin-top: 1rem;
}
</style>
