<template>
  <div class="notice-panel">
    <el-popover placement="bottom-end" trigger="click" :width="475">
      <el-tabs :stretch="true">
        <el-tab-pane :label="messageLbl" :lazy="true">
          <div v-if="messages.length === 0" class="notice-list-notFound">
            <svg-icon icon-class="nomessage" class-name="svg-icon-no-list" />
            <div>你已查看所有通知</div>
          </div>
          <div v-else style="height: 26.25rem;">
            <el-scrollbar style="height: 100%;width: 100%;">
              <avue-notice :data="messages" :option="option" @page-change="pageChange" />
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="noticeLbl" :lazy="true">
          <div v-if="notices.length === 0" class="notice-list-notFound">
            <svg-icon icon-class="nomessage" class-name="svg-icon-no-list" />
            <div>没有公告</div>
          </div>
          <div v-else style="height: 26.25rem;">
            <el-scrollbar style="height: 100%">
              <avue-notice :data="notices" :option="option" @page-change="pageChange" />
            </el-scrollbar>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-badge slot="reference" :is-dot="true" style="line-height: 25px;margin-top: -5px;">
        <svg-icon icon-class="remind" />
      </el-badge>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'NoticePanel',
  data() {
    return {
      messages: [],
      notices: [],
      noticeStr: '公告',
      messageStr: '通知',
      option: {
        props: {
          img: 'img',
          title: 'title',
          subtitle: 'subtitle',
          tag: 'tag',
          status: 'status'
        }
      }
    }
  },
  computed: {
    noticeLbl() {
      return this.notices.length === 0 ? this.noticeStr : this.noticeStr + this.countStr(this.notices.length)
    },
    messageLbl() {
      return this.messages.length === 0 ? this.messageStr : this.messageStr + this.countStr(this.messages.length)
    }
  },
  created() {
    this.fetchMessages()
  },
  methods: {
    fetchMessages() {
      this.messages = [{
        img: 'https://avuejs.com/images/logo-bg.jpg',
        title: '史蒂夫·乔布斯 关注了你',
        subtitle: '05-08 15:08',
        tag: '已经开始',
        status: 0
      }, {
        img: 'https://avuejs.com/images/logo-bg.jpg',
        title: '斯蒂夫·沃兹尼亚克 关注了你',
        subtitle: '05-08 15:08',
        tag: '未开始',
        status: 1
      }, {
        img: 'https://avuejs.com/images/logo-bg.jpg',
        title: '乔纳森·伊夫 关注了你',
        subtitle: '05-08 15:08',
        tag: '有警告',
        status: 2
      }]
    },
    pageChange(page, done) {
      setTimeout(() => {
        this.$message.success('页码' + page)
        this.messages.concat(this.messages)
        done()
      }, 1000)
    },
    countStr(count) {
      return '(' + count + ')'
    }
  }
}
</script>

<style scoped>
  .svg-icon-no-list {
    font-size: 5rem;
  }

  .notice-list-notFound {
    color: rgba(0, 0, 0, .45);
    text-align: center;
    height: 18.75rem;
    margin-top: 25%;
  }
</style>

<style>
  .el-scrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
