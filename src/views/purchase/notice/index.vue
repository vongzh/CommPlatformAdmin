<template>
  <div class="content">
    <el-collapse value="search">
      <el-collapse-item name="search">
                <span slot="title" class="collapse-title">公告列表</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="公告标题" prop="title">
                <el-input v-model="searchCondition.title" clearable placeholder="标题" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="公告日期" prop="publishDate">
                <el-date-picker
                  v-model="searchCondition.publishDate"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                />
              </el-form-item>
            </el-form>
            <div class="tools-btn">
              <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="searchNotices()">搜索</el-button>
              <el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close" @click="resetForm('searchForm')">重置</el-button>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-card>
      <div class="tools">
        <el-button-group>
          <el-button v-waves size="medium" icon="el-icon-refresh" @click="fetchNotices()" />
        </el-button-group>
      </div>
      <el-table v-loading="loading" :data="noticeList" :fit="true" border stripe highlight-current-row>
        <el-table-column prop="title" label="公告标题">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.title"
            >
              <el-link slot="reference" style="margin-left:3px" @click="goNoticeDetail(scope.row.id)">{{ scope.row.title|proellipsis }}</el-link>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="摘要">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.desc"
            >
              <el-link slot="reference" style="margin-left:3px">{{ scope.row.desc|proellipsis }}</el-link>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="公告日期" />
        <el-table-column prop="desc" label="操作">
          <template v-slot="scope">
            <el-button v-waves class="filter-item" type="primary" size="small" @click="goNoticeDetail(scope.row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div style="margin-top: 0.625rem;">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="totalCount"
        :page-size="pageSize"
        :current-page="pageIndex"
        @current-change="handlePageChange"
      />
    </div>
  </div>

</template>

<script>
import { GetNotices } from '@/api/message/message'
import waves from '@/directive/waves' // waves directive
import { deepClone } from '@/utils/index'
export default {
  name: 'Notice',
  directives: {
    waves
  },
  filters: {
    ellipsis(value) {
      if (!value) {
        return ''
      }
      if (value.length > 20) {
        return value.slice(0, 20) + '......'
      } else {
        return value
      }
    }
  },
  data() {
    return {
      searchCondition1: {
        title: '',
        publishDate: []
      },
      searchCondition: {
        title: '',
        publishDate: []
      },
      totalCount: 0,
      pageSize: 10,
      pageIndex: 1,
      noticeList: [],
      loading: false
    }
  },
  created() {
    this.fetchNotices()
  },
  methods: {
    searchNotices() {
      this.searchCondition1 = deepClone(this.searchCondition)
      this.pageIndex = 1
      this.fetchNotices(true)
    },
    fetchNotices(tip) {
      this.loading = true

      const param = { ...this.searchCondition1,
        PageSize: this.pageSize,
        PageIndex: this.pageIndex,
        NoticeDate: {
          Item1: this.searchCondition1.publishDate ? this.searchCondition1.publishDate[0] : '',
          Item2: this.searchCondition1.publishDate ? this.searchCondition1.publishDate[1] : ''
        }
      }

      GetNotices(param).then(res => {
        this.noticeList = res.data.rows
        this.totalCount = res.data.total

        this.loading = false
        if (tip) {
          this.$message('搜索成功')
        }
      })
    },
    handlePageChange(index) {
      this.pageIndex = index
      this.fetchNotices()
    },
    resetForm(form) {
      this.$refs[form].resetFields()
    },
    goNoticeDetail(id) {
      this.$router.push({ path: '/notice/detail', query: { noticeId: id }})
    }
  }
}
</script>

<style scoped>
.content{
  margin: 10px;
}

</style>
