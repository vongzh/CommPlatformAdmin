<template>
  <el-amap :vid="vid" :events="events" :zoom="15" :center="center" :plugin="plugin" class="amap-container">
    <el-amap-marker vid="hotel-position" :position="center" />
    <el-amap-info-window :position="center" :content="label" />
  </el-amap>
</template>

<script>
import Vue from 'vue'
import VUEAMap from 'vue-amap'

export default {
  name: 'Amap',
  props: {
    hotel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      vid: 'hotel-map',
      events: {
        init: (o) => {

        }
      },
      plugin: [
        'Scale',
        {
          pName: 'Geolocation',
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 100, // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0, // 定位结果缓存0毫秒，默认：0
          convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, // 显示定位按钮，默认：true
          buttonPosition: 'RB', // 定位按钮停靠位置，默认：'LB'，左下角
          showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
          extensions: 'all'
        }
      ]
    }
  },
  computed: {
    label() {
      return '酒店名：' + this.hotel.hotelName + '</br>' + '酒店地址：' + this.hotel.hotelAddress
    },
    center() {
      return [this.hotel.longitude, this.hotel.latitude]
    }
  },
  created() {
    Vue.use(VUEAMap)
    VUEAMap.initAMapApiLoader({
      key: '02f9163d403c04a5408ebb7066fcd2fd',
      plugin: [
        'AMap.Scale',
        'AMap.Geolocation'
      ]
    })
  }
}
</script>

<style scoped>
  .amap-container {
    height: 30rem;
    width: 52.5rem;
  }

  .amap-logo {
    display: none;
    opacity: 0 !important;
  }

  .amap-copyright {
    opacity: 0;
  }
</style>
