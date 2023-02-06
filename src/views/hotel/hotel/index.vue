<template>
  <div class="content">
    <el-collapse value="search">
      <el-collapse-item name="search">
        <span slot="title" class="collapse-title">酒店搜索</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="酒店名称" prop="hotelName">
                <el-input v-model="searchCondition.hotelName" clearable placeholder="酒店名" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="酒店电话" prop="hotelPhone">
                <el-input v-model="searchCondition.hotelPhone" clearable placeholder="酒店电话" class="filter-item input-search" />
              </el-form-item>
            </el-form>
            <div class="tools-btn">
              <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="searchHotels()">搜索</el-button>
              <el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close" @click="resetForm('searchForm')">重置</el-button>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-card>
      <div class="tools">
        <el-button-group>
          <el-button v-waves size="medium" icon="el-icon-plus" />
          <el-button v-waves size="medium" icon="el-icon-refresh" @click="fetchHotelList()" />
        </el-button-group>
      </div>
      <div>
        <el-table v-loading="hotelOnLoading" :data="hotelList" :fit="true" border stripe highlight-current-row>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.roomTypes" :fit="true" border stripe highlight-current-row>
                <!-- <el-table-column type="expand">
                  <template slot-scope="props" />
                </el-table-column> -->
                <el-table-column prop="roomTypeCode" label="房型编号" width="120" />
                <el-table-column prop="roomTypeName" label="房型名称" />
                <el-table-column prop="windowDesc" label="窗户" width="60" />
                <el-table-column prop="tolietDesc" label="卫浴" width="60" />
                <el-table-column prop="floor" label="楼层" width="60" />
                <el-table-column label="操作" width="60">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" style="color: #13CE66;">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="hotelCode" label="酒店编号" width="85" />
          <el-table-column prop="hotelName" label="酒店名称" />
          <el-table-column prop="hotelPhone" label="酒店电话" />
          <el-table-column prop="hotelAddress" label="酒店地址" />
          <el-table-column prop="hotelLocation" label="酒店经纬度">
            <template slot-scope="scope">
              <el-link>{{ scope.row.longitude }}/{{ scope.row.latitude }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="typeName" label="酒店类型" width="80" />
          <el-table-column label="操作" width="155">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goHotel(scope.row.hotelCode)">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
              <el-button type="text" size="small">新增房型</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 0.625rem;">
        <el-pagination
          background
          layout="sizes,total, prev, pager, next, jumper"
          :total="totalCount"
          :page-size="pageSize"
          :current-page="pageIndex"
          :page-sizes="[10,20, 50, 100]"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { GetAllHotelList } from '@/api/hotel/hotel'
import waves from '@/directive/waves'
import { deepClone } from '@/utils/index'
export default {
  name: 'HotelManager',
  directives: {
    waves
  },
  data() {
    return {
      pageSize: 10,
      pageIndex: 1,
      searchCondition1: {
        hotelName: '',
        hotelPhone: ''
      },
      searchCondition: {
        hotelName: '',
        hotelPhone: ''
      },
      hotelOnLoading: false,
      hotelList: [],
      totalCount: 0
    }
  },
  created() {
    this.fetchHotelList()
  },
  methods: {
    searchHotels() {
      this.searchCondition1 = deepClone(this.searchCondition)
      this.pageIndex = 1
      this.fetchHotelList()
    },
    fetchHotelList() {
      const that = this
      const param = { ...this.searchCondition1,
        PageSize: this.pageSize,
        PageIndex: this.pageIndex
      }

      this.hotelOnLoading = true
      GetAllHotelList(param).then(res => {
        that.hotelList = res.data.rows
        that.totalCount = res.data.total

        this.hotelOnLoading = false
      })
    },
    handlePageChange(index) {
      this.pageIndex = index
      this.fetchHotelList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.fetchHotelList()
    },
    resetForm(form) {
      this.$refs[form].resetFields()
    },
    goHotel(hotelCode) {
      this.$router.push({
        path: `/hotel/${hotelCode}`
      })
    }
  }
}
</script>

<style>
.el-table__expanded-cell{
   margin: 0 !important;
   padding: 0 !important;
 }
</style>

<style scoped>
.content{
  margin: 10px;
}
</style>
