<template>
  <div class="content">
    <el-collapse value="search">
      <el-collapse-item name="search">
        <span slot="title" class="collapse-title">短信列表</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="searchCondition.mobile" clearable placeholder="手机号" class="filter-item input-search" />
              </el-form-item>
            </el-form>
            <div class="tools-btn">
              <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="searchSMS()">搜索</el-button>
              <el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close" @click="resetForm('searchForm')">重置</el-button>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-card>
      <div class="tools">
        <el-button-group>
          <el-button v-waves size="medium" icon="el-icon-refresh" @click="fetchSMSList()" />
        </el-button-group>
      </div>
      <div>
        <el-table v-loading="onLoading" :data="smsList" :fit="true" border stripe highlight-current-row>
          <el-table-column prop="mobile" label="手机号" width="120" />
          <el-table-column prop="placeDesc" label="短信场景" width="100" />
          <el-table-column prop="templateId" label="模板编号" width="100" />
          <el-table-column prop="platform" label="平台" width="160">
            <template v-slot="scope">
              <el-tag effect="plain">{{ scope.row.platform }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="param" label="参数" width="160" />
          <el-table-column prop="requestId" label="请求编号" />
          <el-table-column prop="sendRetDesc" label="发送结果" width="80">
            <template v-slot="scope">
              <el-col effect="dark" :type="getStatusTag(scope.row.sendRet)">{{ scope.row.sendRetDesc }}</el-col>
            </template>
          </el-table-column>
          <el-table-column prop="sendCode" label="错误代码" />
          <el-table-column prop="reportRetDesc" label="回执结果" width="80">
            <template v-slot="scope">
              <el-col :type="getStatusTag(scope.row.reportRet)">{{ scope.row.reportRetDesc }}</el-col>
            </template>
          </el-table-column>
          <el-table-column prop="sendTime" label="发送时间" width="145">
            <template v-slot="scope">
              <el-link :underline="false" style="color: darkgrey;font-size: small;">{{ scope.row.sendTime }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="reportTime" label="回执时间" width="145">
            <template v-slot="scope">
              <el-link :underline="false" style="color: darkgrey;font-size: small;">{{ scope.row.reportTime }}</el-link>
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
import { GetSMSs } from '@/api/sms/sms'
import waves from '@/directive/waves'
import { deepClone } from '@/utils/index'
export default {
  name: 'SMSList',
  directives: {
    waves
  },
  data() {
    return {
      pageSize: 10,
      pageIndex: 1,
      searchCondition1: {
        mobile: ''
      },
      searchCondition: {
        mobile: ''
      },
      onLoading: false,
      smsList: [],
      totalCount: 0
    }
  },
  created() {
    this.fetchSMSList()
  },
  methods: {
    searchSMS() {
      this.searchCondition1 = deepClone(this.searchCondition)
      this.pageIndex = 1
      this.fetchSMSList(true)
    },
    fetchSMSList(tip) {
      const that = this
      const param = { ...this.searchCondition1,
        PageSize: this.pageSize,
        PageIndex: this.pageIndex
      }

      this.onLoading = true
      GetSMSs(param).then(res => {
        that.smsList = res.data.rows
        that.totalCount = res.data.total

        this.onLoading = false
        if (tip) {
          this.$message('搜索成功')
        }
      })
    },
    handlePageChange(index) {
      this.pageIndex = index
      this.fetchSMSList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.fetchSMSList()

    },
    getStatusTag(st) {
      if (st < 0) { return 'danger' }
      if (st === 0) { return 'primay' }
      if (st > 0) { return 'success' }
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
