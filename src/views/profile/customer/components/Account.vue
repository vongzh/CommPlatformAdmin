<template>
  <div style="position:relative;height:440px">
    <!-- <el-card style="margin-top:20px">
      <div slot="header">
        <span>客户信息</span>
      </div> -->
    <div slot="header" style="margin-bottom:2rem">
      <span style="font-size:20px;font-weight:600">客户信息</span>
    </div>
    <el-col class="details" :span="3" :offset="4">
      <!-- <svg-icon icon-class="xiangqing" style="font-size:6rem;" />
      <p class="titlecss">详情信息查看</p> -->
      <el-link :underline="false" @click="userdetail()">
        <svg-icon icon-class="xiangqing" style="font-size:6rem;color:#006699" />
        <p class="titlecss" @click="userinfo = true">查看详细信息</p>
      </el-link>
    </el-col>

        <!-- <el-col :span="3" :offset="4" class="usertype">
          <el-link :underline="false" @click="changeuserinfo()">
            <svg-icon icon-class="yonghu" style="font-size:6rem" />
            <p class="iconcolor" style="color:#006699">信息修改</p>
          </el-link>
        </el-col> -->
    <div>
      <div class="info" :span="6">
        <el-row>
          <el-col :xl="2" :sm="3" :offset="2">
            <el-link :underline="false" class="titlestyle">客户类型：</el-link>
          </el-col>
          <el-col :xl="6" :sm="8" :offset="2" class="ml10">
            <el-link :underline="false" class="content">{{ customer.customerType===CustomerTypeEnum.COMPANY?'企业用户':'个人用户' }}</el-link>
          </el-col>
        </el-row>

        <el-row v-if="customer.customerType === CustomerTypeEnum.COMPANY">
          <el-col :xl="2" :sm="3" :offset="2">
            <el-link :underline="false" class="titlestyle">公司名称：</el-link>
          </el-col>
          <el-col :xl="6" :sm="8" :offset="2" class="ml10">
            <el-link :underline="false" class="content">{{ customer.companyName }}</el-link>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :offset="4" :span="5">
            <el-link :underline="false">面积</el-link>
          </el-col>
          <el-col :span="6">
            <el-link :underline="false">{{ roomInfo.areaRange }}</el-link>
          </el-col>
        </el-row> -->

        <!-- <el-col v-if="customer.customerType === CustomerTypeEnum.COMPANY" >
            <el-link :underline="false">{{ customer.companyName }}</el-link>
          </el-col> -->

        <!-- <el-col :span="2">
            <el-link :underline="false">客户编号：</el-link>
          </el-col>
          <el-col :span="3">
            <el-link :underline="false">{{ customer.customerNo }}</el-link>
          </el-col> -->

        <el-row v-if="customer.customerType === CustomerTypeEnum.COMPANY">
          <el-col :xl="2" :sm="3" :offset="2">
            <el-link :underline="false" class="titlestyle">所属行业：</el-link>
          </el-col>
          <el-col :xl="6" :sm="8" class="ml10" :offset="2">
            <el-link :underline="false" class="content">旅游业</el-link>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xl="2" :sm="3" :offset="2">
            <el-link :underline="false" class="titlestyle">联系人：</el-link>
          </el-col>
          <el-col :xl="6" :sm="8" :offset="2" class="ml10">
            <el-link :underline="false" class="content">{{ customer.contactName }}</el-link>
          <!-- <el-input v-model="customer.contactName" placeholder="请输入联系人" :maxlength="20" show-word-limit size="small" /> -->
          </el-col>
        </el-row>

        <el-row>
          <el-col :xl="2" :sm="3" :offset="2">
            <el-link :underline="false" class="titlestyle">联系方式：</el-link>
          </el-col>
          <el-col :xl="6" :sm="8"  :offset="2" class="ml10">
            <el-link :underline="false" class="content">{{ customer.contactPhone }}</el-link>
          <!-- <el-input v-model="customer.contactName" placeholder="请输入联系人" :maxlength="20" show-word-limit size="small" /> -->
          </el-col>
        </el-row>

        <el-row>
          <el-col :xl="2" :sm="3" :offset="2">
            <el-link :underline="false" style="text-align: right" class="titlestyle">电子邮箱：</el-link>
          </el-col>
          <el-col :xl="6" :sm="8" :offset="2" class="ml10">
            <el-link :underline="false" class="content">{{ customer.email }}</el-link>
          </el-col>
        </el-row>

        <el-row v-if="customer.customerType === CustomerTypeEnum.COMPANY">
          <el-col :xl="2" :sm="3" :offset="2">
            <el-link :underline="false" style="text-align: right;" class="titlestyle">是否法人：</el-link>
          </el-col>
          <el-col :xl="6" :sm="8" :offset="2" class="ml10">
            <el-link :underline="false" class="content">{{ customer.isLegalPerson === YNEnum.Y?'是':'否' }}</el-link>
          </el-col>
        </el-row>

      </div>
    </div>

    <el-dialog
      :visible.sync="userinfo"
      :close-on-click-modal="false"
      label-position="right"
      :inline="true"
    >
      <div slot="title">
        <span>用户详细信息</span>
      </div>
      <div class="purchase-order-info">
        <el-row>
          <el-col :span="3">
            <el-link :underline="false" class="titlestyle">身份证姓名：</el-link>
          </el-col>
          <el-col :span="5" class="ml10">
            <el-link :underline="false" class="content">{{ customer.realName }}</el-link>
          </el-col>
        </el-row>

        <el-row>

          <el-col :span="3">
            <el-link :underline="false" class="titlestyle">身份证号：</el-link>
          </el-col>
          <el-col :span="5" class="ml10">
            <el-link :underline="false" class="content">{{ customer.idCardNo }}</el-link>
          </el-col>
          <el-col v-if="customer.customerType === CustomerTypeEnum.COMPANY" :span="1">
            <el-popover
              placement="top"
              trigger="click"
              width="500"
            >
              <el-image
                v-if="customer.idCardDisplayImgs && customer.idCardDisplayImgs.length>0"
                :src="customer.idCardDisplayImgs[0].item2"
                :preview-src-list="customer.idCardDisplayImgs.map(x=> {return x.item2 })"
              />
              <el-link v-else>暂无图片</el-link>
              <el-link slot="reference" type="primary">正面</el-link>
            </el-popover>
          </el-col>

          <el-col v-if="customer.customerType === CustomerTypeEnum.COMPANY" :span="1">
            <el-popover
              v-if="customer.idCardDisplayImgs[1] && customer.idCardDisplayImgs.length>0"
              placement="top"
              trigger="click"
              width="500"
            >
              <el-image
                v-if="customer.idCardDisplayImgs[1] && customer.idCardDisplayImgs.length>0"
                :src="customer.idCardDisplayImgs[1].item2"
                :preview-src-list="customer.idCardDisplayImgs.map(x=> {return x.item2 })"
              />
              <el-link v-else>暂无图片</el-link>
              <el-link slot="reference" type="primary">反面</el-link>
            </el-popover>
          </el-col>
        </el-row>

        <!-- <el-col :span="3">
            <el-link :underline="false" class="titlestyle">身份证号：</el-link>
          </el-col>
          <el-col :span="6" class="ml10">
            <el-link :underline="false" class="content">{{ customer.idCardNo }}</el-link>
          </el-col>
        </el-row> -->

        <el-row v-if="customer.customerType === CustomerTypeEnum.COMPANY">
          <el-col :span="3">
            <el-link :underline="false" class="titlestyle">营业执照编号：</el-link>
          </el-col>
          <el-col :span="5" class="ml10">
            <el-link :underline="false" class="content">{{ customer.businessLicenseNo }}</el-link>
          </el-col>

          <el-col :span="1">
            <el-popover
              placement="top"
              trigger="click"
              width="500"
            >
              <el-image
                v-if="customer.businessLicenseDisplayImgs && customer.businessLicenseDisplayImgs.length>0"
                :src="customer.businessLicenseDisplayImgs[0].item2"
                :preview-src-list="customer.businessLicenseDisplayImgs.map(x=> {return x.item2 })"
              />
              <el-link v-else>暂无图片</el-link>
              <el-link slot="reference" type="primary">正面</el-link>
            </el-popover>
          </el-col>

          <el-col v-if="customer.businessLicenseDisplayImgs[1] && customer.businessLicenseDisplayImgs.length>0" :span="1">
            <el-popover
              placement="top"
              trigger="click"
              width="500"
            >
              <el-image
                v-if="customer.businessLicenseDisplayImgs[1] && customer.businessLicenseDisplayImgs.length>0"
                :src="customer.businessLicenseDisplayImgs[1].item2"
                :preview-src-list="customer.businessLicenseDisplayImgs.map(x=> {return x.item2 })"
              />
              <el-link v-else>暂无图片</el-link>
              <el-link slot="reference" type="primary">反面</el-link>
            </el-popover>
          </el-col>

        </el-row>

        <el-row v-if="customer.customerType === CustomerTypeEnum.COMPANY && customer.isLegalPerson === YNEnum.N">
       <el-col v-if="customer.customerType === CustomerTypeEnum.COMPANY && customer.isLegalPerson === YNEnum.N" :span="3">
            <el-link :underline="false" class="titlestyle">授权人：</el-link>
          </el-col>
          <el-col v-if="customer.customerType === CustomerTypeEnum.COMPANY && customer.isLegalPerson === YNEnum.N" class="ml10" :span="5">
            <el-link :underline="false" class="content">{{ customer.certigier }}</el-link>
          </el-col>
          <el-col v-if="customer.customerType === CustomerTypeEnum.COMPANY && customer.isLegalPerson === YNEnum.N" :span="1">
            <el-popover
              placement="top"
              trigger="click"
              width="500"
            >
              <el-image
                v-if="customer.authorizationDisplayImgs && customer.authorizationDisplayImgs.length>0"
                :src="customer.authorizationDisplayImgs[0].item2"
                :preview-src-list="customer.authorizationDisplayImgs.map(x=> {return x.item2 })"
              />
              <el-link v-else>暂无图片</el-link>
              <el-link slot="reference" type="primary">正面</el-link>
            </el-popover>
          </el-col>

          <el-col v-if="customer.customerType === CustomerTypeEnum.COMPANY && customer.isLegalPerson === YNEnum.N && (customer.authorizationDisplayImgs[1] && customer.authorizationDisplayImgs.length>0)" :span="1">
            <el-popover
              placement="top"
              trigger="click"
              width="500"
            >
              <el-image
                v-if="customer.authorizationDisplayImgs && customer.authorizationDisplayImgs.length>0"
                :src="customer.authorizationDisplayImgs[1].item2"
                :preview-src-list="customer.authorizationDisplayImgs.map(x=> {return x.item2 })"
              />
              <el-link v-else>暂无图片</el-link>
              <el-link slot="reference" type="primary">反面</el-link>
            </el-popover>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- <el-form-item label="联系人">
        <el-input v-model="customer.contactName" placeholder="请输入内容" ></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model.trim="customer.contactPhone"/>
      </el-form-item> -->

    <!-- <el-col :span="2">
          <el-link :underline="false" class="titlestyle">联系方式：</el-link>
        </el-col>
        <el-col :span="3" class="ml10">
          <el-input v-model="customer.contactPhone" placeholder="请输入联系方式" :maxlength="11" show-word-limit size="small"/>
        </el-col>
      </el-row> -->
    <!-- <el-row>
          <el-col :span="2">
            <el-link :underline="false">联系人：</el-link>
          </el-col>
          <el-col :span="3">
            <el-link :underline="false">{{ customer.contactName }}</el-link>
          </el-col>
          <el-col :span="2">
            <el-link :underline="false">联系方式：</el-link>
          </el-col>
          <el-col :span="3">
            <el-link :underline="false">{{ customer.contactPhone }}</el-link>
          </el-col> -->

    <!-- <el-row>
          <el-col :span="2">
            <el-link :underline="false">用户编号：</el-link>
          </el-col>
          <el-col :offset="1" :span="2">
            <el-link :underline="false">{{ customer.sysUserId }}</el-link>
          </el-col>
        </el-row> -->

    <!--

 -->

    <!-- <el-form>
        <el-form-item label="联系人" style="padding-left:10px">
          <el-col :span="4">
            <el-input v-model="customer.contactName" placeholder="请输入联系人" :maxlength="20" show-word-limit size="small" style="width:185px" />
          </el-col>
        </el-form-item>

        <el-form-item label="联系方式" style="padding-left:10px">
          <el-col :span="4">
            <el-input v-model="customer.contactPhone" placeholder="请输入联系方式" :maxlength="11" show-word-limit size="small" style="width:175px" />
          </el-col>
        </el-form-item>
      </el-form>
    <el-row>
        <el-col :offset="2">
          <el-button type="primary" size="small" @click="changeContactInfo()">保存</el-button>
        </el-col>
      </el-row> -->

    <!--  </el-card>
     <el-card>
      <el-row>
        <el-col :span="2">
          <el-link :underline="false">公司名称：</el-link>
        </el-col>
        <el-col :span="6">
          <el-link :underline="false">测试</el-link>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">
          <el-link :underline="false">所属行业：</el-link>
        </el-col>
        <el-col :span="6">
          <el-link :underline="false">旅行社</el-link>
        </el-col>
      </el-row>
    </el-card>
 -->

  </div>
</template>

<script>
import { GetCustomer, ChangeContactInfo } from '@/api/customer/customer'
export default {
  data() {
    return {
      userinfo: false,
      CustomerTypeEnum: {
        COMPANY: 1,
        PERSON: 2
      },
      YNEnum: {
        Y: 1,
        N: 0
      },
      customer: {}
    }
  },
  created() {
    this.getCustomer()
  },
  methods: {
    getCustomer() {
      GetCustomer().then(res => {
        if (res.data.item1) {
          this.customer = res.data.item2
          const temp = this.customer.idCardNo.substring(6,14)
          this.customer.idCardNo = this.customer.idCardNo.replace(temp, '********')
          const length = this.customer.businessLicenseNo.length
          const temp2 = this.customer.businessLicenseNo.substr(0,length-6)
          this.customer.businessLicenseNo = temp2 + '******'
        }
      })
    },
    userdetail() {
      this.userinfo = true
    },
    changeContactInfo() {
      ChangeContactInfo(this.customer.contactName, this.customer.contactPhone).then(res => {
        if (res.data) {
          this.getCustomer()
          this.$message.warning('保存成功')
        } else {
          this.$message.warning('保存失败')
        }
      })
    }
  }
}
</script>

<style scoped>
.el-link.el-link--default::after {
	border-color: #606266;
}
.el-row{
  padding:10px
}
.titlestyle{
/* color:red; */
/* border:1px solid red; */
color: #333333;
float: right;
text-align: center;
height: 1.5rem;
}
.content{
color: #333333;
  height: 1.5rem;
  margin-right: 1rem;
  float: left;
}
.ml10 {
  margin-left: 10px;
  height: 1.5rem;
   float: left;
}
.details{
    width: 10vw;
  height: 18vh;
float:right;position:absolute;top:50%;margin-top: -100px;right:25%;
    text-align: center;
    padding-top: 0.88rem;
    vertical-align: middle;
    z-index: 9;
}
/* .svg-icon{
  width: 50%;
} */
.details:hover{
  background: #F5F5F5;
  box-shadow: 10px 10px 5px #D3D3D3;
  border-radius: 10px;
}
.titlecss{
  color: #006699;
  font-size: 1vw;
  font-weight: 600;
}
.svg-icon{
  width: 5vw;
  height: 10vh;
}

</style>
