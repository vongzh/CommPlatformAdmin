<template>
    <div class="app-container">
        <el-collapse value="search">
            <el-collapse-item name="search">
                <span slot="title" class="collapse-title">订单列表</span>
                <div class="filter-container">
                    <el-card>
                        <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
                            <el-form-item label="订单号" prop="orderNo">
                                <el-input v-model="searchCondition.orderNo" clearable placeholder="订单号"
                                    class="filter-item input-search" />
                            </el-form-item>
                        </el-form>
                        <div class="tools-btn">
                            <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search"
                                @click="handleSearch('search')">搜索</el-button>
                            <el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close"
                                @click="handleReset('searchForm')">重置</el-button>
                        </div>
                    </el-card>
                </div>
            </el-collapse-item>
        </el-collapse>

        <el-card>
            <div class="tools">
                <el-button-group>
                    <el-button v-waves size="medium" icon="el-icon-refresh" @click="handleSearch('refresh')" />
                </el-button-group>
            </div>
            <div class="content">
                <div class="table">
                    <el-table v-loading="tableLoading" :data="orderList" :fit="true" border highlight-current-row>
                        <el-table-column prop="orderNo" label="订单号" />
                        <el-table-column prop="courseName" label="课程名称" />
                        <el-table-column prop="price" label="课程价格(元)">
                            <template slot-scope="scope">
                                <div class="table-opt">
                                    {{ scope.row.price / 100 }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="userName" label="客户名" />
                        <el-table-column prop="schemeName" label="方案名称" />
                        <el-table-column prop="status" label="状态">
                            <template slot-scope="scope">
                                <div class="table-opt">
                                  <el-tag>{{ getStatusDescript(scope.row.status) }}</el-tag>   
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right">
                            <template slot-scope="scope">
                                <div class="table-opt">
                                    <el-button size="mini" type="info" @click="goOrderDetail(scope.row)">详情</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination background layout="sizes,total, prev, pager, next, jumper" :total="totalCount"
                            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :current-page="pageIndex"
                            @current-change="onPageChange" @size-change="handleSizeChange" />
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import {
    QueryOrders
} from '@/api/order1'
import waves from '@/directive/waves' // waves directive

export default {
    name: 'OrderList1',
    directives: {
        waves
    },
    data() {
        return {
            // 数据
            orderList: [],
            tableLoading: false,

            totalCount: 0,
            pageSize: 10,
            pageIndex: 1,

            // 搜索表单
            searchCondition: {
                orderNo: ''
            }
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.QueryOrders()
        },
        QueryOrders(param) {
            this.tableLoading = true
            param = {
                ...param,
                pageSize: this.pageSize,
                pageIndex: this.pageIndex
            }
            QueryOrders(param || {}).then(res => {
                this.totalCount = res.data.total
                this.orderList = res.data.rows
                this.tableLoading = false
            })
        },
        handleSearch(type) {
            let param = {}
            if (type !== 'refresh') {
                param = this.searchCondition
            }
            this.QueryOrders(param)

            const tip = (type === 'refresh' ? '刷新' : '搜索') + '成功'
            this.$message(tip)
        },
        handleReset(formName) {
            this.$refs[formName].resetFields()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.pageIndex = 1

            this.QueryOrders(this.searchCondition)
        },
        onPageChange(index) {
            this.pageIndex = index
            
            this.QueryOrders(this.searchCondition)
        },
        goOrderDetail(order){
            this.$router.push({
					path: `/orderdetail1/${order.orderNo}`
				})
        },
        getStatusDescript(val) {
            let status = '未知'
            switch (val) {
                case 0:
                    status = '待支付'
                    break; case 5:
                    status = '部分支付'
                    break;
                case 10:
                    status = '已完成'
                    break;
            }
            return status;
        }
    }
}
</script>

<style scoped>
.dialog-footer {
    text-align: center;
}

.pagination {
    margin-top: 1rem;
}
</style>
