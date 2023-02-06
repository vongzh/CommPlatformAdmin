<template>
  <div class="content">
    <div style="margin-bottom: 10px;">
      <el-card style="text-align:center">
        <el-steps :active="3" simple style="width: 1100px;margin: 0 auto">
          <el-step icon="el-icon-edit-outline" style="flex-basis: 33% !important;">
            <div slot="title">
              <span class="tipsText">提交售后申请</span>
              <el-button
                v-waves
                class="tipsBtn"
                type="primary"
                size="small"
                icon="el-icon-paperclip"
                @click="handleQueryOrders"
              >申请售后</el-button>
            </div>
          </el-step>
          <el-step icon="el-icon-chat-line-square" style="flex-basis: 40% !important;">
            <div slot="title">
              <span class="tipsText">客服会在30分钟内处理</span>
              <el-button
                v-waves
                class="tipsBtn"
                type="warning"
                size="small"
                icon="el-icon-phone"
                @click="handleCustomerService"
              >客服系统</el-button>
            </div>
          </el-step>
          <el-step icon="el-icon-document" style="flex-basis: 33% !important;">
            <div slot="title">
              <span class="tipsText">系统反馈处理结果</span>
            </div>
          </el-step>
        </el-steps>
        <!-- 		<el-steps :active="3" align-center>
					<el-step title="提交申请" description="提交售后申请" />
					<el-step title="客服会在30分钟内处理" description="客服会在30分钟内处理" />
					<el-step title="系统反馈处理结果" description="系统反馈处理结果" />
				</el-steps>
				<el-divider />
				<el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-paperclip"
					@click="handleQueryOrders">申请售后</el-button>
				<el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-phone"
        @click="handleCustomerService">客服系统</el-button>-->
      </el-card>
    </div>
    <div style="margin-bottom: 10px;">
      <el-card>
        <el-form
          ref="searchForm"
          :inline="true"
          :model="searchCondition"
          label-position="top"
          class="searchForm"
        >
          <el-form-item label="订单号" prop="orderNo" style="width:200px;">
            <el-input
              v-model="searchCondition.orderNo"
              clearable
              placeholder="订单号"
              class="filter-item input-search"
            />
          </el-form-item>
          <el-form-item label="酒店名称" prop="hotelName" style="width:200px;">
            <el-input
              v-model="searchCondition.hotelName"
              clearable
              placeholder="酒店名称"
              class="filter-item input-search"
            />
          </el-form-item>
          <el-form-item label="入住人" prop="checkInName" style="width:200px;">
            <el-input
              v-model="searchCondition.checkInName"
              clearable
              placeholder="入住人"
              class="filter-item input-search"
            />
          </el-form-item>
          <el-form-item label="入住人电话" prop="checkInPhone" style="width:200px;">
            <el-input
              v-model="searchCondition.checkInPhone"
              clearable
              placeholder="入住人电话"
              class="filter-item input-search"
            />
          </el-form-item>
          <el-form-item label="订单状态" prop="orderStatus" style="width:200px;">
            <el-select v-model="searchCondition.orderStatus" clearable>
              <el-option
                v-for="os in OrderStatus"
                :key="os.value"
                :label="os.text"
                :value="os.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="售后状态" prop="status" style="width:200px;">
            <el-select v-model="searchCondition.status" clearable>
              <el-option label="待处理" :value="0" />
              <el-option label="处理中" :value="5" />
              <el-option label="处理完成" :value="10" />
            </el-select>
          </el-form-item>
          <el-form-item label="入离日期" prop="orderDates" style="width:230px;">
            <el-date-picker
              v-model="searchCondition.orderDates"
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="入住日期"
              end-placeholder="离店日期"
              align="right"
            />
          </el-form-item>
          <el-form-item label="预定日期" prop="orderCreateTimes" style="width:230px;">
            <el-date-picker
              v-model="searchCondition.orderCreateTimes"
              type="daterange"
              :editable="false"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="售后处理人" prop="handlerUserName" style="width:200px;">
            <el-input
              v-model="searchCondition.handlerUserName"
              clearable
              placeholder="售后处理人"
              class="filter-item input-search"
            />
          </el-form-item>
          <!-- <el-form-item label="申请时间" prop="applyTimes" style="width: 230px;">
						<el-date-picker v-model="searchCondition.applyTimes" type="daterange" 
							:editable="false" value-format="yyyy-MM-dd" start-placeholder="开始" end-placeholder="结束" />
          </el-form-item>-->
          <el-form-item label="第三方平台" prop="sourcePlatformId" style="width:200px;">
            <el-select v-model="searchCondition.sourcePlatformId" placeholder="第三方平台" clearable>
              <el-option
                :label="item.dictLabel"
                :value="item.dictValue"
                :key="item.dictValue"
                v-for="item in merchantsDict"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="第三方订单号" prop="thirdOrderNo" style="width:200px;">
            <el-input
              v-model="searchCondition.thirdOrderNo"
              clearable
              placeholder="第三方订单号"
              class="filter-item input-search"
            />
          </el-form-item>
          <el-form-item label="　" style="user-select: none;width: 200px;">
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              size="small"
              icon="el-icon-search"
              @click="handleSearch()"
            >搜索</el-button>
            <el-button
              v-waves
              class="filter-item"
              type="warning"
              size="small"
              icon="el-icon-close"
              @click="handleReset('searchForm')"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-card>
      <!-- <div slot="header">
        <el-button type="text" @click="exportOrders">导出列表</el-button>
      </div>-->
      <div class="tools">
        <el-row>
          <el-button-group>
            <el-button
              v-waves
              size="medium"
              icon="el-icon-refresh"
              @click="handleSearch('refresh')"
            />
          </el-button-group>
          <el-popover placement="top" width="400" trigger="click">
            <el-col :span="24">
              <el-checkbox-group v-model="colOptions">
                <el-col :span="8" v-for="item in colSelect" :label="item" :key="item">
                  <el-checkbox :label="item">{{item}}</el-checkbox>
                </el-col>
              </el-checkbox-group>
            </el-col>
            <el-button slot="reference">设置</el-button>
          </el-popover>
        </el-row>
      </div>

      <el-table
        ref="tableDataRef"
        v-loading="tableLoading"
        :data="afterSaleApplies"
        :fit="true"
        border
        stripe
        highlight-current-row
      >
        <el-table-column label="订单号" min-width="7%" v-if="colData[0].istrue">
          <template slot-scope="scope">
            <el-link type="info" @click="goDetail(scope.row.orderNo)">{{ scope.row.orderNo }}</el-link>
            <i
              class="el-icon-document-copy copy"
              v-clipboard:copy="scope.row.orderNo"
              v-clipboard:success="copySuccess"
              v-clipboard:error="copyError"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="售后单号" min-width="6%" v-if="colData[1].istrue">
          <template slot-scope="scope">
            <el-col type="info" :underline="false">
              <span style="color:#3c3c3c">{{ scope.row.afterSaleNo }}</span>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column label="酒店名称" prop="hotelName" min-width="10%" v-if="colData[2].istrue"></el-table-column>
        <el-table-column label="入离日期" min-width="7%" v-if="colData[3].istrue">
          <template
            slot-scope="scope"
          >{{ dateTimeToDate(scope.row.checkInDate) }}/{{ dateTimeToDate(scope.row.checkOutDate) }}</template>
        </el-table-column>
        <el-table-column prop="orderAmount" label="订单额" min-width="6%" v-if="colData[4].istrue" />
        <el-table-column prop="checkInName" label="入住人" min-width="6%" v-if="colData[5].istrue" />
        <el-table-column prop="checkInPhone" label="电话" min-width="8%" v-if="colData[6].istrue" />
        <el-table-column prop="platform" label="订单来源" min-width="6%" v-if="colData[7].istrue" />
        <el-table-column prop="customerName" label="客户" min-width="8%" v-if="colData[8].istrue" />

        <!-- <template slot-scope="scope">
            <el-link type="info" @click="goHotel(scope.row.hotelCode)">{{ scope.row.hotelName }}</el-link>
        </template>-->

        <el-table-column
          prop="orderStatusDesc"
          label="订单状态"
          min-width="6%"
          v-if="colData[9].istrue"
        >
          <template slot-scope="scope">
            <!-- <el-tag type="success" effect="plain">{{ scope.row.orderStatucDesc }}</el-tag> -->
            <el-col type="success" effect="plain">{{ scope.row.orderStatucDesc }}</el-col>
          </template>
        </el-table-column>
        <el-table-column prop="statusDesc" label="售后状态" min-width="6%" v-if="colData[10].istrue">
          <template slot-scope="scope">
            <!-- <el-tag type="success" effect="light">{{ scope.row.statusDesc }}</el-tag> -->
            <el-col type="success" effect="light">{{ scope.row.statusDesc }}</el-col>
          </template>
        </el-table-column>
        <el-table-column v-if="colData[11].istrue" label="第三方订单号" min-width="13%">
          <template slot-scope="scope">
            <b>{{ scope.row.thirdOrderNo }}</b>
            <b v-if="scope.row.thirdOrderNo">【{{ getPlatName(scope.row.sourcePlatformId) }}】</b>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderCreateTime"
          label="预订时间"
          min-width="8%"
          v-if="colData[12].istrue"
        />
        <!-- <el-table-column prop="applyTime" label="申请时间" min-width="11%" v-if="colData[12].istrue" /> -->
        <el-table-column prop="optUser" label="售后处理人" min-width="7%" v-if="colData[13].istrue">
          <template slot-scope="scope">
            <el-col
              v-if="scope.row.status !== afterSaleApplyStatusEnum.ORIGINAL"
            >{{ scope.row.optUser }}</el-col>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="6%" v-if="colData[14].istrue">
          <template slot-scope="scope">
            <el-link style="color:#DF9524" size="mini" @click="goDetail(scope.row.orderNo,1)">详情</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="sizes,total, prev, pager, next, jumper"
          :total="totalCount"
          :page-size="pageSize"
          :page-sizes="[10,20, 50, 100]"
          :current-page="pageIndex"
          @current-change="onPageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-dialog
      title="订单售后"
      :visible.sync="orderAfterSaleVisible"
      :close-on-click-modal="false"
      :modal="false"
      modal-append-to-body
      width="75%"
      @close="closeOrderAfterWindow(false)"
    >
      <div slot="title">
        <span class="el-dialog__title">订单售后</span>
        <el-divider />
        <el-form
          ref="orderSearchForm"
          size="small"
          :inline="true"
          :model="orderSearchCondition"
          label-position="top"
        >
          <el-form-item label="订单号" prop="orderNo">
            <el-input
              v-model="orderSearchCondition.orderNo"
              clearable
              placeholder="订单号"
              class="filter-item input-search"
            />
          </el-form-item>
          <el-form-item label="手机号" prop="checkInPhone">
            <el-input
              v-model="orderSearchCondition.checkInPhone"
              clearable
              placeholder="手机号"
              class="filter-item input-search"
            />
          </el-form-item>
          <el-form-item label="入住人" prop="checkInName">
            <el-input
              v-model="orderSearchCondition.checkInName"
              clearable
              placeholder="入住人"
              class="filter-item input-search"
            />
          </el-form-item>
        </el-form>
        <div class="tools-btn">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click="handleSearch1"
          >搜索</el-button>
          <el-button
            v-waves
            class="filter-item"
            type="warning"
            size="mini"
            icon="el-icon-close"
            @click="handleReset('orderSearchForm')"
          >重置</el-button>
        </div>
        <el-divider class="divider" />
      </div>
      <el-card :body-style="{ padding:10 }">
        <!-- <div slot="header">
          <el-form ref="orderSearchForm" size="small" :inline="true" :model="orderSearchCondition" label-position="top">
            <el-form-item label="订单号" prop="orderNo">
              <el-input v-model="orderSearchCondition.orderNo" clearable placeholder="订单号" class="filter-item input-search" />
            </el-form-item>
            <el-form-item label="手机号" prop="checkInPhone">
              <el-input v-model="orderSearchCondition.checkInPhone" clearable placeholder="手机号" class="filter-item input-search" />
            </el-form-item>
            <el-form-item label="入住人" prop="checkInName">
              <el-input v-model="orderSearchCondition.checkInName" clearable placeholder="入住人" class="filter-item input-search" />
            </el-form-item>
          </el-form>
          <div class="tools-btn">
            <el-button v-waves class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleSearch1">搜索</el-button>
            <el-button v-waves class="filter-item" type="warning" size="mini" icon="el-icon-close" @click="handleReset('orderSearchForm')">重置</el-button>
          </div>
        </div>-->
        <el-table
          v-loading="orderSearchTableLoading"
          :data="orderAfterSales"
          :fit="true"
          border
          stripe
          highlight-current-row
        >
          <el-table-column label="订单号">
            <template slot-scope="scope">
              <el-link type="info">
                {{ scope.row.orderNo }}
                <br />
                【{{ scope.row.platform }}】
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="orderAmount" label="订单金额" />
          <el-table-column prop="hotelName" label="酒店名称" />
          <el-table-column prop="roomTypeName" label="房型" />
          <el-table-column prop="checkInName" label="入住人" />
          <el-table-column prop="checkInPhone" label="入住人电话" />
          <el-table-column prop="orderStatusDesc" label="订单状态" />
          <el-table-column prop="afterSaleApplyStatusDesc" label="售后状态" />
          <el-table-column label="入离日期" width="180">
            <template
              slot-scope="scope"
            >{{ dateTimeToDate(scope.row.checkInDate) }}/{{ dateTimeToDate(scope.row.checkOutDate) }}</template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.hasOwnProperty('afterSaleApplyStatus')"
                type="primary"
                size="mini"
                @click="handleApply(scope.row)"
              >申请售后</el-button>
              <el-button
                v-if="scope.row.hasOwnProperty('afterSaleApplyStatus') && (scope.row.afterSaleApplyStatus === afterSaleApplyStatusEnum.ORIGINAL || scope.row.afterSaleApplyStatus === afterSaleApplyStatusEnum.HANDLING)"
                type="success"
                size="mini"
                @click="handleAfterSaleApply(scope.row)"
              >处理售后</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            layout="sizes,total, prev, pager, next, jumper"
            :total="totalCount1"
            :page-sizes="[10,20, 50, 100]"
            :page-size="pageSize1"
            :current-page="pageIndex1"
            :hide-on-single-page="true"
            @size-change="handleSizeChange1"
            @current-change="onPageChange1"
          />
        </div>
      </el-card>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :modal="false"
      title="售后申请"
      :visible.sync="applyVisible"
      width="70%"
      @close="closeApplyWindow"
    >
      <!-- <el-card>
        <div slot="header" style="text-align:center">
          <span style="font-size:large">友情提示</span>
        </div>
        <div style="line-height:30px">
          <el-row>1、本功能仅面向前符合退款规则的订单，规则外的请联系客服进行处理。</el-row>
          <el-row>2、单个订单只能提交一次，被拒绝后将不能再次发起，请谨慎操作，订单一旦取消将无法恢复</el-row>
          <el-row>3、申请提交后，平台将会尽快帮您处理，请耐心等待30分钟（遇周末节假日会适当延长）。</el-row>
        </div>
      </el-card>-->
      <el-card style="margin-top:10px;line-height:26px">
        <!-- <div slot="header">
          <el-row>
            <el-col :span="8">
              <el-input v-model="orderNo" placeholder="订单号" clearable />
            </el-col>
            <el-col :span="10" :offset="1">
              <el-button size="mini" type="primary" @click="fetchOrder">查 询</el-button>
              <el-button size="mini" @click="clearApplyOrderNo">重 置</el-button>
            </el-col>
          </el-row>
        </div>-->
        <div v-if="order.orderNo">
          <!-- <div slot="header" style="text-align:center">
            <span style="font-size:medium;margin-bottom:20px;">订单信息</span>
          </div>-->
          <el-row>
            <el-col :span="2">
              <span style="float:right">订单号：</span>
            </el-col>
            <el-col :span="4">
              <el-link style="float:left" :underline="false">{{ order.orderNo }}</el-link>
            </el-col>
            <el-col :offset="3" :span="2">
              <span style="float:right">订单金额：</span>
            </el-col>
            <el-col :span="4">
              <el-link style="float:left" :underline="false">￥ {{ order.orderAmount }}</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <span style="float:right">酒店名称：</span>
            </el-col>
            <el-col :span="7">
              <el-link style="float:left" :underline="false">{{ order.hotelName }}</el-link>
            </el-col>
            <el-col :span="2">
              <span style="float:right">房型：</span>
            </el-col>
            <el-col :span="6">
              <el-link
                style="float:left"
                :underline="false"
              >{{ order.roomTypeName }}({{ order.roomCount }}间)</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <span style="float:right">入住人：</span>
            </el-col>
            <el-col :span="4">
              <el-link style="float:left" :underline="false">{{ order.checkInName }}</el-link>
            </el-col>
            <el-col :offset="3" :span="2">
              <span style="float:right">联系电话：</span>
            </el-col>
            <el-col :span="6">
              <el-link style="float:left" :underline="false">{{ order.checkInPhone }}</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <span style="float:right">订单状态：</span>
            </el-col>
            <el-col :span="4">
              <el-link style="float:left" :underline="false">{{ order.orderStatusDesc }}</el-link>
            </el-col>
            <el-col :offset="3" :span="2">
              <span style="float:right">入离日期：</span>
            </el-col>
            <el-col :span="6">
              <el-link
                style="float:left"
                :underline="false"
              >{{ dateTimeToDate(order.checkInDate) }}/{{ dateTimeToDate(order.checkOutDate) }}</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <span style="float:right">退改政策：</span>
            </el-col>
            <el-col :span="22">
              <el-link style="float:left" :underline="false">
                2020-04-21 07:00
                前可免费取消，当前已过最晚可取消时间（4月21日7点），订单确认后不可取消/变更，如未入住，将扣除全额房费。
              </el-link>
            </el-col>
          </el-row>
        </div>
        <div v-else style="text-align:center;font-size:small">
          <el-link :underline="false">
            <i class="el-icon-info" style="margin-right:3px" />
            {{ queryTip }}
          </el-link>
        </div>
        <div style="line-height:35px">
          <el-divider />
          <el-form ref="applyForm" :model="afterSaleApply" :rules="applyFormRule">
            <el-row>
              <!-- <el-col :span="4">售后类型：</el-col> -->
              <el-form-item label="售后类型：" prop="type" :inline-message="true" required>
                <el-col :span="4">
                  <el-select v-model="afterSaleApply.type" size="mini">
                    <el-option :value="5" label="退款" />
                    <el-option :value="1" label="其它" />
                  </el-select>
                </el-col>
                <el-col v-if="afterSaleApply.type === afterSaleApplyTypeEnum.else" :span="4">
                  <el-input
                    v-model="afterSaleApply.typeDesc"
                    type="text"
                    size="mini"
                    placeholder="请填写类型"
                    maxlength="100"
                    show-word-limit
                  />
                </el-col>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="售后原因：" prop="reason" :inline-message="true" required>
                <el-col :span="4">
                  <el-select v-model="afterSaleApply.reason" size="mini">
                    <!-- <el-option :value="5" label="行程有变" />
                  <el-option :value="-5" label="无法入住" />
                    <el-option :value="1" label="其它" />-->
                    <el-option
                      v-for="rs in reason"
                      :key="rs.value"
                      :label="rs.text"
                      :value="rs.value"
                    />
                  </el-select>
                </el-col>
                <el-col v-if="afterSaleApply.reason === afterSaleApplyReasonEnum.else" :span="4">
                  <el-input
                    v-model="afterSaleApply.reasonDesc"
                    type="text"
                    size="mini"
                    placeholder="请填写原因"
                    maxlength="300"
                    show-word-limit
                  />
                </el-col>
              </el-form-item>
              <!-- <el-col :span="4">售后原因：</el-col> -->
            </el-row>
            <el-row>
              <!-- <el-col :span="4">问题描述：</el-col> -->
              <el-form-item
                label="问题描述："
                prop="desc"
                :inline-message="true"
                style="margin-left:0.6rem"
              >
                <el-col :span="8">
                  <el-input
                    v-model="afterSaleApply.desc"
                    type="textarea"
                    rows="3"
                    size="mini"
                    maxlength="500"
                    show-word-limit
                  />
                </el-col>
              </el-form-item>
            </el-row>
          </el-form>
          <div v-if="order.orderNo" style="text-align:center;">
            <el-divider class="divider-bottom" />
            <span slot="footer" style="text-align:center;">
              <el-button
                size="small"
                :loading="applying"
                :disabled="applying"
                type="primary"
                @click="requestApply"
              >申请售后</el-button>
              <el-button size="small" @click="handleCancelApply">取 消</el-button>
            </span>
          </div>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { GetOrder, QueryOrderAfterSales } from "@/api/order/order";
import {
  QueryAfterSaleApplys,
  Apply,
  AddRecord,
  RecordEnd
} from "@/api/aftersale/aftersale";
import { GetPlatformDict } from "@/api/dict/dict";

import waves from "@/directive/waves";
import moment from "moment";
import call from "../../components/call";
import elDragDialog from "@/directive/el-drag-dialog";
import { deepClone } from "@/utils/index";
export default {
  name: "AfterSalesList",
  directives: {
    waves,
    elDragDialog
  },
  data() {
    var checkTypeDesc = (rule, value, callback) => {
      if (value === this.afterSaleApplyTypeEnum.else) {
        if (!this.afterSaleApply.typeDesc) {
          return callback(new Error("请填写类型"));
        }
      }
      callback();
    };
    var checkReasonDesc = (rule, value, callback) => {
      if (value === this.afterSaleApplyReasonEnum.else) {
        if (!this.afterSaleApply.reasonDesc) {
          return callback(new Error("请填写类型"));
        }
      }
      callback();
    };
    return {
      searchCondition: {
        orderDates: [],
        orderNo: "",
        thirdOrderNo: "",
        hotelName: "",
        orderStatus: "",
        sourcePlatformId: "",
        checkInName: "",
        checkInPhone: "",
        status: "",
        applyTimes: [],
        orderCreateTimes: [],
        handlerUserName: ""
      },
      searchCondition1: {
        orderDates: [],
        orderNo: "",
        thirdOrderNo: "",
        hotelName: "",
        orderStatus: "",
        sourcePlatformId: "",
        checkInName: "",
        checkInPhone: "",
        status: "",
        applyTimes: [],
        orderCreateTimes: [],
        handlerUserName: ""
      },
      colData: [
        {
          title: "订单号",
          istrue: true
        },
        {
          title: "售后单号",
          istrue: true
        },
        {
          title: "酒店名称",
          istrue: true
        },
        {
          title: "入离日期",
          istrue: true
        },
        {
          title: "订单金额",
          istrue: true
        },
        {
          title: "入住人",
          istrue: true
        },
        {
          title: "入住人电话",
          istrue: true
        },
        {
          title: "订单来源",
          istrue: true
        },
        {
          title: "客户",
          istrue: true
        },
        {
          title: "订单状态",
          istrue: true
        },
        {
          title: "售后状态",
          istrue: true
        },
        {
          title: "第三方订单号",
          istrue: true
        },
        {
          title: "预订时间",
          istrue: true
        },
        // {
        // 	title: "申请时间",
        // 	istrue: true
        // },
        {
          title: "售后处理人",
          istrue: true
        },
        {
          title: "操作",
          istrue: true
        }
      ],
      colOptions: [
        "订单号",
        "售后单号",
        "酒店名称",
        "入离日期",
        "订单金额",
        "入住人",
        "入住人电话",
        "订单来源",
        "客户",
        "订单状态",
        "售后状态",
        "第三方订单号",
        "申请时间",
        "售后处理人",
        "操作"
      ], //默认全选
      colSelect: [
        "订单号",
        "售后单号",
        "酒店名称",
        "入离日期",
        "订单金额",
        "入住人",
        "入住人电话",
        "订单来源",
        "客户",
        "订单状态",
        "售后状态",
        "第三方订单号",
        "申请时间",
        "售后处理人",
        "操作"
      ], //选中
      reason: [
        {
          text: "到店无房",
          value: 5
        },
        {
          text: "查无预订",
          value: 10
        },
        {
          text: "酒店不接待",
          value: 15
        },
        {
          text: "酒店设施",
          value: 20
        },
        {
          text: "客户因素",
          value: 25
        },
        {
          text: "不可抗因素",
          value: 30
        },
        {
          text: "其他",
          value: 100
        }
      ],
      OrderStatus: [
        {
          text: "预订成功",
          value: 25
        },
        {
          text: "预订失败",
          value: 30
        },
        {
          text: "已消费",
          value: 35
        },
        {
          text: "已消费退款",
          value: 40
        },
        {
          text: "已取消",
          value: -1
        }
      ],
      orderSearchCondition: {
        orderNo: "",
        checkInName: "",
        checkInPhone: ""
      },
      orderSearchCondition1: {
        orderNo: "",
        checkInName: "",
        checkInPhone: ""
      },
      afterSaleApplies: [],
      merchantsDict: [],
      tableLoading: false,
      totalCount: 0,
      pageSize: 10,
      pageIndex: 1,
      applyVisible: false,
      order: {},
      applying: false,
      // orderNo: '',
      queryTip: "请先查询订单",
      afterSaleApply: {},
      orderAfterSaleVisible: false,
      orderSearchTableLoading: false,
      orderAfterSales: [],
      totalCount1: 0,
      pageSize1: 5,
      pageIndex1: 1,
      currentCall: {},
      afterSaleApplyTypeEnum: {
        else: 1
      },
      afterSaleApplyReasonEnum: {
        else: 100
      },
      filters: {},
      afterSaleApplyStatusEnum: {
        ORIGINAL: 0,
        HANDLING: 5,
        COMPLATE: 10,
        CLOSE: -1
      },
      applyFormRule: {
        type: [
          {
            required: true,
            message: "请选择售后类型",
            trigger: "change"
          },
          {
            validator: checkTypeDesc,
            trigger: "change"
          }
        ],
        reason: [
          {
            required: true,
            message: "请选择售后原因",
            trigger: "change"
          },
          {
            validator: checkReasonDesc,
            trigger: "change"
          }
        ]
      }
    };
  },
  watch: {
    currentCall(call) {
      if (call.sessionid) {
        this.orderAfterSaleVisible = true;
        this.orderSearchCondition.checkInPhone = call.usernumber;
        this.fetchOrderAfterSales();
      }
    },
    colOptions(valArr) {
      var arr = this.colSelect.filter(i => valArr.indexOf(i) < 0); // 未选中
      this.colData.filter(i => {
        if (arr.indexOf(i.title) != -1) {
          i.istrue = false;
          this.$nextTick(() => {
            this.$refs.tableDataRef.doLayout();
          });
        } else {
          i.istrue = true;
          this.$nextTick(() => {
            this.$refs.tableDataRef.doLayout();
          });
        }
      });
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.fetchAfterSaleApplies();
      this.getDict();
    },
    getPlatName(platformId) {
      let arr = this.merchantsDict.filter(item => {
        return item.dictValue == platformId;
      });
      return arr.length > 0 ? arr[0].dictLabel : "未知";
    },
    getDict() {
      GetPlatformDict().then(res => {
        this.merchantsDict = res.data.map(item => {
          return {
            dictLabel: item.platformName,
            dictValue: item.platformId
          };
        });
      });
    },
    fetchAfterSaleApplies(tip) {
      this.tableLoading = true;
      const condition = {
        ...this.searchCondition1,
        orderDate: {
          item1: this.searchCondition1.orderDates
            ? this.searchCondition1.orderDates[0]
            : "",
          item2: this.searchCondition1.orderDates
            ? this.searchCondition1.orderDates[1]
            : ""
        },
        // applyTime: {
        // 	item1: this.searchCondition1.applyTimes ? this.searchCondition1.applyTimes[0] : '',
        // 	item2: this.searchCondition1.applyTimes ? this.searchCondition1.applyTimes[1] : ''
        // },
        orderCreateTime: {
          item1: this.searchCondition1.orderCreateTimes
            ? this.searchCondition1.orderCreateTimes[0]
            : "",
          item2: this.searchCondition1.orderCreateTimes
            ? this.searchCondition1.orderCreateTimes[1]
            : ""
        },
        PageSize: this.pageSize,
        PageIndex: this.pageIndex
      };

      QueryAfterSaleApplys(condition).then(res => {
        this.totalCount = res.data.total;
        this.afterSaleApplies = res.data.rows;
        this.tableLoading = false;
        if (tip) {
          this.$message("搜索成功");
        }
      });
    },
    fetchOrderAfterSales() {
      this.orderSearchTableLoading = true;
      const condition = {
        ...this.orderSearchCondition1,
        PageSize: this.pageSize1,
        PageIndex: this.pageIndex1
      };
      QueryOrderAfterSales(condition).then(res => {
        this.totalCount1 = res.data.total;
        this.orderAfterSales = res.data.rows;
        this.orderSearchTableLoading = false;
      });
    },
    handleCustomerService() {
      if (this.qiyuLogin) {
        this.$message.success("客服系统已经登录过了");
        return;
      }

      this.qiyuLogin = true;
      this.$layer.iframe({
        content: {
          content: call, // 传递的组件对象
          parent: this, // 当前的vue对象
          data: {
            isSuccess: this.qiyuLogin
          }
        },
        fix: false,
        area: ["450px", "620px"],
        offset: "auto",
        shadeClose: false, // 点击遮罩是否关闭
        maxmin: true, // 开启最大化最小化
        shade: false,
        title: "客服",
        cancel: () => {
          // 关闭事件
          this.qiyuLogin = false;
        }
      });
    },
    handleSearch(type) {
      if (type === "refresh") {
        this.fetchAfterSaleApplies();
      } else {
        this.searchCondition1 = deepClone(this.searchCondition);
        this.pageIndex = 1;
        this.fetchAfterSaleApplies(true);
      }
    },

    handleReset(fname) {
      this.$refs[fname].resetFields();
    },
    handleQueryOrders() {
      this.orderAfterSaleVisible = true;
    },
    handleSearch1() {
      this.orderSearchCondition1 = deepClone(this.orderSearchCondition);
      this.pageIndex1 = 1;
      this.fetchOrderAfterSales(true);
    },
    handleApply(order) {
      this.order = order;
      this.applyVisible = true;
      this.orderAfterSaleVisible = false;
    },
    handleCancelApply() {
      this.applyVisible = false;
    },
    fetchOrder() {
      const orderNo = this.orderNo;
      if (!orderNo) {
        return;
      }
      GetOrder(orderNo)
        .then(res => {
          if (res.result) {
            this.order = res.data;
          } else {
            this.queryTip = res.message;
          }

          this.loadOrder = false;
        })
        .catch(err => {
          this.queryTip = err.message;
        });
    },
    // clearApplyOrderNo() {
    //   this.orderNo = ''
    // },
    requestApply() {
      this.applying = true;
      this.$refs["applyForm"].validate(valid => {
        if (!valid) {
          this.applying = false;
          return;
        }
        const apply = {
          orderNo: this.order.orderNo,
          ...this.afterSaleApply
        };

        if (this.currentCall && this.currentCall.sessionid) {
          const record = {
            type: this.currentCall.direction,
            phone: this.currentCall.usernumber,
            sessionid: this.currentCall.sessionid,
            staffid: this.currentCall.staffid,
            staffName: this.currentCall.staffname
          };
          apply.afterSaleRecord = record;
        }

        Apply(apply)
          .then(res => {
            this.applying = false;
            if (res.data) {
              this.applyVisible = false;
              this.closeApplyWindow();
              this.fetchOrderAfterSales();
              this.fetchAfterSaleApplies();
              this.goDetail(apply.orderNo);
            } else {
              this.$message.error("售后申请失败，请稍后再试");
            }
          })
          .catch(err => {
            this.applying = false;
          });
      });
    },
    handleAfterSaleApply(order) {
      if (this.currentCall && this.currentCall.sessionid) {
        const afterSaleApply = order.afterSaleApplies.find(
          x =>
            x.status === this.afterSaleApplyStatusEnum.ORIGINAL ||
            x.status === this.afterSaleApplyStatusEnum.HANDLING
        );
        if (this.currentCall && this.currentCall.sessionid) {
          this.currentCall.afterSaleApply = afterSaleApply;
        }

        // let direction = 0
        // switch (this.currentCall.direction) {
        //   case 0:
        //     direction = 1
        //     break
        //   case 1:
        //     direction = 2
        //     break
        // }

        const record = {
          type: this.currentCall.direction,
          phone: this.currentCall.usernumber,
          sessionid: this.currentCall.sessionid,
          staffid: this.currentCall.staffid,
          staffName: this.currentCall.staffname,
          afterSaleNo: afterSaleApply.afterSaleNo
        };

        AddRecord(record).then(res => {
          if (res.data) {
            this.goDetail(order.orderNo);
          } else {
            this.$message.warning("售后处理记录新增失败，请手动处理");
          }
        });
      } else {
        this.goDetail(order.orderNo);
      }
    },
    callEnd(data) {
      if (this.currentCall && this.currentCall.afterSaleApply) {
        const afterSaleNo = this.currentCall.afterSaleApply.afterSaleNo;
        RecordEnd(afterSaleNo, data.sessionid).then(res => {
          if (res.data) {
            this.currentCall = {};
          }
        });
      }
    },
    closeApplyWindow() {
      this.$refs["applyForm"].resetFields();
      this.order = {};
      this.afterSaleApply = {};
      this.orderAfterSaleVisible = true;
    },
    closeOrderAfterWindow() {
      if (!this.applyVisible) {
        this.handleReset("orderSearchForm");
        this.orderAfterSales = [];
        this.totalCount1 = 0;
        this.pageSize1 = 5;
        this.pageIndex1 = 1;
      }
    },
    onPageChange(index) {
      this.pageIndex = index;
      this.fetchAfterSaleApplies();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.fetchAfterSaleApplies();
    },
    handleSizeChange1(val) {
      this.pageSize1 = val;
      this.pageIndex1 = 1;
      this.fetchOrderAfterSales();
    },
    onPageChange1(index) {
      this.pageIndex1 = index;
      this.fetchOrderAfterSales();
    },
    goDetail(orderNo, isdetails) {
      this.$router.push({
        path: `/aftersales/detail/${orderNo}`,
        query: {
          isdetails: isdetails
        }
      });
    },
    goHotel(hotelCode) {
      this.$router.push({
        path: `/hotel/${hotelCode}`
      });
    },
    dateTimeToDate(val) {
      return moment(val).format("YYYY-MM-DD");
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    },
    copySuccess() {
      this.$message({
        message: "复制成功",
        type: "success"
      });
    },
    copyError() {
      this.$message({
        message: "复制失败",
        type: "warning"
      });
    }
  }
};
</script>

<style scoped>
.copy {
  font-size: 12px;
  border: 1px solid #ccc;
  padding: 3px;
  margin-left: 5px;
  border-radius: 3px;
  cursor: pointer;
}

.copy:hover {
  border: 1px solid #006699;
}
.content {
  margin: 10px;
}

.pagination {
  margin-top: 1rem;
}

.divider {
  margin-top: 15px;
  margin-bottom: 0;
}

.divider-bottom {
  margin-top: 0;
  margin-bottom: 15px;
}
</style>

<style scoped>
.el-dialog__body {
  padding-top: 10px;
}

.el-form--inline .el-form-item {
  margin-bottom: 0;
}

.searchForm >>> .el-form-item {
  width: 120px;
}

.searchForm >>> .el-range-editor {
  width: 230px !important;
}
.tipsText {
  display: inline-block;
  height: 100%;
  line-height: 1;
  margin-right: 20px;
}
.tipsBtn {
  margin: 0;
}
.el-steps--simple {
  background-color: #fff;
}

.content >>> .el-steps--simple {
  padding: 0;
}

.content >>> .el-step__title,
.is-flex {
  max-width: 100% !important;
}
</style>
