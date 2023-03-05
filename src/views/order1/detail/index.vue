<template>
    <div class="content">
        <el-col :xl="4" :lg="2"><br></el-col>
        <el-col :xl="16" :lg="20">
            <el-card class="info" shadow="never">
                <div slot="header" class="info-header">
                    <svg-icon icon-class="dingdan_1" />
                    <span type="primary" class="titlecss">订单详情</span>
                </div>
                <el-row class="orderinfoline">
                    <el-col :span="8" class="orderinfocol">
                        <el-row>
                            <el-col :span="12" class="right-align">
                                <span class="orderinfo">订单编号：</span>
                            </el-col>
                            <el-col :span="12" class="left-align">{{ Order.orderNo }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="8" class="orderinfocol">
                        <el-row>
                            <el-col :span="12" class="right-align">
                                <span class="orderinfo">订单生成时间：</span>
                            </el-col>
                            <el-col :span="12" class="left-align">{{ Order.orderNo }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="8" />
                </el-row>
                <el-row class="orderinfoline">
                    <el-col :span="8" class="orderinfocol">
                        <el-row>
                            <el-col :span="12" class="right-align">
                                <span class="orderinfo">支付方案：</span>
                            </el-col>
                            <el-col :span="12" class="left-align">{{ Order.schemeName }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="8" />
                    <el-col :span="8" />
                </el-row>
            </el-card>
            <el-card class="info" shadow="never">
                <div slot="header" class="info-header">
                    <svg-icon icon-class="dingdan_1" />
                    <span type="primary" class="titlecss">学员信息</span>
                </div>
                <el-row class="orderinfoline">
                    <el-col :span="8" class="orderinfocol">
                        <el-row>
                            <el-col :span="12" class="right-align">
                                <span class="orderinfo">姓名：</span>
                            </el-col>
                            <el-col :span="12" class="left-align">{{ Order.userName }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="8">
                        <el-row>
                            <el-col :span="12" class="right-align">
                                <span class="orderinfo">手机号：</span>
                            </el-col>
                            <el-col :span="12" class="left-align">{{ Order.orderNo }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="8" />
                </el-row>
            </el-card>
            <el-card class="info" shadow="never">
                <div slot="header" class="info-header">
                    <svg-icon icon-class="dingdan_1" />
                    <span type="primary" class="titlecss">课程信息</span>
                </div>
                <el-row class="orderinfoline">
                    <el-col :span="8">
                        <el-row>
                            <el-col :span="12" class="right-align">
                                <span class="orderinfo">课程名称：</span>
                            </el-col>
                            <el-col :span="12" class="left-align">{{ Order.courseName }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="8">
                        <el-row>
                            <el-col :span="12" class="right-align">
                                <span class="orderinfo">课程价格：</span>
                            </el-col>
                            <el-col :span="12" class="left-align">{{ Order.price / 100 }} 元</el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row class="orderinfoline">
                    <el-col :span="8">
                        <el-row>
                            <el-col :span="12" class="right-align">
                                <span class="orderinfo">课程周期：</span>
                            </el-col>
                            <el-col :span="12" class="left-align">{{ Order.duration }} 天</el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="8" />
                </el-row>
            </el-card>
            <el-card class="info" shadow="never">
                <div slot="header" class="info-header">
                    <svg-icon icon-class="dingdan_1" />
                    <span type="primary" class="titlecss">支付信息</span>
                </div>
                <el-row class="orderinfoline">
                    <div class="content">
                        <div class="table">
                            <el-table v-loading="tableLoading" :data="paymentOrders" :fit="true" border
                                highlight-current-row>
                                <el-table-column prop="periods" label="期数" />
                                <el-table-column prop="classAmount" label="学费">
                                    <template slot-scope="scope">
                                        <div class="table-opt">
                                            {{ scope.row.classAmount / 100 }}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="serviceAmount" label="服务费">
                                    <template slot-scope="scope">
                                        <div class="table-opt">
                                            {{ scope.row.serviceAmount / 100 }}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="paymentStatus" label="支付状态" >
                                    <template slot-scope="scope">
                                        <div class="table-opt">
                                            <el-tag> {{ scope.row.paymentStatus===5?'已支付':'待支付' }}</el-tag>   
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="paymentTime" label="支付时间" />
                            </el-table>
                        </div>
                    </div>
                </el-row>
            </el-card>
        </el-col>
    </div>
</template>
  
<script>
import {
    GetOrder,
    GetPaymentOrders
} from '@/api/order1'
import moment from 'moment'
import permission from '@/directive/permission'
import {
    mapGetters
} from 'vuex'
export default {
    filters: {
        dateToStr(date) {
            return moment(date).format('YYYY-MM-DD')
        },
        ellipsis(value) {
            if (!value) return ''
            if (value.length > 8) {
                return value.slice(0, 8) + '...'
            }
            return value
        }
    },
    directives: {
        permission
    },
    data() {
        return {
            Order: {},
            paymentOrders: []
        }
    },
    computed: {
        ...mapGetters([
            'sysUser'
        ])
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            if (this.getUrlParams()) {
                this.fetchOrder()
            }
        },

        getUrlParams() {
            const query = this.$route.params
            if (!query || !query.orderNo) {
                this.$alert('请返回重试', '订单查询失败', {
                    confirmButtonText: '确定',
                    type: 'error',
                    callback: action => {
                        this.$router.push({
                            path: '/orderlist1'
                        })
                    }
                })
                return false
            }
            this.Order.orderNo = query.orderNo
            return true
        },
        fetchOrder() {
            const loading = this.$loading({
                lock: true,
                text: '正在加载订单',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            GetOrder(this.Order.orderNo).then(res => {
                const code = res.code
                if (code !== 0) {
                    this.$alert('请返回重试', '订单查询失败', {
                        confirmButtonText: '确定',
                        type: 'error',
                        callback: action => {
                            this.$router.push({
                                path: '/orderlist1'
                            })
                        }
                    })
                    loading.close()
                    return false
                }
                this.Order = res.data

                this.fetchPaymentOrders();

                loading.close()
            })
        },
        fetchPaymentOrders() {
            GetPaymentOrders(this.Order.orderNo, this.Order.openId)
                .then(res => {
                    this.paymentOrders = res.data
                })
        }
    }
}
</script>
  
<style scoped>
.info {
    margin: 15px;
}

::v-deep .el-card__header {
    padding: 0;
    border-bottom: none;
}

.el-divider {
    background-color: #ffffff;
    margin: 0;
}

.info-header {
    font-size: 20px;
    line-height: 60px;
    padding-left: 10px;
    margin-left: 0;
}

.refund-header {
    padding: 0.625rem;
    padding-bottom: 0;
}

.refund-header .el-row {
    font-size: small;
    height: 2.5rem;
}

::v-deep .el-card__header {
    padding: 0;
    border-bottom: none;
}

.right-align {
    font-size: 13px;
    padding-right: 10px;
    text-align: right;
    line-height: 20px;
}

.left-align {
    line-height: 20px;
    float: left;
    font-size: 13px;
    color: #606266;
    font-family: '微软雅黑';
}

::v-deep .el-card__body {
    padding: 0 20px 0 20px;
}

.orderinfo {
    font-weight: 600;
    font-size: 13px;
    color: #606266;
    font-family: '微软雅黑';
}

.orderinfoline {
    margin-bottom: 20px;
    margin-top: 20px;
    text-align: left;
}

.orderinfocol {
    text-align: center;
}

.opt {
    float: right;
}

.order-setp {
    margin-left: 3%;
    margin-top: 1.5rem;
}

.el-link {
    cursor: default;
}

.el-link.el-link--default:hover {
    color: #606266;
}

.purchase-order-info {
    line-height: 40px;
}

.ml5 {
    margin-left: 5px;
}

.titlecss {
    padding-left: 5px;
    color: #006699;
    opacity: 0.7;
    filter: alpha(opacity=70);
    font-weight: 600;
}

.www {
    height: 10px;
}

::v-deep .el-table th>.cell {
    color: #606266;
    text-align: center;
}

::v-deep .el-table__body td {
    text-align: center;
}

::v-deep .el-table th {
    background: #ffffff;
    opacity: 1;
}

.left-align {
    font-size: 13px;
}

.text-right {
    font-size: 13px;
    text-align: right;
}

::v-deep .el-table th {
    border-right: 0
}

::v-deep .el-table th.el-table__cell {
    background-color: #fff;
}
</style>