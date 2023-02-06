<template>
  <div style="padding-left:10%;padding-right:10%;padding-top:5%;">

    <el-card>
      <div class="tools">
        <el-button-group>
          <el-button size="medium" icon="el-icon-upload2" @click="submitSMS">导入短信</el-button>
          <el-button size="medium" icon="el-icon-upload2" @click="submitMail">导入邮箱</el-button>
          <el-button size="medium" icon="el-icon-upload2" @click="exportAct">导出账号</el-button>
          <el-button size="medium" icon="el-icon-upload2" @click="exportTodayAct">导出当天账号</el-button>
          <el-button size="medium" icon="el-icon-refresh" @click="init">刷新</el-button>
        </el-button-group>
        <div style="float:right;margin-right:1%">
          当天注册数量：<el-link>{{ todayResgisterCount }}</el-link>
          当天成功数量：<el-link>{{ todayResgisterSuccessCount }}</el-link>
          可用邮箱数：<el-link>{{ mailCount }}</el-link>
        </div>
      </div>
      <div>
        <el-table v-loading="onLoading1" :data="batchInfoList" :fit="true" border stripe highlight-current-row>
          <el-table-column label="批次号" prop="batchID" />
          <el-table-column label="数量" prop="totalCount" />
          <el-table-column label="成功数量" prop="successCount" />
          <el-table-column label="提交时间" prop="date" />
          <el-table-column label="提交时间" prop="date">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="getRegisterBatch(scope.row.batchID)">查看</el-button>
              <el-button size="mini" type="warning" @click="retryRegister(scope.row.batchID)">重试</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-card style="margin-top:2%">
      <!-- <div class="tools">
        <el-button-group>
          <el-button size="medium" icon="el-icon-refresh" @click="getRegisterBatch">刷新</el-button>
        </el-button-group>
      </div> -->
      <div>
        <el-table v-loading="onLoading" :data="dataList" :row-class-name="statusDesc" :fit="true" border>
          <el-table-column label="端口" prop="port" />
          <el-table-column label="手机号" prop="phone" />
          <el-table-column label="内容" prop="content">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scope.row.content"
              >
                <el-link slot="reference" style="margin-left:3px">{{ scope.row.content|ellipsis }}</el-link>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="验证码" prop="code" />
          <!-- <el-table-column label="邮箱" prop="mailAct" />
          <el-table-column label="证件" prop="passport">
            <template slot-scope="scope">
              {{ scope.row.passport.substring(0,3) + '****' + scope.row.passport.substring(7,9) }}
            </template>
          </el-table-column>
          <el-table-column label="姓名" prop="name" /> -->
          <el-table-column label="状态" prop="status" />
          <el-table-column label="结果" prop="result" />
          <el-table-column label="短信时间" prop="smsDate" />
          <el-table-column label="提交时间" prop="submitDate" />
          <el-table-column label="注册时间" prop="registerDate" />
        </el-table>
      </div>
    </el-card>

    <el-dialog
      title="短信列表提交"
      :close-on-click-modal="false"
      :visible.sync="submitVisiable"
    >
      <el-select v-model="format">
          <el-option :value="1" label="格式1"></el-option>
          <el-option :value="2" label="格式2"></el-option>
      </el-select>
      <div style="margin-top: 20px">
      <el-input
        v-model="submitText"
        type="textarea"
        :rows="10"
        placeholder="请粘贴短信列表，每行一条"
      />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">关闭</el-button>
        <el-button type="primary" size="mini" @click="onSubmit">提交</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="邮箱列表提交"
      :close-on-click-modal="false"
      :visible.sync="mailSubmitVisiable"
    >
      <el-input
        v-model="mailSubmitText"
        type="textarea"
        :rows="10"
        placeholder="请粘贴邮箱列表，每行一条"
      />
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeMailDialog">关闭</el-button>
        <el-button type="primary" size="mini" @click="onSubmitMail">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { SubmitRegisterBatch, GetGetRegisterBatch, GetRegisterBatchInfo, RetryRegister, ImportMails, GetMailCount, TodayRegisterAccount, TodayRegisterInfo } from '@/api/extend/registersms'
export default {
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 10) {
        return value.slice(0,10) + '...'
      }
      return value
    }
  },
  data() {
    return {
      onLoading: false,
      dataList: [],

      onLoading1: false,
      batchInfoList: [],

      submitVisiable: false,
      submitText: '',
      format: '',

      mailCount: 0,

      mailSubmitVisiable: false,
      mailSubmitText: '',

      todayResgisterCount: '',
      todayResgisterSuccessCount: ''
    }
  },
  computed: {

  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.dataList = []
      this.batchInfoList = []

      this.getMailCount()
      this.getRegisterBatchInfo()

      this.todayResisterInfo()
    },
    statusDesc({ row, rowIndex }) {
      if (row.status === -1 || row.status === -10) {
        return 'fail'
      }
      return ''
    },
    submitSMS() {
      this.submitVisiable = true
    },
    submitMail() {
      this.mailSubmitVisiable = true
    },
    getMailCount() {
      GetMailCount().then(res => {
        if (res.result) {
          this.mailCount = res.data
        }
      })
    },
    retryRegister(batchID) {
      RetryRegister(batchID).then(res => {
        this.$message.info('已提交重试')
      })
    },
    getRegisterBatch(batchID) {
      GetGetRegisterBatch(batchID).then(res => {
        this.dataList = res.data
      })
    },
    getRegisterBatchInfo() {
      GetRegisterBatchInfo().then(res => {
        this.batchInfoList = res.data
      })
    },
    onSubmitMail() {
      ImportMails(0, this.mailSubmitText).then(res => {
        this.$message.info('邮箱正在导入中，请稍后查看')

        this.closeMailDialog()
      })
    },
    onSubmit() {
      SubmitRegisterBatch(this.format, this.submitText).then(res => {
        if (res.result) {
          this.$message.info('提交成功')

          this.closeDialog()

          this.getRegisterBatchInfo()
        } else {
          this.$message.warning('提交失败，请稍后再试')
        }
      })
    },
    todayResisterInfo() {
        TodayRegisterInfo().then(res => {
            this.todayResgisterCount = res.data.item1
            this.todayResgisterSuccessCount = res.data.item2
        })
    },
    exportTodayAct() {
        this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const hour = new Date().getHours()
        const minute = new Date().getMinutes()

        if (value !== hour + '' + minute) {
            this.$message.info('密码错误')
            return
        }

        TodayRegisterAccount().then(res=>{
            import('@/vendor/Export2Excel').then(excel => {
                let resData = res.data
                let datalist = resData

                const filterVal = ['phone','pwd','mailAct','mailPwd','name','passport','result']
                const data = this.formatJson(filterVal, datalist)
                excel.export_json_to_excel({
                    header: ['手机号','密码','邮箱账号','邮箱密码','姓名', '证件', '状态'],
                    data: data,
                    filename: this.filename,
                    autoWidth: this.autoWidth,
                    bookType: this.bookType
                })
            })
        })
      }).catch(() => {

      })
    },
    exportAct() {
      this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const hour = new Date().getHours()
        const minute = new Date().getMinutes()

        if (value !== hour + '' + minute) {
            this.$message.info('密码错误')
            return
        }

        import('@/vendor/Export2Excel').then(excel => {
          let datalist = this.dataList

          const filterVal = ['phone','pwd','mailAct','mailPwd','name','passport','result']
          const data = this.formatJson(filterVal, datalist)
          excel.export_json_to_excel({
            header: ['手机号','密码','邮箱账号','邮箱密码','姓名', '证件', '状态'],
            data: data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
        })
      }).catch(() => {

      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    closeMailDialog() {
      this.mailSubmitVisiable = false

      this.mailSubmitText = ''
    },
    closeDialog() {
      this.submitVisiable = false

      this.submitText = ''
    }
  }
}
</script>

<style>
.el-table .fail {
    background: #C03639;
  }
</style>
