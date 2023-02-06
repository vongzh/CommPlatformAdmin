<template>
  <div class="content">
    <el-collapse value="search">
      <el-collapse-item name="search">
        <span slot="title" class="collapse-title">登录日志</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="searchCondition.userName" clearable placeholder="用户名" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="登录日期" prop="loginDate">
                <el-date-picker
                  v-model="searchCondition.loginDate"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
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
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="userName" label="用户名">
          <template v-slot="scope">
            {{ scope.row.userName }}
          </template>
        </el-table-column>
        <el-table-column prop="loginIP" label="IP">
          <template v-slot="scope">
            {{ scope.row.loginIP }}
          </template>
        </el-table-column>
        <el-table-column prop="loginDevice" label="客户端" />
        <el-table-column prop="loginRemark" label="登录备注">
          <template v-slot="scope">
            <el-popover placement="top-start" title="登录备注" width="200" trigger="hover" :content="scope.row.loginRemark">
              <el-link slot="reference" :underline="false"> {{ scope.row.loginRemark?scope.row.loginRemark.substring(0,50)+'...':'' }} </el-link>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="loginTime" label="登录日期" />
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
import { GetLoginLogs } from '@/api/sys/log'
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
        userName: '',
        loginDate: [],
        date: {}
      },
      searchCondition: {
        userName: '',
        loginDate: [],
        date: {}
      },
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
          item1: this.searchCondition1.loginDate ? this.searchCondition1.loginDate[0] : '',
          item2: this.searchCondition1.loginDate ? this.searchCondition1.loginDate[1] : ''
        },
        PageSize: this.pageSize,
        PageIndex: this.pageIndex
      }

      GetLoginLogs(param).then(res => {
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
