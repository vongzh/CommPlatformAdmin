<template>
  <div class="createPost-container">
    <el-form ref="notice" :model="notice" class="form-container">
      <sticky :z-index="10" :sticky-top="84" :class-name="'sub-navbar draft'">
        <!-- <el-button v-loading="loading" style="margin-left: 10px;" type="warning" @click="saveNotice()">
          撤回
        </el-button> -->
         <el-button v-if="notice && notice.id>0" v-loading="loading" style="margin-left: 10px;" :type="notice.published === YNEnum.Y?'warning':'success'" @click="publishNotice(notice.id)">
              {{ notice.published === YNEnum.Y?'撤回':'发布' }}
            </el-button>
         <el-button v-if="notice && notice.published === YNEnum.N" v-loading="loading" style="margin-left: 10px;" type="success" @click="saveNotice()">
          提交
        </el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-form-item style="margin-bottom: 40px;" prop="title">
          <MDinput v-model="notice.title" :maxlength="100" name="name" required>
            标题
          </MDinput>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label="摘要:">
          <el-input v-model="notice.desc" :maxlength="100" show-word-limit :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入摘要内容" />
        </el-form-item>
        <el-form-item label="是否置顶:" class="postInfo-container-item">
          <el-switch v-model="notice.isTop" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="公告日期:" class="postInfo-container-item">
              <el-date-picker v-model="notice.publishTime" type="datetime" disabled format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提交日期:" class="postInfo-container-item">
              <el-date-picker v-model="notice.createTime" type="datetime" disabled format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="更新时间:" class="postInfo-container-item">
              <el-date-picker v-model="notice.modifyTime" type="datetime" disabled format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-col :span="8">
         <el-form-item label-width="90px" label="重要:" class="postInfo-container-item">
              <el-rate v-model="notice.importance" :max="5" :low-threshold="1" :high-threshold="3" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                style="display:inline-block" />
            </el-form-item> -->
        <!-- </el-col>
        </el-row> -->
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="notice.content" :height="400" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import MDinput from '@/components/MDinput'
  import Sticky from '@/components/Sticky'
  import {
    GetNotice,
    SaveNotice,
    NoticePublish
  } from '@/api/message/message'
  export default {
    // name: 'NoticePublish',
    components: {
      Tinymce,
      MDinput,
      Sticky
    },
    data() {
      return {
        notice: {
           published: 0,
            createTime: new Date(),
            publishTime: new Date()
        },
        loading: false,
        YNEnum: {
          Y: 1,
          N: 0
        }
      }
    },
    computed: {

    },
    created() {
      this.init()
    },
    methods: {
      init() {
        const query = this.$route.query
        if (query && query.noticeId) {
          this.fetchNotice(query.noticeId)
        }
      },
      fetchNotice(id) {
        GetNotice(id).then(res => {
          this.notice = res.data
        })
      },
      saveNotice(publish) {
        if (publish) {
          this.notice.published = this.YNEnum.Y
        } else {
          this.notice.published = this.YNEnum.N
        }

        SaveNotice(this.notice).then(res => {
          if (res.data) {
            this.notice = { published: 0 }
            this.$store.dispatch('tagsView/delView', this.$route)
            this.goNoticeManager()
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '摘要不能为空'
            })
          }
        })
      },
      publishNotice(noticeId) {
      NoticePublish(noticeId).then(res => {
        if (res.data) {
          this.notice = {}
          this.$store.dispatch('tagsView/delView', this.$route)
          this.goNoticeManager()
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
      goNoticeManager() {
        this.$router.push({
          path: '/noticemanager'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }

  .article-textarea ::v-deep  {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }
</style>
