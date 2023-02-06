<template>
  <div class="app-container">
    <el-collapse value="search">
      <el-collapse-item name="search">
        <span slot="title" class="collapse-title">匹配类型</span>
        <div>
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="匹配类型" prop="enabled">
                <el-select v-model="searchCondition.matchType" placeholder="匹配类型" clearable>
                  <el-option label="酒店" value="1" />
                  <el-option label="房型" value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="携程酒店ID" prop="hotelId">
                <el-input
                  v-model="searchCondition.hotelId"
                  clearable
                  placeholder="携程酒店ID"
                  class="filter-item input-search"
                />
              </el-form-item>
            </el-form>
            <div class="tools-btn">
              <el-button
                v-waves
                class="filter-item"
                type="primary"
                size="small"
                icon="el-icon-search"
                :disabled="isDisabled"
                @click="handleSearch()"
              >匹配</el-button>
              <el-button
                v-waves
                class="filter-item"
                type="warning"
                size="small"
                icon="el-icon-close"
                @click="handleReset('searchForm')"
              >重置</el-button>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { HotelMatch } from '@/api/hotel/hotel.js'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'HotelMatchManage',
  directives: {
    waves
  },
  data() {
    return {
      // 搜索表单
      searchCondition: {
        hotelId: '',
        matchType: ''
      },
      isDisabled: false,
      formRule: {
        hotelId: [
          { required: true, message: '请输入酒店Id', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleSearch() {
      this.isDisabled = true
      HotelMatch(this.searchCondition.hotelId, this.searchCondition.matchType).then(res => {
        const tip = (res.result === true ? '成功' : '失败')
        this.$message('匹配' + tip)
        this.isDisabled = false
      })
    },
    handleReset(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
.input-search {
  width: 12.5rem;
}
</style>
