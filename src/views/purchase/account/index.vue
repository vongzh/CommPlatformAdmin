<template>
  <div class="content">
    <el-card class="balance" v-if="this.sysUser.userType===userType.CUSTOMER">
      <el-row type="flex" justify="start" align="middle">
        <el-col :span="2">账户余额：</el-col>
        <el-col :span="6"><span class="money" v-if="customer.accountCode">￥{{customer.accountRealBalance}}</span>
        </el-col>
        <el-col :span="2">支付密码：</el-col>
        <el-col :span="2">
          <el-button type="success" @click="Idcheckvisible">设置/重置密码</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-tabs v-model="tab"  @tab-click="tabClick" :stretch="true">
      <el-tab-pane label="交易明细" name="transcation">
            <div class="filter-container">
              <el-card>
                <el-form inline ref="searchForm" :inline="true" :model="searchCondition" label-position="top" class="searchForm">
                  <el-form-item label="酒店/房型名称" prop="productName">
                    <el-input v-model="searchCondition.productName" clearable placeholder="请输入酒店/房型名称"
                              class="filter-item input-search" />
                  </el-form-item>
                  <el-form-item label="订单号" prop="orderNo">
                    <el-input v-model="searchCondition.orderNo" clearable placeholder="请输入订单号"
                              class="filter-item input-search" />
                  </el-form-item>
                  <el-form-item label="支付单号" prop="paymentOrderNo">
                    <el-input v-model="searchCondition.paymentOrderNo" clearable placeholder="请输入支付单号"
                              class="filter-item input-search" />
                  </el-form-item>
                  <el-form-item label="交易类型" prop="transactionType">
                    <el-select v-model="searchCondition.transactionType" placeholder="交易类型" clearable>
                      <el-option label="下单" value="1" />
                      <el-option label="退款" value="5" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="支付方式" prop="payType">
                    <el-select v-model="searchCondition.payType" placeholder="交易方式" clearable>
                      <el-option v-for="ptype in this.payType" :key="ptype.value" :label="ptype.text" :value="ptype.value"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="交易时间" prop="transactionTimes" style="width: 230px;">
                    <el-date-picker v-model="searchCondition.transactionTimes" :picker-options="pickerOptions"
                                    value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期"
                                    end-placeholder="结束日期" align="right" />
                  </el-form-item>
							<el-form-item label="　" style="user-select: none;width: 200px;">
                  <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search"
                             @click="searchTranscation">搜索</el-button>
                  <el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close"
                             @click="handleReset('searchForm')">重置</el-button>
							</el-form-item>
                  <!-- <el-form-item>
                    <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search">搜索</el-button>
                    <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-close">重置</el-button>
                  </el-form-item> -->
                </el-form>
              </el-card>
            </div>
        <el-card>
          <div slot="header">
            <el-button v-waves size="medium" icon="el-icon-refresh" @click="searchTranscation('refresh')" />

            <span style="font-size: 14px;margin-left:2rem">收入：<i
              style="font-size: large;color: #1890FF;">￥{{ totalTranscation.item1 }}</i></span>
            <span style="font-size: 14px;margin-left: 1rem;">支出：<i
              style="font-size: large;color: #1890FF;">￥{{ totalTranscation.item2 }}</i>
              <el-link type="text" :underline="false" class="buttomstyle" @click="exportAccountTranscations">导出列表
              </el-link>
            </span>
          </div>
          <el-table v-loading="transactionLoading" :data="transactionList" :fit="true" border stripe
                    highlight-current-row>
            <el-table-column prop="transcationNo" label="交易流水号" min-width="7%" />
            <el-table-column prop="transcactionAmount" label="交易金额" min-width="6%" />
            <el-table-column label="交易类型" min-width="6%">
              <template slot-scope="scope">
                <el-col>{{ scope.row.transcactionTypeDesc }}</el-col>
              </template>
            </el-table-column>
            <el-table-column prop="payTypeDesc" label="支付方式" min-width="6%">
              <template slot-scope="scope">
                <el-col effect="plain">{{ scope.row.payTypeDesc }}</el-col>
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="酒店/房型名称" min-width="16%" />
            <el-table-column prop="orderNo" label="订单号" min-width="8%" />
            <el-table-column prop="paymentOrderNo" label="支付单号" min-width="6%" />
            <el-table-column prop="refundOrderNo" label="退款单号" min-width="6%" />
            <el-table-column prop="transcationTime" label="交易时间" min-width="9%" />
          </el-table>
          <div class="pagination-container">
            <el-pagination background layout="sizes,total, prev, pager, next, jumper" :total="totalCount"
                           :page-size="pageSize" :page-sizes="[10,20, 50, 100]" :current-page="pageIndex"
                           @current-change="handlePageChange" @size-change="onsizechange" />
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="账户金额明细" name="recharge">
            <el-card>
              <el-form inline label-position="top" ref="searchForm1" :model="TSearchCondition" class="searchForm">
                <el-form-item label="交易单号" prop="accountTransactionNo">
                  <el-input v-model="TSearchCondition.accountTransactionNo" clearable placeholder="请输入交易单号"
                            class="filter-item input-search" />
                </el-form-item>
                <el-form-item label="充值账号" prop="transactionAccountNo">
                  <el-input v-model="TSearchCondition.transactionAccountNo" clearable placeholder="请输入充值账号"
                            class="filter-item input-search" />
                </el-form-item>
                <el-form-item label="充值类型" prop="transactionType">
                  <el-select v-model="TSearchCondition.transactionType" placeholder="充值类型" clearable>
                    <el-option label="充值" value="1" />
                    <el-option label="提现" value="2" />
                    <el-option label="消费" value="3" />
                  </el-select>
                </el-form-item>
                <el-form-item label="操作时间" prop="transactionTimes" style="width: 230px;">
                  <el-date-picker v-model="TSearchCondition.transactionTimes" type="daterange" value-format="yyyy-MM-dd"
                                  :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                  align="right" />
                </el-form-item>
							<el-form-item label="　" style="user-select: none;width: 200px;">
                <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" 
                           @click="TsearchTranscation">搜索</el-button>
                <el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close"  
                           @click="handleReset('searchForm1')">重置</el-button>
							</el-form-item>
              </el-form>
            </el-card>
        <el-card class="data">
          <div slot="header">
            <el-button v-waves size="medium" icon="el-icon-refresh" @click="TsearchTranscation('refresh')" />
            <el-link type="text" :underline="false" class="buttomstyle" @click="exportAccountTranscations2">导出列表
            </el-link>
            </span>
          </div>
          <el-table :data="AccountTranscations" v-loading="transactionLoading" :fit="true" border stripe  highlight-current-row >
            <el-table-column prop="accountTransactionNo" label="交易单号" />
            <el-table-column prop="transactionBeforeAmount" label="原始金额" />
            <el-table-column prop="transactionAmount" label="交易金额" />
            <el-table-column prop="transactionAfterAmount" label="剩余金额" />
            <!-- <el-table-column prop="transactionVirtualBeforeAmount" label="原始虚拟金额" />
            <el-table-column prop="transactionVirtualAmount" label="交易虚拟金额" />
            <el-table-column prop="transactionAfterVirtualAmount" label="剩余虚拟金额" /> -->
            <el-table-column prop="transactionTypeDesc" label="操作类型" />
            <el-table-column prop="transactionAccountNo" label="账号/银行账号" />
            <el-table-column prop="tradeNo" label="交易流水号" />
            <el-table-column prop="createTime" label="操作时间" />
            </el-table>
            <div class="pagination-container">
              <el-pagination background layout="sizes,total, prev, pager, next, jumper" :total="totalCount2"
                             :page-sizes="[10,20, 50, 100]" :page-size="pageSize2" :current-page="pageIndex2"
                             @current-change="handlePageChange2" @size-change="onsizechange2" />
            </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :visible.sync="innerchangepwd" :close-on-click-modal="false" label-position="right" :inline="true"
               width="30%" @close="Cancelpassword" append-to-body center>
      <div slot="title">
        <span>用户密码修改</span>
      </div>
      <div class="purchase-order-info">
        <el-form ref="pwdFormRef" :rules="passwordRules" :model="pwdForm" label-width="110px" style="margin-top:2rem">
          <el-form-item label="身份证号" prop="idCardNo">
            <el-input v-model="pwdForm.idCardNo" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="原密码" prop="orginPwd">
            <el-col :span="16">
              <el-input v-model.trim="pwdForm.orginPwd" show-password maxlength="6" show-word-limit />
            </el-col>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-col :span="16">
              <el-input v-model.trim="pwdForm.newPwd"  show-password maxlength="6" show-word-limit/>
            </el-col>
          </el-form-item>
          <el-form-item label="确认密码" prop="rePwd">
            <el-col :span="16">
              <el-input v-model.trim="pwdForm.rePwd" show-password maxlength="6" show-word-limit/>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button @click="Cancelpassword">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import {
  GetCustomerResponse
} from '@/api/customer/customer'
import {
  GetTranscations,
  GetTotalTranscation,
  GetAccountTranscations,
  UpdatePayPwd
} from '@/api/account/account'
import {
  deepClone
} from '@/utils/index'
import {
  AddOperationLog
} from '@/api/sys/log'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Account',
  directives: {
    waves
  },
  data() {
    return {
      outerchangepwd: false,
      innerchangepwd: false,
      tab: 'transcation',
      pwdForm: {
        orginPwd: '',
        newPwd: '',
        rePwd: '',
        idCardNo:''
      },
      ID: '',
      passwordRules: {
        orginPwd: [{
          required: true,
          message: '请输入原密码',
          trigger: 'blur'
        }],
        newPwd: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        },
        {
          pattern: /^\d{6}$/,
          message: '密码格式不正确，请输入6位数字',
          trigger: 'blur'
        }
        ],
        rePwd: [{
          required: true,
          message: '请再次输入密码',
          trigger: 'blur'
        },
        {
          pattern: /^\d{6}$/,
          message: '密码格式不正确，请输入6位数字',
          trigger: 'blur'
        }
        ],
        idCardNo: [{
          required: true,
          message: '请输入身份证号',
          trigger: 'blur'
        }
        ]
      },
      searchCondition: {
        transactionTimes: [],
        productName: '',
        orderNo: '',
        paymentOrderNo: '',
        transactionType: '',
        createTime: '',
        rechargeType: '',
        tradeNo: '',
        transactionTypeDesc: '',
        accountTransactionNo: '',
        payType:''
      },
      searchCondition1: {
        transactionTimes: [],
        productName: '',
        orderNo: '',
        paymentOrderNo: '',
        transactionType: '',
        createTime: '',
        rechargeType: '',
        tradeNo: '',
        transactionTypeDesc: '',
        accountTransactionNo: '',
        payType: ''
      },
      payType:[
        {
          text: '余额',
          value: 50
        },
        {
          text: '微信',
          value: 1
        },
        {
          text: '支付宝',
          value: 5
        },
        {
          text: '接口',
          value: 60
        },
        {
          text: '其他',
          value: 100
        }
      ],
      TSearchCondition: {
        // 交易单号
        accountTransactionNo: '',
        // 充值类型
        transactionType: '',
        // 充值账户
        transactionAccountNo: '',
        // 充值时间
        transactionTimes: []
      },
      TSearchCondition1: {
        // 交易单号
        accountTransactionNo: '',
        // 充值类型
        transactionType: '',
        // 充值账户
        transactionAccountNo: '',
        // 充值时间
        transactionTimes: []
      },
      userType: {
        PERSON: 100,
        CUSTOMER: 50
      },
      customer: {},
      AccountTranscations: [],
      totalCount2: 0,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      totalTranscation: {},
      transactionLoading: true,
      transactionList: [],
      rechargeList: [],
      totalCount: 0,
      pageIndex: 1,
      pageSize: 10,

      pageIndex2: 1,
      pageSize2: 10
    }
  },
  created() {
    this.fetchTranscations()
    this.fetchTotalTranscation()
    this.fetchBalance()
  },
  computed: {
    ...mapGetters(['sysUser'])
  },
  methods: {
    // 外层
    Idcheckvisible() {
      this.innerchangepwd = true
    },
    // 关闭外层
    Cancelpassword() {
      this.$refs['pwdFormRef'].resetFields()
      this.innerchangepwd = false
    },
    // 内层
    // ChangePwdvisible(formName) {
    //   this.$refs[formName].validate((valid) => {
    //       const IdCard = this.customer.idCardNo.substring(this.customer.idCardNo.length - 6, this.customer
    //         .idCardNo.length)
    //       if (this.pwdForm.idCardNo == IdCard) {
    //         this.$message.success('身份验证通过');
    //         this.innerchangepwd = true
    //       } else {
    //         this.$message.error('身份证后六位错误');
    //       }
    //   });
    // },

    // 提交
    submit() {
      this.$refs.pwdFormRef.validate(valid => {
        if (!valid) {
          return
        }
        if (this.pwdForm.newPwd == this.pwdForm.rePwd) {
          const data = { ...this.pwdForm }
          UpdatePayPwd(data).then(res => {
            if (res.data) {
              this.innerchangepwd = false
              this.$refs.pwdFormRef.resetFields()
              this.$message({
                message: '密码修改成功',
                type: 'success',
                duration: 5 * 1000
              })
            } else {
              this.$message({
                message: '密码修改失败',
                type: 'error',
                duration: 5 * 1000
              })
            }
          })
        } else {
          this.$message({
            message: '原密码与新密码不匹配',
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    // 交易明细搜索
    searchTranscation(type) {
      if (type === 'refresh') {
        this.fetchTranscations()
      } else {
        this.searchCondition1 = deepClone(this.searchCondition)
        this.pageIndex = 1
        this.fetchTranscations(true)
      }
    },
    // 交易明细
    fetchTranscations(tip) {
      this.transactionLoading = true
      const data = {
        ...this.searchCondition1,
        transactionTime: {
          item1: this.searchCondition1.transactionTimes ? this.searchCondition1.transactionTimes[0] : '',
          item2: this.searchCondition1.transactionTimes ? this.searchCondition1.transactionTimes[1] : ''
        },
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      GetTranscations(data).then(res => {
        this.transactionList = res.data.rows
        this.totalCount = res.data.total

        this.transactionLoading = false
        if (tip) {
          this.$message({
            type: 'info',
            message: '搜索成功'
          })
        }
      })
    },
    // 充值明细搜索
    TsearchTranscation(type) {
      if (type === 'refresh') {
        this.fetchAccountTranscations()
      } else {
        this.TSearchCondition1 = deepClone(this.TSearchCondition)
        this.pageIndex2 = 1
        this.fetchAccountTranscations(true)
      }
    },
    // 充值明细
    fetchAccountTranscations(tip) {
      this.transactionLoading = true
      // const data = {pageIndex: this.pageIndex2, pageSize: this.pageSize2 }
      const data = {
        ...this.TSearchCondition1,
        transactionTime: {
          item1: this.TSearchCondition1.transactionTimes ? this.TSearchCondition1.transactionTimes[0] : '',
          item2: this.TSearchCondition1.transactionTimes ? this.TSearchCondition1.transactionTimes[1] : ''
        },
        pageIndex: this.pageIndex2,
        pageSize: this.pageSize2
      }
      GetAccountTranscations(data).then(res => {
        this.AccountTranscations = res.data.rows
        this.totalCount2 = res.data.total
        this.transactionLoading = false
        if (tip) {
          this.$message({
            type: 'info',
            message: '搜索成功'
          })
        }
      })
    },

    // 收入 支出
    async fetchTotalTranscation() {
      await GetTotalTranscation(this.searchCondition1).then(res => {
        this.totalTranscation = res.data
      })
    },
    // 可用余额
    async fetchBalance() {
      if (this.sysUser.customerNo) {
        await GetCustomerResponse(this.sysUser.customerNo).then(res => {
          this.customer = res.data
        })
      }
    },
    handlePageChange(index) {
      this.pageIndex = index
      this.fetchTranscations()
    },
    onsizechange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.fetchTranscations()
    },
    handlePageChange2(index) {
      this.pageIndex2 = index
      this.fetchAccountTranscations()
    },
    onsizechange2(val) {
      this.pageSize2 = val
      this.pageIndex2 = 1
      this.fetchAccountTranscations()
    },
    handleReset(formName) {
      this.$refs[formName].resetFields()
    },
    tabClick(tab) {
      this.searchCondition1 = {}
      const tabName = tab.name
      switch (tabName) {
        case 'transcation':
          this.fetchTranscations()
          break
        case 'recharge':
          this.fetchAccountTranscations()
          break
      }
    },
    exportAccountTranscations() {
      const data = {
        ...this.searchCondition1,
        transactionTime: {
          item1: this.searchCondition1.transactionTimes[0],
          item2: this.searchCondition1.transactionTimes[1]
        },
        pageIndex: this.pageIndex,
        pageSize: 1000
      }
      GetTranscations(data).then(res => {
        const orders = res.data.rows
        import('@/vendor/Export2Excel').then(excel => {
          const filterVal = ['transcationNo', 'transcactionAmount', 'transcactionTypeDesc', 'payTypeDesc',
            'productName', 'orderNo', 'paymentOrderNo', 'refundOrderNo', 'transcationTime'
          ]
          const data = this.formatJson(filterVal, orders)
          excel.export_json_to_excel({
            header: ['交易流水号', '交易金额', '交易类型', '支付方式', '产品名称', '订单号', '支付单号', '退款单号', '交易时间'],
            data: data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
        })
        AddOperationLog('CUSTOMER_EXPORT_ACCOUNTTRAN', JSON.stringify(data))
      })
    },
    exportAccountTranscations2() {
      const data = {
        ...this.TSearchCondition1,
        transactionTime: {
          item1: this.TSearchCondition1.transactionTimes[0],
          item2: this.TSearchCondition1.transactionTimes[1]
        },
        pageIndex: this.pageIndex2,
        pageSize: 1000
      }
      GetAccountTranscations(data).then(res => {
        const orders = res.data.rows
        import('@/vendor/Export2Excel').then(excel => {
          const filterVal = ['accountTransactionNo', 'transactionBeforeAmount', 'transactionAmount', 'transactionAfterAmount',
            'transactionTypeDesc', 'transactionAccountNo', 'tradeNo', 'createTime'
          ]
          const data = this.formatJson(filterVal, orders)
          excel.export_json_to_excel({
            header: ['交易单号', '原始金额', '交易金额', '剩余金额', '操作类型', '账号/银行账号', '交易流水号', '操作时间'],
            data: data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
        })
        AddOperationLog('CUSTOMER_EXPORT_ACCOUNTTRANSCTIONS', JSON.stringify(data))
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}

</script>

<style scoped>
  .content {
    padding: 15px;
  }

  .data {
    margin-top: 10px;
  }

  .balance {
    margin-bottom: 20px;
  }

  .money {
    font-size: large;
    color: #1890FF;
  }

  .buttomstyle {
    border-color: transparent;
    color: #006699;
    background: transparent;
    padding-left: 0;
    padding-right: 0;
    float: right;
  }
  .tools-btn1{
text-align: center;
margin-top: 10px;
  }
  .tools-btn1 > button {
 margin-right: 15px;
}
	.searchForm>>>.el-form-item {
		width: 150px;
	}

	.searchForm>>>.el-range-editor {
		width: 230px !important;
	}
</style>
