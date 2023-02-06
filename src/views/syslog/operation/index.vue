<template>
  <div class="content">
    <el-collapse value="search">
      <el-collapse-item name="search">
                <span slot="title" class="collapse-title">操作日志</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="日志编号" prop="logId">
                <el-input v-model="searchCondition.logId" clearable placeholder="日志编号" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="searchCondition.userName" clearable placeholder="用户名" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="业务参数" prop="businessParam">
                <el-input v-model="searchCondition.businessParam" clearable placeholder="业务参数" class="filter-item input-search" />
              </el-form-item>
              <!-- <el-form-item label="操作模块" prop="operFun">
                <el-input v-model="searchCondition.operFun" clearable placeholder="操作模块" class="filter-item input-search" />
              </el-form-item> -->
              <el-form-item label="操作时间" prop="operationDate">
                <el-date-picker
                  v-model="searchCondition.operationDate"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  align="right"
                />
              </el-form-item>
            </el-form>
            <div class="tools-btn">
              <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="searchLogs()">搜索</el-button>
              <el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close" @click="resetForm('searchForm')">重置</el-button>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-card>
      <div class="tools">
        <el-button-group>
          <el-button v-waves size="medium" icon="el-icon-refresh" @click="fetchLogs()" />
        </el-button-group>
      </div>
      <el-table :data="logList" :fit="true" border stripe highlight-current-row>
        <el-table-column prop="logId" label="日志编号" />
        <el-table-column prop="resourceTypeDesc" label="操作类型" />
        <el-table-column prop="logContent" label="内容">
          <template slot-scope="scope">
            {{ scope.row.logContent }}
            <el-popover v-if="scope.row.changedFields" title="变更记录" placement="top-start" width="500" trigger="hover">
              {{ scope.row.changedFields }}
              <el-link slot="reference" type="primary">(变更)</el-link>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="businessParam" label="业务参数" />
        <el-table-column prop="userName" label="用户" />
        <el-table-column prop="userTypeDesc" label="用户类型" />
        <el-table-column prop="optTime" label="操作时间" />
      </el-table>
    </el-card>
    <div style="margin-top: 0.625rem;">
      <el-pagination
        background
        layout="sizes,total,prev, pager, next, jumper"
        :total="totalCount"
        :page-size="pageSize"
        :current-page="pageIndex"
        :page-sizes="[10,20, 50, 100]"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { GetOperationLogs } from '@/api/sys/log'
import waves from '@/directive/waves' // waves directive
import { deepClone } from '@/utils/index'
export default {
  name: 'LoginLog',
  directives: {
    waves
  },
  data() {
    return {
      searchCondition1: {
        logId: '',
        userName: '',
        businessParam: '',
        operationDate: []
      },
      searchCondition: {
        logId: '',
        userName: '',
        businessParam: '',
        operationDate: [] },
      totalCount: 0,
      pageSize: 10,
      pageIndex: 1,
      logList: []
    }
  },
  created() {
    this.fetchLogs()
  },
  methods: {
    searchLogs() {
      this.searchCondition1 = deepClone(this.searchCondition)
      this.pageIndex = 1
      this.fetchLogs()
    },
    fetchLogs() {
      const param = { ...this.searchCondition1,
        date: {
          item1: this.searchCondition1.operationDate ? this.searchCondition1.operationDate[0] : '',
          item2: this.searchCondition1.operationDate ? this.searchCondition1.operationDate[1] : ''
        },
        PageSize: this.pageSize,
        PageIndex: this.pageIndex
      }

      GetOperationLogs(param).then(res => {
        this.logList = res.data.rows
        this.totalCount = res.data.total
      })
    },
    handlePageChange(index) {
      this.pageIndex = index
      this.fetchLogs()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.fetchLogs()

    },
    resetForm(form) {
      this.$refs[form].resetFields()
    }
  }
}
</script>

<style scoped>
.content{
  margin: 10px;
}

</style>
