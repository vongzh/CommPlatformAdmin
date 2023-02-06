<template>
  <div class="content">
    <el-collapse value="search">
      <el-collapse-item name="search">
        <span slot="title" class="collapse-title">酒店列表</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="酒店名称" prop="hotelName">
                <el-input v-model="searchCondition.hotelName" clearable placeholder="酒店名" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="平台" prop="platform">
                <el-select v-model="searchCondition.platform" clearable>
						<el-option :label="item.dictLabel" :value="item.dictValue"
							v-for="(item,index) in merchantsDict" />
                </el-select>
              </el-form-item>
              <el-form-item label="在线状态" prop="isOnLine">
                <el-select v-model="searchCondition.isOnLine" clearable>
                  <el-option :value="1" label="在线" />
                  <el-option :value="0" label="不在线" />
                </el-select>
              </el-form-item>
            </el-form>
            <div class="tools-btn">
              <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="searchHotelMappings()">搜索</el-button>
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
          <el-button v-waves size="medium" icon="el-icon-refresh" @click="fetchHotelMappingList()" />
        </el-button-group>
      </div>
      <div>
        <el-table v-loading="hotelOnLoading" :data="hotelList" :fit="true" border stripe highlight-current-row>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.roomTypeMappingInfos" :fit="true" border stripe highlight-current-row>
                <el-table-column type="expand">
                  <template slot-scope="props" />
                </el-table-column>
                <el-table-column prop="roomTypeCode" label="房型编号" width="120" />
                <el-table-column prop="roomTypeName" label="房型名称" />
                <el-table-column prop="platformRoomTypeId" label="平台房型编号" width="120" />
                <el-table-column prop="platformRoomTypeName" label="平台房型名称" />
                <el-table-column label="在线状态">
                  <template v-slot="scope">
                    <el-tag effect="plain" :type="scope.row.isOnline === YN.Y?'success':'danger'">{{ scope.row.isOnline === YN.Y?'在线':'不在线' }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="匹配状态">
                  <template v-slot="scope">
                    <el-tag effect="plain" :type="scope.row.matchStatus === YN.Y?'success':'danger'">{{ scope.row.matchStatus === YN.Y?'是':'否' }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" style="color: #13CE66;">编辑</el-button>
                    <el-button type="text" size="small" style="color: #13CE66;" @click="setRoomTypeOnLineStatus(scope.row.id)">上下架</el-button>
                    <el-button type="text" size="small" style="color: #13CE66;" @click="handlerRoomTypeBlack(props.row,scope.row)">黑名单</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="hotelCode" label="酒店编号" width="100" />
          <el-table-column prop="platformHotelName" label="平台酒店名称" />
          <el-table-column prop="platformHotelPhone" label="平台酒店电话" />
          <el-table-column prop="hotelName" label="酒店名称" />
          <el-table-column prop="hotelPhone" label="酒店电话" />
          <el-table-column prop="platformAddress" label="平台酒店地址" />
          <el-table-column prop="isOnLine" label="是否在线" width="104">
            <template v-slot="scope">
              <el-tag effect="plain" :type="scope.row.isOnLine === YN.Y?'success':'danger'">{{ scope.row.isOnLine === YN.Y?'在线':'不在线' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="platformId" label="平台" width="104">
            <template v-slot="scope">
              <el-tag type="info">{{ scope.row.platformDesc }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goHotel(scope.row.hotelCode)">查看</el-button>
              <el-button type="text" size="small" />
              <el-button type="text" size="small" @click="setHotelOnLineStatus(scope.row.id)">上下架</el-button>
              <el-button type="text" size="small" @click="handlerblack(scope.row)">黑名单</el-button>
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
    <el-dialog :visible="blackFormVisiable" title="酒店黑名单" @close="closeHotelBlack()">
      <el-form ref="blackForm" :model="hotelBlack" label-width="100px">
        <el-form-item label="酒店名称" prop="hotelName">
          <el-col :span="16">
            <el-input v-model="hotelBlack.hotelName" readonly disabled />
          </el-col>
        </el-form-item>
        <el-form-item label="拉黑原因" prop="backlistReason">
          <el-select v-model="hotelBlack.backlistReason" placeholder="拉黑原因">
            <el-option label="酒店" :value="1" />
            <el-option label="平台" :value="3" />
            <el-option label="价格" :value="5" />
          </el-select>
        </el-form-item>
       <el-form-item label="平台" prop="targetPlatformId">
          <el-select v-model="hotelBlack.targetPlatformId" clearable>
            <el-option :label="item.dictLabel" :value="item.dictValue"
              v-for="(item,index) in merchantsDict" />
          </el-select>
        </el-form-item>

        <el-form-item label="黑名单类型" prop="backlistType">
          <el-radio-group v-model="hotelBlack.backlistType">
            <el-radio :label="1">临时</el-radio>
            <el-radio :label="2">永久</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="hotelBlack.backlistType === BacklistType.TIMESPSN" label="拉黑时间" prop="blackTime">
          <el-date-picker
            v-model="hotelBlack.blackTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="黑名单备注" prop="backlistDesc">
          <el-input v-model="hotelBlack.backlistDesc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveHotelBlack()">保存</el-button>
          <el-button @click="closeHotelBlack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible="rtBlackFormVisiable" title="房型黑名单" @close="closeRoomTypeBlack()">
      <el-form ref="rtBlackForm" :model="roomTypeBlack" label-width="100px">
        <el-form-item label="酒店名称" prop="hotelName">
          <el-col :span="16">
            <el-input v-model="roomTypeBlack.hotelName" readonly disabled />
          </el-col>
        </el-form-item>
        <el-form-item label="房型名称" prop="roomTypeName">
          <el-col :span="16">
            <el-input v-model="roomTypeBlack.roomTypeName" readonly disabled />
          </el-col>
        </el-form-item>
        <el-form-item label="拉黑原因" prop="backlistReason">
          <el-select v-model="roomTypeBlack.backlistReason" placeholder="拉黑原因">
            <el-option label="酒店" :value="1" />
            <el-option label="平台" :value="3" />
            <el-option label="价格" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="黑名单类型" prop="backlistType">
          <el-radio-group v-model="roomTypeBlack.backlistType">
            <el-radio :label="1">临时</el-radio>
            <el-radio :label="2">永久</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="roomTypeBlack.backlistType === BacklistType.TIMESPSN" label="拉黑时间" prop="blackTime">
          <el-date-picker
            v-model="roomTypeBlack.blackTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="黑名单备注" prop="backlistDesc">
          <el-input v-model="roomTypeBlack.backlistDesc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveRoomTypeBlack">保存</el-button>
          <el-button @click="closeRoomTypeBlack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { SaveHotelBlack, GetHotelMaapings, HotelIsOnline, RoomTypeIsOnline, SaveRoomTypeBlack } from '@/api/hotel/hotel'
import waves from '@/directive/waves'
import { deepClone } from '@/utils/index'
	import {
		GetPlatformDict,
	} from '@/api/dict/dict'
export default {
  name: 'PlatformHotelManager',
  directives: {
    waves
  },
  data() {
    return {
      pageSize: 10,
      pageIndex: 1,
      searchCondition1: {
        hotelName: '',
        isOnLine: '',
        platform: ''
      },
      searchCondition: {
        hotelName: '',
        isOnLine: '',
        platform: ''
      },
      hotelOnLoading: false,
      hotelList: [],
      totalCount: 0,
      blackFormVisiable: false,
      rtBlackFormVisiable: false,
      roomTypeBlack: {
        backlistType: 1,
        backlistReason: 1
      },
      hotelBlack: {
        backlistType: 1,
        backlistReason: 1,
      
      },
      BacklistType: {
        TIMESPSN: 1,
        PERPETUAL: 2
      },
      YN: {
        Y: 1,
        N: 0
      },
			merchantsDict:[]
    }
  },
  created() {
    this.fetchHotelMappingList()
		this.getDict()
  },
  methods: {
		
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
    searchHotelMappings() {
      this.searchCondition1 = deepClone(this.searchCondition)
      this.pageIndex = 1
      this.fetchHotelMappingList()
    },
    fetchHotelMappingList() {
      const that = this
      const param = { ...this.searchCondition1,
        PageSize: this.pageSize,
        PageIndex: this.pageIndex
      }

      this.hotelOnLoading = true
      GetHotelMaapings(param).then(res => {
        that.hotelList = res.data.rows
        that.totalCount = res.data.total

        this.hotelOnLoading = false
      })
    },
    setHotelOnLineStatus(id) {
      HotelIsOnline(id).then(res => {
        if (res.data) {
          this.fetchHotelMappingList()
          this.$message({ type: 'success', message: '操作成功' })
        } else {
          this.$message({ type: 'warning', message: '操作失败' })
        }
      })
    },
    setRoomTypeOnLineStatus(id) {
      RoomTypeIsOnline(id).then(res => {
        if (res.data) {
          this.fetchHotelMappingList()
          this.$message({ type: 'success', message: '操作成功' })
        } else {
          this.$message({ type: 'warning', message: '操作失败' })
        }
      })
    },
    handlePageChange(index) {
      this.pageIndex = index
      this.fetchHotelMappingList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.fetchHotelMappingList()
    },
    handlerblack(hotel) {
      this.hotelBlack.hotelCode = hotel.hotelCode
      this.hotelBlack.hotelName = hotel.hotelName

      this.blackFormVisiable = true
    },
    handlerRoomTypeBlack(hotel, roomType) {
      this.roomTypeBlack.hotelCode = hotel.hotelCode
      this.roomTypeBlack.hotelName = hotel.hotelName
      this.roomTypeBlack.roomTypeCode = roomType.roomTypeCode
      this.roomTypeBlack.roomTypeName = roomType.roomTypeName

      this.rtBlackFormVisiable = true
    },
    saveHotelBlack() {
      let data = this.hotelBlack
      if (data.backlistType === this.BacklistType.TIMESPSN) {
        if (!this.hotelBlack.blackTime || this.hotelBlack.blackTime.length === 0) {
          this.$message('请选择拉黑时段')
          return
        }

        data = { ...this.hotelBlack, backlistStart: this.hotelBlack.blackTime[0], backlistEnd: this.hotelBlack.blackTime[1] }
      }

      SaveHotelBlack(data).then(res => {
        if (res.data) {
          this.closeHotelBlack()
          this.$message({ type: 'success', message: '拉黑成功' })
        } else {
          this.$message({ type: 'warning', message: '拉黑失败' })
        }
      })
    },
    saveRoomTypeBlack() {
      let data = this.roomTypeBlack
      if (data.backlistType === this.BacklistType.TIMESPSN) {
        if (!this.roomTypeBlack.blackTime || this.roomTypeBlack.blackTime.length === 0) {
          this.$message('请选择拉黑时段')
          return
        }
        data = { ...this.roomTypeBlack, backlistStart: this.roomTypeBlack.blackTime[0], backlistEnd: this.roomTypeBlack.blackTime[1] }
      }

      SaveRoomTypeBlack(data).then(res => {
        if (res.data) {
          this.closeRoomTypeBlack()
          this.$message({ type: 'success', message: '拉黑成功' })
        } else {
          this.$message({ type: 'warning', message: '拉黑失败' })
        }
      })
    },
    closeHotelBlack() {
      this.$refs['blackForm'].resetFields()
      this.blackFormVisiable = false
    },
    closeRoomTypeBlack() {
      this.$refs['rtBlackForm'].resetFields()
      this.rtBlackFormVisiable = false
    },
    resetForm(form) {
      this.$refs[form].resetFields()
    },
    goHotelBlack() {
      this.$router.push({ path: '/hotel/blacklist' })
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
