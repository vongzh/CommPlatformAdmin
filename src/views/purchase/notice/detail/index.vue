<template>
  <div class="content">
    <el-card>
      <div slot="header">
        <el-page-header @back="goBack" />
      </div>
      <div class="notice">
        <div class="title">
          <el-row style="text-align:center;font-size:x-large;padding-bottom:2rem">{{ notice.title }}</el-row>
          <el-row>
            <el-link :underline="false" style="font-size:large;">{{ notice.desc }}</el-link>
          </el-row>
          <el-row style="text-align: right;font-size: small;margin-right: 1.875rem;">
            <el-link :underline="false">发布于<span>{{ notice.publishTime }}</span></el-link>
            <span style="margin-left: 0.625rem;"><i class="el-icon-view">&nbsp;{{ notice.readCount }}</i></span>
          </el-row>
        </div>
        <el-divider />
        <div class="content" v-html="notice.content" />
      </div>
    </el-card>
  </div>
</template>

<script>
import { GetNotice, NoticeRead } from '@/api/message/message'
export default {
  name: 'Noticedetail',
  data() {
    return {
      notice: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const query = this.$route.query
      if (!query || !query.noticeId) {
        this.$alert('请返回重试', '公告查看失败', {
          confirmButtonText: '确定',
          type: 'error',
          callback: action => {
            this.goBack()
          }
        })
        return false
      }

      this.fetchNotice(query.noticeId)
    },
    fetchNotice(id) {
      GetNotice(id).then(res => {
        this.notice = res.data

        try {
          NoticeRead(id)
        } catch (e) {}
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
  .content {
    width: 100%;
  }
 ::v-deep  .el-page-header__content {
    font-size: x-large;
}

</style>
