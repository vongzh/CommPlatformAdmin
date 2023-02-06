<template>
  <div class="content">
    <el-card>
      <div slot="header">
        <span>注册信息</span>
      </div>
      <div class="info">
        <el-row>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle"
              >注册用户名：</el-link
            >
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float: left">{{
              sysUser.userName
            }}</el-link>
          </el-col>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle"
              >注册手机号：</el-link
            >
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float: left">{{
              sysUser.mobile
            }}</el-link>
          </el-col>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">状态：</el-link>
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float: left">{{
              sysUser.statusDesc
            }}</el-link>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="2">
            <el-link :underline="false" class="titlestyle">用户编号：</el-link>
          </el-col>
          <el-col :span="3">
            <el-link :underline="false">{{ sysUser.userId }}</el-link>
          </el-col>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">用户类型：</el-link>
          </el-col>
          <el-col :span="3">
            <el-link :underline="false">{{ sysUser.userTypeDesc }}</el-link>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">注册时间：</el-link>
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float: left">{{
              sysUser.registerTime
            }}</el-link>
          </el-col>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">最后登录：</el-link>
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float: left">
              {{ sysUser.lastLoginTime }}</el-link
            >
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card style="margin-top: 20px">
      <div slot="header">
        <span>客户信息</span>
      </div>
      <div class="info">
        <el-row>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">客户编号：</el-link>
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float: left">{{
              customer.customerNo
            }}</el-link>
          </el-col>
          <el-col
            v-if="customer.customerType === CustomerTypeEnum.COMPANY"
            :span="2"
          >
            <el-link :underline="false" class="titlestyle">公司名称：</el-link>
          </el-col>
          <el-col
            v-if="customer.customerType === CustomerTypeEnum.COMPANY"
            :span="5"
          >
            <el-link :underline="false" style="float: left">{{
              customer.companyName
            }}</el-link>
          </el-col>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">客户类型：</el-link>
          </el-col>
          <el-col :span="4">
            <el-link :underline="false" style="float: left">{{
              customer.customerTypeDesc
            }}</el-link>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            v-if="customer.customerType === CustomerTypeEnum.COMPANY"
            :span="2"
          >
            <el-link :underline="false" class="titlestyle">所属行业：</el-link>
          </el-col>
          <el-col
            v-if="customer.customerType === CustomerTypeEnum.COMPANY"
            :span="5"
          >
            <el-link :underline="false" style="float: left">{{
              customer.industryDesc
            }}</el-link>
          </el-col>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">联系人：</el-link>
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float: left">{{
              customer.contactName
            }}</el-link>
          </el-col>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">联系方式：</el-link>
          </el-col>
          <el-col :span="4">
            <el-link :underline="false" style="float: left">{{
              customer.contactPhone
            }}</el-link>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">联系邮箱：</el-link>
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float: left">{{
              customer.email
            }}</el-link>
          </el-col>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle"
              >身份证姓名：</el-link
            >
          </el-col>
          <el-col :span="5">
            <el-link :underline="false" style="float: left">{{
              customer.realName
            }}</el-link>
          </el-col>

          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">身份证号：</el-link>
          </el-col>
          <el-col :span="3">
            <el-link :underline="false" style="float: left">{{
              customer.idCardNo
            }}</el-link>
          </el-col>
          <el-col
            v-if="customer.customerType === CustomerTypeEnum.COMPANY"
            :span="1"
          >
            <el-popover placement="top" trigger="click" width="500">
              <el-image
                v-if="
                  customer.idCardDisplayImgs &&
                  customer.idCardDisplayImgs.length > 0
                "
                :src="customer.idCardDisplayImgs[0].item2"
                :preview-src-list="
                  customer.idCardDisplayImgs.map((x) => {
                    return x.item2
                  })
                "
              />
              <el-link v-else>暂无图片</el-link>
              <el-link
                slot="reference"
                type="primary"
                @click="
                  addOperationLog('CUSTOMER_IDCARD_VIEW', customer.customerNo)
                "
                >正面</el-link
              >
            </el-popover>
          </el-col>

          <el-col
            v-if="customer.customerType === CustomerTypeEnum.COMPANY"
            :span="1"
          >
            <el-popover
              v-if="
                customer.idCardDisplayImgs[1] &&
                customer.idCardDisplayImgs.length > 0
              "
              placement="top"
              trigger="click"
              width="500"
            >
              <el-image
                v-if="
                  customer.idCardDisplayImgs[1] &&
                  customer.idCardDisplayImgs.length > 0
                "
                :src="customer.idCardDisplayImgs[1].item2"
                :preview-src-list="
                  customer.idCardDisplayImgs.map((x) => {
                    return x.item2
                  })
                "
              />
              <el-link v-else>暂无图片</el-link>
              <el-link
                slot="reference"
                type="primary"
                @click="
                  addOperationLog('CUSTOMER_IDCARD_VIEW', customer.customerNo)
                "
                >反面</el-link
              >
            </el-popover>
          </el-col>
        </el-row>

        <!-- <el-row>
          <el-col :span="2">
            <el-link :underline="false">用户编号：</el-link>
          </el-col>
          <el-col :offset="1" :span="2">
            <el-link :underline="false">{{ customer.sysUserId }}</el-link>
          </el-col>
        </el-row> -->

        <el-row v-if="customer.customerType === CustomerTypeEnum.COMPANY">
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle"
              >营业执照编号：</el-link
            >
          </el-col>
          <el-col :span="3">
            <el-link :underline="false" style="float: left">{{
              customer.businessLicenseNo
            }}</el-link>
          </el-col>

          <el-col :span="1">
            <el-popover placement="top" trigger="click" width="500">
              <el-image
                v-if="
                  customer.businessLicenseDisplayImgs &&
                  customer.businessLicenseDisplayImgs.length > 0
                "
                :src="customer.businessLicenseDisplayImgs[0].item2"
                :preview-src-list="
                  customer.businessLicenseDisplayImgs.map((x) => {
                    return x.item2
                  })
                "
              />
              <el-link v-else>暂无图片</el-link>
              <el-link
                slot="reference"
                type="primary"
                @click="
                  addOperationLog('CUSTOMER_BUSINES_VIEW', customer.customerNo)
                "
                >正面</el-link
              >
            </el-popover>
          </el-col>
          <div>
            <el-col
              v-if="
                customer.businessLicenseDisplayImgs[1] &&
                customer.businessLicenseDisplayImgs.length > 0
              "
              :span="1"
            >
              <el-popover placement="top" trigger="click" width="500">
                <el-image
                  v-if="
                    customer.businessLicenseDisplayImgs[1] &&
                    customer.businessLicenseDisplayImgs.length > 0
                  "
                  :src="customer.businessLicenseDisplayImgs[1].item2"
                  :preview-src-list="
                    customer.businessLicenseDisplayImgs.map((x) => {
                      return x.item2
                    })
                  "
                />
                <el-link v-else>暂无图片</el-link>
                <el-link
                  slot="reference"
                  type="primary"
                  @click="
                    addOperationLog(
                      'CUSTOMER_BUSINES_VIEW',
                      customer.customerNo
                    )
                  "
                  >反面</el-link
                >
              </el-popover>
            </el-col>
            <el-col v-else :span="1" style="height: 1px" />
          </div>
          <el-col
            v-if="customer.customerType === CustomerTypeEnum.COMPANY"
            :span="2"
          >
            <el-link :underline="false" class="titlestyle">是否法人：</el-link>
          </el-col>
          <el-col
            v-if="customer.customerType === CustomerTypeEnum.COMPANY"
            :span="5"
          >
            <el-link :underline="false" style="float: left">{{
              customer.isLegalPerson === YNEnum.Y ? '是' : '否'
            }}</el-link>
          </el-col>

          <el-col
            v-if="
              customer.customerType === CustomerTypeEnum.COMPANY &&
              customer.isLegalPerson === YNEnum.N
            "
            :span="2"
          >
            <el-link :underline="false" class="titlestyle">授权人：</el-link>
          </el-col>
          <el-col
            v-if="
              customer.customerType === CustomerTypeEnum.COMPANY &&
              customer.isLegalPerson === YNEnum.N
            "
            :span="3"
          >
            <el-link :underline="false" style="float: left">{{
              customer.certigier
            }}</el-link>
          </el-col>
          <el-col
            v-if="
              customer.customerType === CustomerTypeEnum.COMPANY &&
              customer.isLegalPerson === YNEnum.N
            "
            :span="1"
          >
            <el-popover placement="top" trigger="click" width="500">
              <el-image
                v-if="
                  customer.authorizationDisplayImgs &&
                  customer.authorizationDisplayImgs.length > 0
                "
                :src="customer.authorizationDisplayImgs[0].item2"
                :preview-src-list="
                  customer.authorizationDisplayImgs.map((x) => {
                    return x.item2
                  })
                "
              />
              <el-link v-else>暂无图片</el-link>
              <el-link slot="reference" type="primary">正面</el-link>
            </el-popover>
          </el-col>

          <el-col
            v-if="
              customer.customerType === CustomerTypeEnum.COMPANY &&
              customer.isLegalPerson === YNEnum.N &&
              customer.authorizationDisplayImgs[1] &&
              customer.authorizationDisplayImgs.length > 0
            "
            :span="1"
          >
            <el-popover placement="top" trigger="click" width="500">
              <el-image
                v-if="
                  customer.authorizationDisplayImgs &&
                  customer.authorizationDisplayImgs.length > 0
                "
                :src="customer.authorizationDisplayImgs[1].item2"
                :preview-src-list="
                  customer.authorizationDisplayImgs.map((x) => {
                    return x.item2
                  })
                "
              />
              <el-link v-else>暂无图片</el-link>
              <el-link slot="reference" type="primary">反面</el-link>
            </el-popover>
          </el-col>
        </el-row>
        <!--
        <el-row v-if="customer.customerType === CustomerTypeEnum.COMPANY && customer.isLegalPerson === YNEnum.N">

        </el-row> -->
      </div>
    </el-card>
    <el-card style="margin-top: 20px">
      <div slot="header" >
        <span>客户账户</span>
      </div>
      <div class="info">
        <el-row>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">账户余额：</el-link>
          </el-col>
          <el-col :span="5" v-if="customer.accountCode">
            <el-link :underline="false" style="float: left">{{
              customer.accountRealBalance
            }}</el-link>
          </el-col>
          <el-col :span="5" v-else>
            <el-link :underline="false" style="float: left">{{
              '未开户'
            }}</el-link>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" size="mini" @click="Recharge()">充值</el-button>
          </el-col>
          <el-col :span="5">
            <el-button type="success" size="mini" @click="ResetPayPwd()">重置密码</el-button>
          </el-col>
        </el-row>
      <el-row>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">虚拟余额：</el-link>
          </el-col>
          <el-col :span="5" v-if="customer.accountCode">
            <el-link :underline="false" style="float: left">{{
              customer.accountVirtualBalance
            }}</el-link>
          </el-col>
           </el-row>
      </div>
    </el-card>
    <el-card
      v-if="
        customer.auditStatus === CustomerAuditEnum.WAITAUDIT ||
        customer.auditStatus === CustomerAuditEnum.REJECT
      "
      style="margin-top: 20px"
    >
      <div slot="header">
        <span>客户信息审核</span>
      </div>
      <div class="info">
        <el-row>
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">审核状态：</el-link>
          </el-col>
          <el-col :span="3">
            <el-link :underline="false" style="float: left">{{
              customer.auditStatusDesc
            }}</el-link>
          </el-col>
        </el-row>
        <el-row v-if="customer.auditStatus !== CustomerAuditEnum.WAITAUDIT">
          <el-col :span="2">
            <el-link :underline="false" class="titlestyle">审核原因：</el-link>
          </el-col>
          <el-col :span="3">
            <el-link :underline="false" style="float: left">{{
              customer.auditDesc
            }}</el-link>
          </el-col>
        </el-row>
        <el-divider />
        <div v-if="customer.auditStatus === CustomerAuditEnum.WAITAUDIT">
          <el-row>
            <el-col :span="2">
              <el-link :underline="false" class="titlestyle"
                >审核结果：</el-link
              >
            </el-col>
            <el-radio-group v-model="audit.auditStatus">
              <el-radio :label="10">通过</el-radio>
              <el-radio :label="-5">驳回</el-radio>
            </el-radio-group>
          </el-row>
          <el-row>
            <el-col :span="2">
              <el-link :underline="false" class="titlestyle"
                >审核内容：</el-link
              >
            </el-col>
            <el-col :span="4">
              <el-input
                v-model="audit.auditDesc"
                placeholder="请输入审核通过/驳回原因"
                type="textarea"
                :rows="3"
              />
            </el-col>
          </el-row>
          <el-row class="opt">
            <el-col :span="2">
              <el-link />
            </el-col>
            <el-col :span="2">
              <el-button type="primary" size="mini" @click="handlerAudit"
                >提交</el-button
              >
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <el-card
      v-if="customer.auditStatus === CustomerAuditEnum.PASS"
      style="margin-top: 20px"
    >
      <div slot="header">
        <span>权限设置</span>
      </div>
      <div class="info">
        <el-row>
          <el-col :span="2">
            <el-link :underline="false">状态：</el-link>
          </el-col>
          <el-col :span="3">
            <el-radio-group v-model="sysUser.disabled">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row class="opt">
          <el-col :span="2">
            <el-link />
          </el-col>
          <el-col :span="2">
            <el-button type="primary" size="mini" @click="disabledSysUser"
              >保存</el-button
            >
          </el-col>
        </el-row>
        <el-divider />
        <el-row>
          <el-col :span="2">
            <el-link :underline="false">角色：</el-link>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="userRoles"
              size="mini"
              type="textarea"
              :rows="3"
              disabled
              style="font-size: Small"
            />
          </el-col>
          <el-col :offset="2" :span="2">
            <el-link :underline="false">用户组：</el-link>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="userGroups"
              type="textarea"
              :rows="3"
              size="mini"
              disabled
              style="font-size: Small"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <el-link />
          </el-col>
          <el-col class="opt" :span="3">
            <el-button type="primary" size="mini" @click="handleRole"
              >角色分配</el-button
            >
          </el-col>
          <el-col :span="2">
            <el-link />
          </el-col>
          <el-col class="opt" :offset="2" :span="3">
            <el-button type="primary" size="mini" @click="handleGroup"
              >用户组分配</el-button
            >
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-dialog
      :visible.sync="rolePanelVisiable"
      title="用户角色"
      center
      @close="handleResetRole"
    >
      <el-transfer
        v-model="userRoleList"
        filterable
        :titles="roleTitle"
        :props="roleListProps"
        :data="roleList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveRole()">保存</el-button>
        <el-button @click="handleResetRole">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="groupPanelVisiable"
      title="用户组"
      center
      @close="handleResetGroup"
    >
      <el-transfer
        v-model="userGroupList"
        filterable
        :titles="groupTitle"
        :props="groupListProps"
        :data="groupList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveGroup()">保存</el-button>
        <el-button @click="handleResetGroup">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="用户充值"
      :visible.sync="RechargeVisiable"
      width="35%"
      :close-on-click-modal="false"
    >
      <el-form :model="RechargeForm" ref="RechargeRef" :rules="ReRules">
        <el-form-item
          label="充值金额"
          :label-width="formLabelWidth"
          prop="reChargeAmount"
        >
          <el-input-number
            v-model="RechargeForm.reChargeAmount"
            :precision="2"
            :step="10"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="充值虚拟金额"
          :label-width="formLabelWidth"
          prop="reChargeVirtualAmount"
        >
          <el-input-number
            v-model="RechargeForm.reChargeVirtualAmount"
            :precision="2"
            :step="10"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="充值类型"
          :label-width="formLabelWidth"
          prop="operationType"
        >
          <el-select
            v-model="RechargeForm.operationType"
            placeholder="请选择充值类型"
            clearable
          >
            <el-option label="线上" :value="1"/>
            <el-option label="线下" :value="2"/>
            <el-option label="调整" :value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="支付方式"
          :label-width="formLabelWidth"
          prop="rechargeWay"
          clearable
        >
          <el-select
            v-model="RechargeForm.paymentType"
            placeholder="请选择支付方式"
            @change="currentSel"
            clearable
          >
            <el-option label="微信" :value="1"/>
            <el-option label="支付宝" :value="5"/>
            <el-option label="银行卡" :value="70"/>
          </el-select>
        </el-form-item>
        <el-form-item
        v-if="RechargeForm.paymentType===PayType.BANKCARD"
          label="银行卡号"
          :label-width="formLabelWidth"
          style="width: 50%"
          prop="transactionAccountNo"
          clearable
        >
          <el-input
            v-model="RechargeForm.transactionAccountNo"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
        v-if="RechargeForm.paymentType===PayType.WECHAT||RechargeForm.paymentType===PayType.Alipay"
        label="账号"
        :label-width="formLabelWidth"
        style="width: 50%"
        prop="transactionAccountNo"
        clearable
      >
        <el-input
          v-model="RechargeForm.transactionAccountNo"
          autocomplete="off"
        />
      </el-form-item>
        <el-form-item
        v-if="RechargeForm.paymentType===PayType.BANKCARD"
          label="银行名称"
          :label-width="formLabelWidth"
          prop="bankName"
          clearable
        >
          <el-select
            v-model="RechargeForm.bankName"
            placeholder="请选择银行名称"
          >
            <el-option
              v-for="bk in bankList"
              :key="bk.value"
              :label="bk.text"
              :value="bk.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="交易流水号"
          :label-width="formLabelWidth"
          style="width: 50%"
          prop="tradeNo"
          clearable
        >
          <el-input
            v-model="RechargeForm.tradeNo"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          :label-width="formLabelWidth"
          prop="remark"
          style="width: 50%"
          clearable
        >
          <el-input
            v-model="RechargeForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmitRecharge()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
  title="提示"
  :visible.sync="ChangePwd"
  width="30%">
  <span>这是一段信息</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="ChangePwd = false">取 消</el-button>
    <el-button type="primary" @click="ChangePwd = false">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>
<script>
import { GetCustomerResponse, AuditCustomer } from '@/api/customer/customer'
import { getUserInfo, disabledSysUser } from '@/api/sys/user'
import { getAllRoles, getUserRoles, saveUserRoles } from '@/api/sys/role'
import { getAllUserGroups, WalletRecharge } from '@/api/sys/user-group'
import { getUserGroups, saveUserGroups } from '@/api/sys/usergroup-user'
import { AddOperationLog } from '@/api/sys/log'
import {ResetPayPwd} from '@/api/account/account'
export default {
  data() {
    return {
      ChangePwd:false,
      customer: {
        customerNo: '',
        idCardImgs: [],
      },
      sysUser: {},
      audit: {
        auditStatus: 10,
      },
      // 角色
      rolePanelVisiable: false,
      userRoles: '',
      userRoleList: [],
      roleTitle: [],
      roleList: [],
      roleListProps: {
        key: 'id',
        label: 'roleName',
        disabled: 'false',
      },

      // 用户组
      groupPanelVisiable: false,
      userGroups: '',
      userGroupList: [],
      groupTitle: [],
      groupList: [],
      groupListProps: {
        key: 'id',
        label: 'groupName',
        disabled: 'false',
      },

      // 枚举
      CustomerTypeEnum: {
        COMPANY: 1,
        PERSON: 2,
      },
      CustomerAuditEnum: {
        REJECT: -5,
        WAITAUDIT: 0,
        PASS: 10,
      },
      YNEnum: {
        Y: 1,
        N: 0,
      },
      bankList: [
        {
          text: '中国人民银行',
          value: 1,
        },
        {
          text: '中国工商银行',
          value: 2,
        },
        {
          text: '中国农业银行',
          value: 3,
        },
        {
          text: '中国建设银行',
          value: 4,
        },
        {
          text: '中国交通银行',
          value: 5,
        },
        {
          text: '招商银行',
          value: 6,
        },
        {
          text: '浦发银行',
          value: 7,
        },
        {
          text: '民生银行',
          value: 8,
        },
        {
          text: '邮政银行',
          value: 9,
        },
      ],

      ReRules: {
        reChargeAmount: [
          {
            required: true,
            message: '请输入充值金额',
            trigger: 'blur',
            type: 'number',
          },
        ],
        operationType: [
          {
            required: true,
            message: '请选择充值类型',
            trigger: 'blur',
          },
        ],
        paymentType: [
          {
            required: true,
            message: '请选择支付方式',
            trigger: 'blur',
          },
        ],
        tradeNo:[
          {
            required:true,
            message:'请输入交易流水号',
            trigger:'blur',
          }
        ]
      },
      PayType:{
        WECHAT:1,
        Alipay:5,
        BANKCARD:70
      },
      ReInput: false,
      ReOnline: false,
      RechargeVisiable: false,
      RechargeForm: {
        //金额
        reChargeAmount: '',
        //充值，提现，调整
        transactionType:1,
        //充值类型
        operationType: '',
        //支付方式
        paymentType: '',
        //银行卡号/账号
        transactionAccountNo:'',
        //银行名称
        bankName: '',
        //交易流水号
        tradeNo: '',
        //备注
        remark: '',
      },
      formLabelWidth: '90px',
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getUrlParams()
      if (this.customer.customerNo) {
        this.fetchCustomerInfo()
      } else {
        this.error()
      }
    },
    getUrlParams() {
      const query = this.$route.query
      if (query && query.customerNo) {
        this.customer.customerNo = query.customerNo
      }
    },
    fetchCustomerInfo() {
      GetCustomerResponse(this.customer.customerNo)
        .then((res) => {
          if (res.result) {
            this.customer = res.data
            // 用户信息
            this.fetchUserInfo()
          }
          // eslint-disable-next-line handle-callback-err
        })
        // eslint-disable-next-line handle-callback-err
        .catch((err) => {
          this.error()
        })
    },
    currentSel(val){
      //选项切换时清空上一个选项的数据
      if(val==1||val==5){
        //选择微信/支付宝时，隐藏并清除银行卡号，银行名称数据
        this.RechargeForm.transactionAccountNo=''
        this.RechargeForm.bankName=''
      }
      if(val==70){
        //选择银行卡时，隐藏并清除账号数据
        this.RechargeForm.transactionAccountNo=''
      }
    },
    fetchUserInfo() {
      getUserInfo(this.customer.sysUserId)
        .then((res) => {
          if (res.result) {
            this.sysUser = res.data

            // 角色信息
            this.getRoles().then(() => {
              this.getUserRoles(this.sysUser.userId)
            })

            // 用户组
            this.getGroups().then(() => {
              this.getUserGroups(this.sysUser.userId)
            })
          }
        })
        .catch((err) => {
          this.error(err)
        })
    },
    getAuditStatusDesc(status) {
      let auditStatusDesc = ''
      switch (status) {
        case this.CustomerAuditEnum.PASS:
          auditStatusDesc = '通过'
          break
        case this.CustomerAuditEnum.REJECT:
          auditStatusDesc = '驳回'
          break
        default:
          break
      }
      return auditStatusDesc
    },
    handlerAudit() {
      if (!this.audit.auditDesc) {
        this.$message({
          type: 'warning',
          message: '请填写审核原因',
        })
        return
      }

      const auditResult = this.getAuditStatusDesc(this.audit.auditStatus)
      const tip = `确定要审核${auditResult}吗？`
      const desc = `审核原因：<p><b>${this.audit.auditDesc}</b></p>`
      this.$confirm(desc, tip, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        dangerouslyUseHTMLString: true,
      })
        .then(() => {
          const param = {
            customerNo: this.customer.customerNo,
            ...this.audit,
          }
          AuditCustomer(param).then((res) => {
            if (res.data) {
              this.fetchCustomerInfo()

              this.$message({
                type: 'success',
                message: '审核成功',
              })
            } else {
              this.$message({
                type: 'info',
                message: '审核失败，请稍后再试',
              })
            }
            // eslint-disable-next-line handle-callback-err
          })
        })
        .catch(() => {})
    },
    disabledSysUser() {
      const disabled = this.sysUser.disabled
      disabledSysUser(disabled, this.sysUser.userId).then((res) => {
        if (res.data) {
          this.fetchCustomerInfo()
          this.$message('操作成功')
        } else {
          this.$message(res.message || '操作失败')
        }
      })
    },
    async getRoles() {
      await getAllRoles().then((res) => {
        this.roleList = res.data
      })
    },
    getUserRoles(sysUserId) {
      getUserRoles(sysUserId).then((res) => {
        this.userRoleList = res.data.map((val, idx, arr) => {
          return val.roleId
        })

        const userRoles = this.roleList
          .filter((item, index, arr) => {
            return this.userRoleList.indexOf(item.id) !== -1
          })
          .map((val, index, arr) => {
            return val.roleName
          })
        this.userRoles = userRoles.join('\n')
      })
    },
    Recharge() {
      this.RechargeVisiable = true
    },
    //充值
    handleSubmitRecharge() {
      this.$refs['RechargeRef'].validate((valid) => {
        if (!valid) {
          return
        }
        const userId = this.sysUser.userId
        this.RechargeForm
        const data = {
          userId: userId,
          ...this.RechargeForm,
        }
        WalletRecharge(data).then((res) => {
          if (res.data) {
            this.fetchCustomerInfo()
            // 清除数据
            this.handleCancel()

            this.$message({
              type: 'success',
              message: '充值成功',
            })
          } else {
            this.$message({
              type: 'error',
              message: '提交失败',
            })
          }
        })
      })
    },
    //重置密码
    ResetPayPwd(){
      // this.ChangePwd = true
      this.$confirm('此操作将重置该用户的支付密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const userId = this.sysUser.userId
          ResetPayPwd(userId).then((res)=>{
          if(res.data){
          this.$message.success('密码重置成功')
          this.$alert('支付密码已重置,请登录邮箱<strong style="color:red;font-size:large">' + this.customer.email +
                  '</strong>查看！', '重置成功', {
              confirmButtonText: '确定',
              type: 'success',
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              dangerouslyUseHTMLString: true
            })
        }
      })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置密码'
          });
        });
      },

    handleCancel() {
      this.$refs['RechargeRef'].resetFields()
      this.RechargeVisiable = false
    },
    handleRole() {
      this.roleTitle = ['系统角色', '客户角色']
      this.rolePanelVisiable = true
    },
    handleResetRole() {
      this.rolePanelVisiable = false
      this.getUserRoles(this.sysUser.userId)
    },
    handleSaveRole() {
      const sysUserId = this.sysUser.userId
      const roles = this.userRoleList
      saveUserRoles(sysUserId, roles).then((res) => {
        if (res.data) {
          this.handleResetRole()
          this.fetchCustomerInfo()
          this.$message('保存成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    async getGroups() {
      await getAllUserGroups().then((res) => {
        this.groupList = res.data
      })
    },
    getUserGroups(sysUserId) {
      getUserGroups(sysUserId).then((res) => {
        this.userGroupList = res.data.map((val, idx, arr) => {
          return val.userGroupId
        })

        const userGroups = this.groupList
          .filter((item, index, arr) => {
            return this.userGroupList.indexOf(item.id) !== -1
          })
          .map((val, index, arr) => {
            return val.groupName
          })
        this.userGroups = userGroups.join('\n')
      })
    },
    handleGroup() {
      this.groupTitle = ['系统用户组', '客户用户组']
      this.groupPanelVisiable = true
    },
    handleResetGroup() {
      this.groupPanelVisiable = false
      this.getUserGroups(this.sysUser.userId)
    },
    addOperationLog(opt, param) {
      AddOperationLog(opt, param)
    },
    handleSaveGroup() {
      const sysUserId = this.sysUser.userId
      const groups = this.userGroupList
      saveUserGroups(sysUserId, groups).then((res) => {
        if (res.data) {
          this.handleResetGroup()
          this.fetchCustomerInfo()

          this.$message('保存成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    error(err) {
      let message = '查询失败'
      if (err && err.message) {
        message = err.message
      }

      this.$alert('请返回重试', message, {
        confirmButtonText: '返回',
        type: 'error',
        callback: (action) => {
          this.$router.push({ path: '/customer/list' })
        },
      })
    },
  },
}
</script>

<style scoped>
.el-link.el-link--default:hover {
  color: #606266;
}

.content {
  margin: 10px;
}

.info .el-row {
  line-height: 35px;
}

.opt {
  margin-top: 30px;
}

.el-col {
  /* border: 1px solid red; */
}
.titlestyle {
  /* color:red; */
  /* border:1px solid red; */
  /* line-height: 41px; */
  float: right;
}
::v-deep  .is-success .el-input-number__increase{
  right: 0!important;
}
</style>
