<template>
  <div class="content">
    <el-collapse value="search">
      <el-collapse-item name="search">
        <span slot="title" class="collapse-title">黑名单列表</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="酒店名称" prop="hotelName">
                <el-input v-model="searchCondition.hotelName" clearable placeholder="酒店名" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="黑名单类型" prop="blacklistType">
                <el-select v-model="searchCondition.blacklistType" clearable>
                  <el-option :value="1" label="临时" />
                  <el-option :value="2" label="永久" />
                </el-select>
              </el-form-item>
              <el-form-item label="黑名单状态" prop="blacklistStatus">
                <el-select v-model="searchCondition.blacklistStatus" clearable>
                  <el-option :value="1" label="生效" />
                  <el-option :value="2" label="暂停" />
                  <el-option :value="-1" label="过期" />
                </el-select>
              </el-form-item>
            </el-form>
            <div class="tools-btn">
              <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="searchHotelBlacks()">搜索</el-button>
              <el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close" @click="resetForm('searchForm')">重置</el-button>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-card>
      <div class="tools">
        <el-button-group>
          <!-- <el-button v-waves size="medium" icon="el-icon-plus" /> -->
          <el-button v-waves size="medium" icon="el-icon-refresh" @click="fetchHotelBlackList()" />
        </el-button-group>
      </div>
      <div>
        <el-table v-loading="onLoading" :data="hotelList" :fit="true" border stripe highlight-current-row>
          <el-table-column prop="hotelCode" label="酒店编号" width="100" />
          <el-table-column prop="hotelName" label="酒店名称" />
          <el-table-column prop="backlistTypeDesc" label="黑名单类型" width="100">
            <template v-slot="scope">
              <el-tag :type="scope.row.backlistType===BacklistType.PERPETUAL?'danger':'warning'">{{ scope.row.backlistTypeDesc }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="backlistStausDesc" label="黑名单状态" width="100">
            <template v-slot="scope">
              <el-tag :type="blackStatusTag(scope.row.backlistStaus)">{{ scope.row.backlistStausDesc }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="backlistReasonDesc" label="黑名单原因" width="100">
            <template v-slot="scope">
              <el-tag>{{ scope.row.backlistReasonDesc }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="backlistStart" label="开始时间" width="145">
            <template v-slot="scope">
              <el-link :underline="false" style="color: darkgrey;font-size: small;">{{ scope.row.backlistStart }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="backlistEnd" label="结束时间" width="145">
            <template v-slot="scope">
              <el-link :underline="false" style="color: darkgrey;font-size: small;">{{ scope.row.backlistEnd }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="blackTime" label="拉黑时间" width="145">
            <template v-slot="scope">
              <el-link :underline="false" style="color: darkgrey;font-size: small;">{{ scope.row.blackTime }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button v-if="scope.row.backlistStaus === BacklistStatus.EFFECT" type="danger" size="mini" @click="handlerEffect(scope.row.id)">暂停</el-button>
              <el-button v-if="scope.row.backlistStaus === BacklistStatus.STOP" type="warning" size="mini" @click="handlerEffect(scope.row.id)">启用</el-button>
              <!-- <el-button type="danger" size="mini">删除</el-button> -->
              <!-- <el-button type="primary" size="mini">编辑</el-button> -->
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
          :page-sizes="[10,20,50, 100]"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { GetHotelBlackList, EffectHotelBlack } from '@/api/hotel/hotel'
import waves from '@/directive/waves'
import { deepClone } from '@/utils/index'
export default {
  name: 'HotelBlackList',
  directives: {
    waves
  },
  data() {
    return {
      pageSize: 10,
      pageIndex: 1,
      searchCondition1: {
        hotelName: '',
        blacklistType: '',
        blacklistStatus: ''
      },
      searchCondition: {
        hotelName: '',
        blacklistType: '',
        blacklistStatus: ''
      },
      onLoading: false,
      hotelList: [],
      totalCount: 0,
      BacklistType: {
        TIMESPSN: 1,
        PERPETUAL: 2
      },
      BacklistStatus: {
        OVERDUE: -1,
        EFFECT: 1,
        STOP: 2
      }
    }
  },
  created() {
    this.fetchHotelBlackList()
  },
  methods: {
    searchHotelBlacks() {
      this.searchCondition1 = deepClone(this.searchCondition)
      this.pageIndex = 1
      this.fetchHotelBlackList()
    },
    fetchHotelBlackList() {
      const that = this
      const param = { ...this.searchCondition1,
        PageSize: this.pageSize,
        PageIndex: this.pageIndex
      }

      this.onLoading = true
      GetHotelBlackList(param).then(res => {
        that.hotelList = res.data.rows
        that.totalCount = res.data.total

        this.onLoading = false
      })
    },
    handlerEffect(id) {
      EffectHotelBlack(id).then(res => {
        if (res.data) {
          this.fetchHotelBlackList()
          this.$message({ type: 'success', message: '操作成功' })
        } else {
          this.$message({ type: 'warning', message: '操作失败' })
        }
      })
    },
    handlePageChange(index) {
      this.pageIndex = index
      this.fetchHotelBlackList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.fetchHotelBlackList()  
    },
    blackStatusTag(val) {
      switch (val) {
        case this.BacklistStatus.EFFECT:
          return 'success'
        case this.BacklistStatus.OVERDUE:
          return 'danger'
        case this.BacklistStatus.STOP:
          return 'warning'
      }
    },
    goHotel(hotelCode) {
      this.$router.push({
        path: `/hotel/${hotelCode}`
      })
    },
    resetForm(form) {
      this.$refs[form].resetFields()
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
