<template>
	<div class="content">
		<el-steps :active="activeSetp" simple>
			<el-step title="创建用户" icon="el-icon-user"></el-step>
			<el-step title="创建客户信息" icon="el-icon-document"></el-step>
			<el-step title="完成" icon="el-icon-s-check"></el-step>
		</el-steps>

		<el-tabs v-model="currentTab" tab-position="top" style="margin-top: -2.6rem;">
			<el-tab-pane name="setp1" :lazy="true" :disabled="true">
				<el-card>
					<div slot="header">
						<span>用户信息</span>
					</div>
					<el-form ref="form" :model="sysUser" label-width="100px" autocomplete="off" :rules="rules">
						<el-row>
							<el-col :span="8" :offset="4">
								<el-form-item label="用户名" prop="userName">
									<el-col :span="12">
										<el-input v-model="sysUser.userName" size="small" placeholder="用户名"
											:disabled="sysUser.id > 0" maxlength="18" show-word-limit />
									</el-col>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="姓名" prop="nickName">
									<el-col :span="12">
										<el-input v-model="sysUser.nickName" size="small" placeholder="昵称" />
									</el-col>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="8" :offset="4">
								<el-form-item label="手机号" prop="mobile">
									<el-col :span="12">
										<el-input v-model="sysUser.mobile" :maxlength="11" size="small"
											placeholder="手机号" show-word-limit />
									</el-col>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="邮箱" prop="mail">
									<el-col :span="12">
										<el-input v-model="sysUser.mail" size="small" type="mail" placeholder="邮箱"
											autocomplete="new-password" />
									</el-col>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="8" :offset="4">
								<el-form-item v-if="!sysUser.id" label="密码" prop="pwd" :rules="[
                      { required: true, message: '请输入密码', trigger: 'blur' },
                      {
                        min: 8,
                        max: 20,
                        message: '密码长度在 8 到 20 个字符',
                        trigger: 'blur',
                      },
                      {
                        pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,20}$/,
                        message:
                          '密码格式不正确，至少包含两种以上字母、数字、符号自由组合，区分大小写',
                        trigger: 'blur',
                      },
                    ]">
									<el-col :span="12">
										<el-input v-model="sysUser.pwd" size="small" placeholder="密码" :type="inputType">
											<i slot="suffix" class="el-icon-view" @click="changeInputType"
												style="cursor: pointer;margin-right: 5px;"
												:style="{color: inputType == 'text' ? '#409EFF' : '#C0C4CC'}"></i>
										</el-input>
									</el-col>
								</el-form-item>
							</el-col>
							<el-col :span="8" >
								<el-form-item label="用户类型">
									<el-select v-model="sysUser.userType">
										<el-option label="用户" value="10" />
										<el-option label="接口用户" value="200" />
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="8" :offset="4">
								<el-form-item label="直连平台" prop="userPlatformId">
									<el-select v-model="sysUser.userPlatformId">
										<el-option v-for="(item,index) in platformDict" :label="item.dictLabel" :value="item.dictValue" />
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-divider />
						<el-row>
							<el-col :offset="10">
								<el-button type="primary" size="small" @click="handleSaveSysUser">创建用户</el-button>
							</el-col>
						</el-row>
					</el-form>
				</el-card>
			</el-tab-pane>
			<el-tab-pane name="setp2" :lazy="true" :disabled="true">
				<el-card style="margin-top: 10px">
					<div slot="header">
						<span>客户信息</span>
					</div>
					<div>
						<el-col :span="14">
							<el-tabs v-model="registerType" tab-position="left" @tab-click="tabsClick">
								<el-tab-pane label="企业用户" name="company" :disabled="companyTabDisabled">
									<el-form ref="companyForm" :model="customer" :rules="rules" class="form"
										label-position="right" label-width="100px">
										<el-form-item label="用户类别" prop="customerType">
											<el-select v-model="customer.customerType" :disabled="true">
												<el-option label="企业" :value="1" />
												<el-option label="个人" :value="2" />
											</el-select>
										</el-form-item>
										<el-form-item label="公司名称" prop="companyName">
											<el-col :span="14">
												<el-input v-model="customer.companyName" placeholder="请输入公司名称"
													:maxlength="50" clearable />
											</el-col>
										</el-form-item>
										<el-form-item label="所属行业" prop="industry">
											<el-select v-model="customer.industry">
												<el-option label="旅行社" :value="1" />
												<el-option label="休闲及餐饮工商业" :value="2" />
												<el-option label="其它" :value="10" />
											</el-select>
										</el-form-item>
										<el-form-item label="联系人" prop="contactName">
											<el-col :span="14">
												<el-input v-model="customer.contactName" placeholder="请输入联系人姓名"
													:maxlength="20" clearable />
											</el-col>
										</el-form-item>
										<el-form-item label="手机号" prop="contactPhone">
											<el-col :span="14">
												<el-input v-model="customer.contactPhone" placeholder="请输入联系手机号"
													:maxlength="11" clearable />
											</el-col>
										</el-form-item>
										<el-form-item label="电子邮箱" prop="email">
											<el-col :span="14">
												<el-input v-model="customer.email" type="mail" placeholder="请输入电子邮箱"
													clearable />
											</el-col>
										</el-form-item>
										<el-form-item label="营业执照号" prop="businessLicenseNo">
											<el-col :span="14">
												<el-input v-model="customer.businessLicenseNo" placeholder="请输入营业执照编号"
													:maxlength="18" clearable />
											</el-col>
											<el-col :offset="2" :span="6">
												<el-upload ref="bimgsUpload" :action="fileApi" list-type="picture"
													:limit="2" :file-list="businessLicenseImgFiles"
													:before-upload="initUpload" :headers="requestHeaders"
													:auto-upload="true" :on-exceed="fileExceed"
													:on-success="fileUploadSuccess1" :on-error="fileUploadError"
													:on-remove="fileUploadRemove1" accept=".png,.jpg,.bmp,.jpeg">
													<el-tooltip content="大小不超过50兆、可上传png、jpg、bmp、jpeg类型的图片"
														placement="right">
														<el-button type="primary" size="mini">上传营业执照图片</el-button>
													</el-tooltip>
												</el-upload>
											</el-col>
										</el-form-item>
										<el-form-item label="身份证姓名" prop="realName">
											<el-col :span="14">
												<el-input v-model="customer.realName" placeholder="请输入身份证姓名" clearable
													:maxlength="20" />
											</el-col>
										</el-form-item>
										<el-form-item label="身份证" prop="idCardNo">
											<el-col :span="14">
												<el-input v-model="customer.idCardNo" placeholder="请输入身份证号" clearable
													:maxlength="18" />
											</el-col>
											<el-col :offset="2" :span="8">
												<el-upload :action="fileApi" list-type="picture" :limit="2"
													:file-list="idCardImgFiles" :before-upload="initUpload"
													:headers="requestHeaders" :auto-upload="true"
													:on-exceed="fileExceed" :on-success="fileUploadSuccess"
													:on-error="fileUploadError" :on-remove="fileUploadRemove"
													accept=".png,.jpg,.bmp,.jpeg">
													<el-tooltip content="大小不超过50兆、可上传png、jpg、bmp、jpeg类型的图片"
														placement="right">
														<el-button type="primary" size="mini">上传身份证图片</el-button>
													</el-tooltip>
												</el-upload>
											</el-col>
										</el-form-item>
										<!-- <el-form-item label="验证码" prop="smsCode">
                      <el-col :span="11">
                        <el-input v-model="customer.smsCode" placeholder="请输入验证码" />
                      </el-col>
                      <el-col :offset="2" :span="11">
                        <el-button type="info" size="mini">发送验证信息</el-button>
                      </el-col>
                    </el-form-item> -->
										<el-form-item label="是否法人" prop="isLegalPerson">
											<el-radio-group v-model="customer.isLegalPerson">
												<el-radio :label="1">是</el-radio>
												<el-radio :label="0">否</el-radio>
											</el-radio-group>
										</el-form-item>
										<el-form-item v-if="customer.isLegalPerson === YN.N" label="授权人"
											prop="certigier">
											<el-col :span="14">
												<el-input v-model="customer.certigier" placeholder="请输入授权人" clearable
													:maxlength="20" />
											</el-col>
											<el-col :offset="2" :span="8">
												<el-upload :action="fileApi" list-type="picture" :limit="2"
													:file-list="authorizationImgFiles" :before-upload="initUpload"
													:headers="requestHeaders" :auto-upload="true"
													:on-exceed="fileExceed" :on-success="fileUploadSuccess2"
													:on-error="fileUploadError" :on-remove="fileUploadRemove2"
													accept=".png,.jpg,.bmp,.jpeg">
													<el-tooltip content="大小不超过50兆、可上传png、jpg、bmp、jpeg类型的图片"
														placement="right">
														<el-button type="primary" size="mini">上传授权书图片</el-button>
													</el-tooltip>
												</el-upload>
											</el-col>
										</el-form-item>
										<el-form-item>
											<el-checkbox v-model="customer.agreeService">我已阅读并同意</el-checkbox>
											<el-link type="primary">《众客分销平台服务隐私协议条款》</el-link>
										</el-form-item>
										<el-form-item>
											<el-button type="primary" @click="submit('companyForm')">提交</el-button>
										</el-form-item>
									</el-form>
								</el-tab-pane>
								<el-tab-pane label="个人用户" name="personage" :disabled="personageTabDisabled">
									<el-form ref="personForm" :rules="rules" :model="customer" class="form"
										label-position="right" label-width="100px">
										<el-form-item label="用户类别" prop="customerType">
											<el-select v-model="customer.customerType" :disabled="true">
												<el-option label="企业" :value="1" />
												<el-option label="个人" :value="2" />
											</el-select>
										</el-form-item>
										<el-form-item label="所属行业" prop="industry">
											<el-select v-model="customer.industry">
												<el-option label="旅行社" value="1" />
												<el-option label="休闲及餐饮工商业" value="2" />
												<el-option label="其它" value="10" />
											</el-select>
										</el-form-item>
										<el-form-item label="联系人" prop="contactName">
											<el-col :span="14">
												<el-input v-model="customer.contactName" placeholder="请输入联系人姓名"
													maxlength="20" />
											</el-col>
										</el-form-item>
										<el-form-item label="手机号" prop="contactPhone">
											<el-col :span="14">
												<el-input v-model="customer.contactPhone" placeholder="请输入联系手机号"
													maxlength="11" />
											</el-col>
										</el-form-item>
										<el-form-item label="电子邮箱" prop="email">
											<el-col :span="14">
												<el-input v-model="customer.email" placeholder="请输入电子邮箱" />
											</el-col>
										</el-form-item>
										<el-form-item label="身份证姓名" prop="realName">
											<el-col :span="14">
												<el-input v-model="customer.realName" placeholder="请输入身份证姓名"
													maxlength="20" />
											</el-col>
										</el-form-item>
										<el-form-item label="身份证号" prop="idCardNo">
											<el-col :span="14">
												<el-input v-model="customer.idCardNo" placeholder="请输入身份证号"
													maxlength="18" />
											</el-col>
											<el-col :offset="2" :span="11">
												<el-upload :action="fileApi" list-type="picture" :limit="2"
													:file-list="idCardImgFiles" :before-upload="initUpload"
													:headers="requestHeaders" :auto-upload="true"
													:on-exceed="fileExceed" :on-success="fileUploadSuccess"
													:on-error="fileUploadError" :on-remove="fileUploadRemove">
													<el-button type="primary" size="mini">上传身份证图片</el-button>
												</el-upload>
											</el-col>
										</el-form-item>
										<!-- <el-form-item label="验证码" prop="smsCode">
                      <el-col :span="11">
                        <el-input v-model="customer.smsCode" placeholder="请输入验证码" />
                      </el-col>
                      <el-col :offset="2" :span="11">
                        <el-button type="info" size="mini" @click="">发送验证信息</el-button>
                      </el-col>
                    </el-form-item> -->
										<el-form-item prop="agreeService">
											<el-checkbox v-model="customer.agreeService">我已阅读并同意</el-checkbox>
											<el-link type="primary">《众客分销平台服务隐私协议条款》</el-link>
										</el-form-item>
										<el-form-item>
											<el-button type="primary" @click="submit('personForm')">提交</el-button>
										</el-form-item>
									</el-form>
								</el-tab-pane>
							</el-tabs>
						</el-col>
					</div>
				</el-card>
			</el-tab-pane>
			<el-tab-pane name="setp3" :lazy="true" :disabled="true">
				<div style="width: 50%;margin-left: 30%;margin-top: 3rem;">
					<el-row>
						<i class="el-icon-circle-check" style="color: #13CE66;font-size: 5rem;margin-left:30%" />
					</el-row>
					<el-row style="margin-top: 2rem;">
						<el-link :underline="false" style="font-size: x-large;">恭喜您！已成功注册51住酒店预订平台，请使用已注册的用户名或手机号进行
						</el-link>
						<el-link style="font-size: x-large;color: #1890FF;" @click="goBack()">登录</el-link>
						<el-link :underline="false" style="font-size: x-large;">。</el-link>
					</el-row>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import {
		addUser,
		getUserInfo,
		CheckSysUserMobileIsExist,
	} from '@/api/sys/user'
	import auth from '@/control/auth'
	import {
		deepClone
	} from '@/utils/index'
	import md5 from 'js-md5'
	import {
		AddCustomerInfo,
		GetCustomer,
		CheckIdCardNoIsExist,
		CheckLicenseNoIsExist
	} from '@/api/customer/customer'
	import {
		GetPlatformDict,
	} from '@/api/dict/dict'
	export default {
		data() {
			var checkMobileIsExist = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入手机号'))
					return
				}
				CheckSysUserMobileIsExist(this.sysUser.userId, '' + value)
					.then((res) => {
						if (!res.data) {
							callback()
						} else {
							callback(new Error('该手机号码已被注册'))
						}
					})
					.catch((err) => {})
			}
			var checkIdCardNoIsExist = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入身份证号'))
					return
				}
				CheckIdCardNoIsExist(value).then(res => {
					if (!res.data) {
						callback()
					} else {
						callback(new Error('身份证号已被使用'))
					}
				})
			}

			var checkLicenseNoIsExist = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入营业执照编号'))
					return
				}
				CheckLicenseNoIsExist(value).then(res => {
					if (!res.data) {
						callback()
					} else {
						callback(new Error('营业执照编号已被使用'))
					}
				})
			}

			return {
				sysUser: {
					id: 0,
					userId: 0,
					avatar: '',
					status: 0,
					modules: [],
					roleMenus: [],
					userRoles: [],
					statusDesc: '正常',
					userPlatformId: null
				},
				// UserTypeEnum: {
				//   USER: 10,
				//   CUSTOMER: 50,
				//   BACKSTAGE: 100
				// },
				userStatusEnum: {
					lock: -5,
					normal: 0,
				},
				YNEnum: {
					Y: 1,
					N: 0,
				},
				currentTab: 'setp1',
				fileApi: process.env.VUE_APP_BASE_API + '/File/Upload?type=customer',
				rightCustomer: false,
				registerType: 'company',
				customer: {
					//用户类别
					customerType: 1,
					//所属行业
					industry: '',
					//联系人
					contactName: '',
					//手机号
					contactPhone: '',
					//电子邮箱:
					email: '',
					//邮箱验证码
					mailCode: '',
					//身份证姓名
					realName: '',
					//身份证号
					idCardNo: '',
					//是否同意
					agreeService: '',
					//营业执照
					businessLicenseImgs: [],
					//身份证照片
					idCardImgs: [],
					//授权书图片
					authorizationImgs: [],
					//用户ID
					userId: 0,
				},
				businessLicenseImgFiles: [],
				idCardImgFiles: [],
				authorizationImgFiles: [],
				requestHeaders: {},
				rules: {
					userName: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur',
						},
						{
							min: 6,
							max: 18,
							message: '用户名长度应为6~18个字符',
							trigger: 'blur',
						},
						{
							pattern: /^[A-Za-z][A-Za-z0-9]{5,18}$/,
							message: '用户名只能输入字母、数字，需要以字母开头',
							trigger: 'blur',
						},
					],
					nickName: [{
							required: true,
							message: '请输入姓名',
							trigger: 'blur',
						},
						{
							min: 2,
							max: 20,
							message: '姓名长度应为2到20位',
							trigger: 'blur',
						},
						{
							pattern: /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/,
							message: '姓名校验不合法,应由中文开头，其中可含(·)组成',
							trigger: 'blur',
						},
					],
					mobile: [{
							required: true,
							message: '请输入手机号',
							trigger: 'blur',
						},
						{
							pattern: /[^\u4e00-\u9fa5_a-zA-Z]+$/,
							message: '格式不正确，请输入手机号',
							trigger: 'blur',
						},
						{
							min: 11,
							max: 11,
							message: '手机号长度应为11位数字',
							trigger: 'blur',
						},
						{
							pattern: /^[1](([3][0-9])|([4][1-9])|([5][0-3,4-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0,1,2,3,5,6,7,8,9]))[0-9]{8}$/,
							message: '手机号码无效',
							trigger: 'blur',
						},
						{
							validator: checkMobileIsExist,
							trigger: 'blur',
						},
					],
					mail: [{
							required: true,
							message: '请输入邮箱地址',
							trigger: 'blur',
						},
						{
							pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
							message: '邮箱格式错误',
							trigger: 'blur',
						},
					],
					companyName: [{
							required: true,
							message: '请输入公司名称',
							trigger: 'blur'
						},
						{
							pattern: /[\u4e00-\u9fa5]$/,
							message: '公司名称请输入中文',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 50,
							message: '公司名称长度应输入3-50个字符中文',
							trigger: 'blur'
						}
					],
					userPlatformId: [{
						required: true,
						message: '请选择直连平台',
						trigger: 'change'
					}],
					isLegalPerson: [{
						required: true,
						message: '请选择是否是法人',
						trigger: 'blur'
					}],
					industry: [{
						required: true,
						message: '请选择行业',
						trigger: 'blur'
					}],
					contactName: [{
							required: true,
							message: '请输入联系人',
							trigger: 'blur'
						},
						{
							pattern: /^[\u4E00-\u9FA5]+[·]{0,1}[\u4E00-\u9FA5]+$/,
							message: '联系人只能包含中文和点（·），需要以中文开头',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 20,
							message: '联系人长度应为2-20个字符',
							trigger: 'blur'
						}
					],
					contactPhone: [{
							required: true,
							message: '请输入手机号',
							trigger: 'blur'
						},
						{
							pattern: /[^\u4e00-\u9fa5_a-zA-Z]+$/,
							message: '格式不正确，请输入手机号',
							trigger: 'blur'
						},
						{
							min: 11,
							max: 11,
							message: '手机号长度应为11位数字',
							trigger: 'blur'
						},
						{
							pattern: /^[1](([3][0-9])|([4][1-9])|([5][0-3,4-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0,1,2,3,5,6,7,8,9]))[0-9]{8}$/,
							message: '手机号码无效',
							trigger: 'blur'
						}
					],
					businessLicenseNo: [{
							required: true,
							message: '请输入营业执照编号',
							trigger: 'blur'
						},
						{
							min: 18,
							max: 18,
							message: '请输入18位的营业执照编号',
							trigger: 'blur'
						},
						{
							pattern: /^(?![a-zA-Z]+$)[A-Za-z0-9]{18,18}$/,
							message: '营业执照编号应为18位的字母以及数字组合',
							trigger: 'blur'
						},
						{
							validator: checkLicenseNoIsExist,
							trigger: 'blur'
						}
					],
					email: [{
							required: true,
							message: '请输入邮箱地址',
							trigger: 'blur'
						},
						{
							pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
							message: '邮箱格式错误',
							trigger: 'blur'
						}
					],
					mailCode: [{
							required: true,
							message: '请输入邮箱验证码',
							trigger: 'blur'
						},
						{
							pattern: /[0-9]$/,
							message: '验证码请输入数字！',
							trigger: 'blur'
						},
						{
							min: 4,
							max: 4,
							message: '验证码长度应为4位',
							trigger: 'blur'
						}
					],
					realName: [{
							required: true,
							message: '请输入身份证姓名',
							trigger: 'blur'
						},
						{
							pattern: /^(?!·)[\u4e00-\u9fa5·]+$/,
							message: '身份证姓名只能包含中文和点（·），需要以中文开头',
							trigger: 'blur'
						},
						{
							pattern: /[\u4e00-\u9fa5·]+$/,
							message: '身份证姓名只能包含中文和点（·），需要以中文开头',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 20,
							message: '身份证姓名长度应为2-20个字符',
							trigger: 'blur'
						}
					],
					idCardNo: [{
							required: true,
							message: '请输入身份证号码',
							trigger: 'blur'
						},
						{
							min: 18,
							max: 18,
							message: '身份证号长度应为18个字符',
							trigger: 'blur'
						},
						{
							pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
							message: '身份证号应为18位只能包含数字以及X',
							trigger: 'blur'
						},
						{
							validator: checkIdCardNoIsExist,
							trigger: 'blur'
						}
					],
					certigier: [{
							required: true,
							message: '请输入授权人姓名',
							trigger: 'blur'
						},
						{
							pattern: /^(?!·)[\u4e00-\u9fa5·]+$/,
							message: '授权人姓名只能包含中文和点（·），需要以中文开头',
							trigger: 'blur'
						},
						{
							pattern: /[\u4e00-\u9fa5·]+$/,
							message: '授权人姓名只能包含中文和点（·），需要以中文开头',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 20,
							message: '授权人姓名长度应为2-20个字符',
							trigger: 'blur'
						}
					]
				},
				CustomerAuditStatus: {
					REJECT: -5,
					WAITAUDIT: 0,
					PASS: 10
				},
				CustomerType: {
					COMPANY: 1,
					PERSON: 2
				},
				YN: {
					Y: 1,
					N: 0
				},
				companyTabDisabled: false,
				personageTabDisabled: false,
				loading: true,
				countDown: 0,
				timer: null,
				canSendCaptcha: true,
				captchaText: '发送验证码',
				countDown1: 0,
				timer1: null,
				canSendCaptcha1: true,
				captchaText1: '发送验证码',
				inputType: 'password',
				platformDict: []
			}
		},
		mounted() {
			this.timer = setInterval(this.initToken, 3000)
		},
		computed: {
			activeSetp() {
				let setp = 0
				switch (this.currentTab) {
					case 'setp1':
						setp = 1
						break
					case 'setp2':
						setp = 2
						break
					case 'setp3':
						setp = 3
						break
					default:
						break
				}
				return setp
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				this.addScript('https://ssl.captcha.qq.com/TCaptcha.js')
				this.getDict()
			},
			getDict(){
				GetPlatformDict().then(res => {
					this.platformDict = res.data.map(item => {
						return {
							dictLabel: item.platformName,
							dictValue: item.platformId
						}
					})
				})
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
			//步骤1创建用户
			handleSaveSysUser() {
				this.$refs.form.validate(valid => {
					if (!valid) {
						return
					}

					try {
						const user = deepClone(this.sysUser)
						if (this.sysUser.pwd) {
							user.pwd = md5(this.sysUser.pwd)
						}
						addUser(user).then(res => {
							if (res.data) {
								this.customer.userId = res.data
								console.log(this.customer, res.data);
								this.formVisiable = false
								this.$message('保存成功')
								this.currentTab = 'setp2'
								this.sysUser = {
									id: 0,
									userId: 0,
									status: 0,
									avatar: '',
									modules: [],
									roleMenus: [],
									userRoles: [],
									statusDesc: '正常'
								}
							} else {
								this.$message.error('保存失败')
							}
						})
					} catch (error) {
						console.log(error)
					}
				})
			},
			//步骤2完善用户信息
			submit(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (!this.customer.agreeService) {
							this.$message({
								type: 'info',
								message: '请先阅读并同意协议'
							})
							return
						}

						if (this.registerType === 'company') {
							if (!this.customer.businessLicenseImgs || this.customer.businessLicenseImgs.length <
								0) {
								this.$message({
									type: 'info',
									message: '请先上传营业执照副本'
								})
								return
							}
						}
						// if (this.registerType === 'personage') {
						//   if (!this.customer.idCardImgs || this.customer.idCardImgs.length < 2) {
						//     this.$message({
						//       type: 'info',
						//       message: '请先上传身份证正反面副本'
						//     })
						//     return
						//   }
						// }
						AddCustomerInfo(this.customer).then(res => {
							if (res.data) {
								this.$alert('提交成功，请耐心等待平台审核', '提示', {
									type: 'success',
									confirmButtonText: '确定',
									callback: () => {
										this.currentTab = 'setp3'
									}
								})
							} else {
								this.$error('提交失败，请稍后再试')
							}
						})
					}
				})
			},
			goBack() {
				this.$router.push({
					path: '/login'
				})
			},
			initUpload(file) {
				if (file.size / 1024 / 1024 > 50) {
					this.$message.error('上传图片大小不能超过 50MB!')
					return false
				}
			},

			tabsClick(selected) {
				const tab = selected.name
				switch (tab) {
					case 'company':
						// this.customer={}
						this.customer.customerType = this.CustomerType.COMPANY
						break
					case 'personage':
						// this.customer={}
						this.customer.customerType = this.CustomerType.PERSON
						break
				}
			},
			fileExceed(files, fileList) {
				this.$message('最多上传两张图片')
			},
			fileUploadRemove(file, fileList) {
				const that = this
				that.customer.idCardImgs = []
				fileList.forEach((value, index, array) => {
					that.customer.idCardImgs.push(value.response)
				})
			},
			fileUploadRemove1(file, fileList) {
				const that = this
				that.customer.businessLicenseImgs = []
				fileList.forEach((value, index, array) => {
					that.customer.businessLicenseImgs.push(value.response)
				})
			},
			fileUploadRemove2(file, fileList) {
				const that = this
				that.customer.authorizationImgs = []
				fileList.forEach((value, index, array) => {
					that.customer.authorizationImgs.push(value.response)
				})
			},
			fileUploadSuccess(response, file, fileList) {
				const that = this
				that.customer.idCardImgs = []
				fileList.forEach((value, index, array) => {
					that.customer.idCardImgs.push(value.response)
				})
				this.$message({
					type: 'success',
					message: '已成功上传' + fileList.length + '张图片'
				})
			},
			fileUploadSuccess1(response, file, fileList) {
				const that = this
				that.customer.businessLicenseImgs = []
				fileList.forEach((value, index, array) => {
					that.customer.businessLicenseImgs.push(value.response)
				})
				this.$message({
					type: 'success',
					message: '已成功上传' + fileList.length + '张图片'
				})
			},
			fileUploadSuccess2(response, file, fileList) {
				const that = this
				that.customer.authorizationImgs = []
				fileList.forEach((value, index, array) => {
					that.customer.authorizationImgs.push(value.response)
				})
				this.$message({
					type: 'success',
					message: '已成功上传' + fileList.length + '张图片'
				})
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
			addScript(url) {
				const script = document.createElement('script')
				script.type = 'application/javascript'
				script.src = url
				document.head.appendChild(script)
			},
			goBack() {
				this.$router.go(-1)
			},
			changeInputType() {
				if (this.inputType == 'text') {
					this.inputType = 'password'
				} else {
					this.inputType = 'text'
				}
			}
		}
	}
</script>

<style scoped>
	.content {
		width: 85%;
		margin: 10px 7%;
	}
	.form {
		width: 60%;
		margin-left: 10%;
		margin-top: 15px;
	}
	
	.content>>>.el-form-item{
		margin-bottom: 15px;
	}
</style>
