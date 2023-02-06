<template>
  <div class="content">
    <el-collapse value="search">
      <el-collapse-item  name="search">
                <span slot="title" class="collapse-title">公告列表</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="公告标题" prop="title">
                <el-input v-model="searchCondition.title" clearable placeholder="标题" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="发布状态" prop="published">
                <el-select v-model="searchCondition.published" clearable>
                  <el-option :value="1" label="已发布"></el-option>
                  <el-option :value="0" label="未发布"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否置顶" prop="isTop">
                <el-select v-model="searchCondition.isTop" clearable>
                  <el-option :value="1" label="置顶"></el-option>
                  <el-option :value="0" label="未置顶"></el-option>
                </el-select>
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
          <el-button v-waves size="medium" icon="el-icon-plus" @click="goPublish" />
          <el-button v-waves size="medium" icon="el-icon-refresh" @click="fetchNotices()" />
        </el-button-group>
      </div>
      <el-table v-loading="loading" :data="noticeList" :fit="true" border stripe highlight-current-row>
        <!-- <el-table-column prop="title" label="公告标题">
          <template v-slot="scope">
            <el-link @click="goNoticeDetail(scope.row.id)">{{ scope.row.title|ellipsis }}</el-link>
          </template>
        </el-table-column> -->
        <el-table-column prop="title" label="公告标题" min-width="10%">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.title">
              <el-link slot="reference" @click="goNoticeDetail(scope.row.id)" style="margin-left:3px">{{ scope.row.title|ellipsis }}</el-link>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column prop="desc" label="摘要" min-width="14%">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.desc"
            >
              <el-link slot="reference" style="margin-left:3px">{{ scope.row.desc|ellipsis }}</el-link>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="readCount" label="已读次数" min-width="6%"/>
        <el-table-column label="是否置顶" width="119">
          <template v-slot="scope">
            <el-col :type="scope.row.isTop === YNEnum.Y?'success':'info'">{{ scope.row.isTopDesc }}</el-col>
          </template>
        </el-table-column>
        <el-table-column prop="publishedDesc" label="发布状态" min-width="6%" >
          <template v-slot="scope">
            <el-col :type="scope.row.published === YNEnum.Y?'success':'info'">{{ scope.row.publishedDesc }}</el-col>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="公告日期" min-width="10%" />
        <el-table-column prop="createTime" label="提交日期" min-width="10%"/>
        <el-table-column label="操作" min-width="10%">
          <template v-slot="scope">
            <el-button size="mini" :type="scope.row.isTop === YNEnum.Y?'warning':'success'" @click="topNotice(scope.row.id)">
              {{ scope.row.isTop === YNEnum.Y?'取消置顶':'置顶' }}
            </el-button>
            <el-button size="mini" :type="scope.row.published === YNEnum.Y?'warning':'success'" @click="publishNotice(scope.row.id)">
              {{ scope.row.published === YNEnum.Y?'撤回':'发布' }}
            </el-button>
            <el-button v-if="scope.row.published === YNEnum.N " size="mini" type="primary" @click="goPublish(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table> 
    </el-card>
    <div style="margin-top: 0.625rem;">
      <el-pagination
        background
        layout="sizes,total, prev, pager, next, jumper"
        :total="totalCount"
        :page-size="pageSize"
        :current-page="pageIndex"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        :page-sizes="[10,20, 50, 100]"

      />
    </div>
  </div>
</template>

<script>
import { GetNotices, NoticeTop, NoticePublish } from '@/api/message/message'
import waves from '@/directive/waves'
export default {
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 15) {
        return value.slice(0,15) + '...'
      }
      return value
    }
  },
  name: 'NoticeManager',
  directives: {
    waves
  },
  data() {
    return {
      searchCondition: {
        title: '',
        publishDate: [],
        published: '',
        isTop: '',
      },
      totalCount: 0,
      pageSize: 10,
      pageIndex: 1,
      noticeList: [],
      loading: false,
      YNEnum: {
        Y : 1,
        N : 0
      }
    }
  },
  created() {
    this.fetchNotices()
  },
  methods: {
    searchNotices() {
      this.pageIndex = 1
      this.fetchNotices(true)
    },

    fetchNotices(tip) {
      this.loading = true

      const param = { ...this.searchCondition,
        PageSize: this.pageSize,
        PageIndex: this.pageIndex,
        NoticeDate: {
          Item1: this.searchCondition.publishDate ? this.searchCondition.publishDate[0]:'',
          Item2: this.searchCondition.publishDate ? this.searchCondition.publishDate[1]:''
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
    publishNotice(noticeId) {
      NoticePublish(noticeId).then(res => {
        if (res.data) {
          this.fetchNotices()
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        } else {
          this.$message({
            type: 'info',
            message: '操作失败'
          })
        }
      })
    },
    topNotice(noticeId) {
      NoticeTop(noticeId).then(res => {
        if (res.data) {
          this.fetchNotices()
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        } else {
          this.$message({
            type: 'info',
            message: '操作失败'
          })
        }
      })
    },
    goPublish(notice) {
      this.$router.push({ path: '/notice/publish', query: { noticeId: notice.id }})
    },
    handlePageChange(index) {
      this.pageIndex = index
      this.fetchNotices()
    },
    handleSizeChange(val){
      this.pageSize=val
      this.pageIndex=1
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
