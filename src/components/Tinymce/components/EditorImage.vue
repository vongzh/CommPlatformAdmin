<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      图片上传
    </el-button>
    <el-dialog :visible.sync="dialogVisible" title="图片上传">
      <el-upload
        :action="fileApi"
        list-type="picture-card"
        :multiple="true"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :show-file-list="true"
        :on-remove="handleRemove"
        :headers="requestHeaders"
        :auto-upload="true"
        :on-success="handleSuccess"
        :on-error="fileUploadError"
        accept=".png,.jpg,.bmp,.jpeg"
        class="editor-slide-upload"
      >
        <el-tooltip content="大小不超过2兆、可上传png、jpg、bmp、jpeg类型的图片" placement="right">
          <el-button size="small" type="primary">
            点击上传
          </el-button>
        </el-tooltip>
      </el-upload>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确认
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import auth from '@/control/auth'
export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      fileApi: process.env.VUE_APP_BASE_API + '/File/Upload?type=notice',
      requestHeaders: {},
      imgHost: 'http://images.51zhu.cn/NoticeContent/'
    }
  },
  mounted() {
    this.timer = setInterval(this.initToken, 3000)
  },
  methods: {
    initUpload(file) {
      if (file.size / 1024 / 1024 > 2) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
    },
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有图片上传完成')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    fileUploadError(err, file, fileList) {
      var code = err.status
      if (code) {
        switch (code) {
          case 415:
            this.$message('不支持的文件类型')
            break
          case 410:
            this.$message('上传次数过多，请明天再试')
            break
          case 500:
            this.$message('上传失败，服务器错误')
            break
        }
        return
      }
      this.$message(err.message ? err.message : '上传失败')
    },
    initToken() {
      const token = auth.GetClientAuth()
      const customerAuth = auth.GetCustomerAuth()
      const clientToken = auth.GenerateRequestToken()
      this.requestHeaders = {
        Authorization: token.token_type + ' ' + token.access_token,
        ck: clientToken,
        sid: customerAuth.sessionId
      }
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          const url = `${this.imgHost}${response}`
          this.listObj[objKeyArr[i]].url = url
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      if (file.size / 1024 / 1024 > 2) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep  .el-upload--picture-card {
    width: 100%;
  }
}
</style>
