<template>
	<div class="content">
		<div class="filter-container">
			<el-card>
				<el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top"
					class="searchForm">
					<el-form-item label="用户名" prop="userName">
						<el-input v-model="searchCondition.userName" clearable placeholder="订单号"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="姓名" prop="nickName">
						<el-input v-model="searchCondition.nickName" clearable placeholder="订单号"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="电话" prop="mobile">
						<el-input v-model="searchCondition.mobile" clearable placeholder="订单号"
							class="filter-item input-search" />
					</el-form-item>
					<el-form-item label="状态" prop="disabled">
						<el-select v-model="searchCondition.disabled" clearable placeholder="申请状态"
							class="filter-item input-search">
							<el-option label="启用" value="0"></el-option>
							<el-option label="禁用" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="　" style="user-select: none;width: 200px;">
						<el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search"
							@click="handleSearch()">搜索</el-button>
						<el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close"
							@click="handleReset('searchForm')">重置</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
		<el-card>
			<div class="tools">
				<el-button v-waves size="medium" @click="add()" type="primary">新增
				</el-button>
			</div>
			<div class="content">
				<div class="table">
					<el-table v-loading="tableLoading" :data="userList" :fit="true" border highlight-current-row
						:cell-style="{textAlign: 'center'}" :header-cell-style="{textAlign: 'center'}">
						<el-table-column prop="userName" label="用户名" min-width="160">
							<template slot-scope="scope">
								<span size="mini" type="info" @click="edit(scope.row)"
									style="color: #006699;text-decoration: underline;cursor: pointer;">
									{{scope.row.userName}}
								</span>
							</template>
						</el-table-column>
						<el-table-column prop="nickName" label="姓名" />
						<el-table-column prop="mobile" label="电话" min-width="110" />
						<el-table-column prop="mail" label="邮箱" min-width="160" />
						<el-table-column prop="disabled" label="状态" min-width="80">
							<template slot-scope="scope">
								<b type="primary" :type="scope.row.disabled === YNEnum.N ? 'success' : 'danger'">
									{{ scope.row.disabled === YNEnum.N ? '启用':'禁用' }}
								</b>
							</template>
						</el-table-column>
						<el-table-column prop="lastLoginTime" label="最后登录" min-width="150">
							<template slot-scope="scope">
								{{ scope.row.lastLoginTime?scope.row.lastLoginTime.replace('T',''):'' }}
							</template>
						</el-table-column>
						<el-table-column label="操作" min-width="100">
							<template slot-scope="scope">
								<el-button size="medium" :type="scope.row.disabled === YNEnum.N ? 'danger' : 'primary'"
									@click="changeStatu(scope.row)">{{ scope.row.disabled === YNEnum.N ? '禁用':'启用' }}
								</el-button>
								<el-button size="medium" @click="del(scope.row.id)">删除 </el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination-container">
						<el-pagination background layout="sizes,total, prev, pager, next, jumper"
							:hide-on-single-page="true" :total="totalCount" :page-size="pageSize"
							:current-page="pageIndex" :page-sizes="[10,20, 50, 100]" @current-change="handlePageChange"
							@size-change="handleSizeChange" />
					</div>
				</div>
			</div>
		</el-card>
		<el-dialog :visible="visible" class="dialogs" :title="title" center @close="close" width="700px">
			<el-form label-width="100px" :model="form" autocomplete="off" style="padding:0 60px 0 100px;margin: 0 auto;"
				:rules="rules" ref="form">
				<!-- 				<el-form-item prop="id" label="用户编号" v-if="type == 'edit'">
					<el-input v-model="form.id" disabled></el-input>
				</el-form-item> -->
				<el-form-item prop="userName" label="用户名">
					<el-input v-model="form.userName" :disabled="type == 'edit'"></el-input>
				</el-form-item>
				<el-form-item prop="mobile" label="电话">
					<el-input v-model="form.mobile"></el-input>
				</el-form-item>
				<el-form-item prop="nickName" label="姓名">
					<el-input v-model="form.nickName"></el-input>
				</el-form-item>
				<!-- 				<el-form-item prop="cc" label="公司名称">
					<el-input v-model="form.cc"></el-input>
				</el-form-item> -->
				<el-form-item prop="mail" label="联系邮箱">
					<el-input v-model="form.mail"></el-input>
				</el-form-item>
				<el-form-item prop="pwd" label="密码">
					<el-input v-model="form.pwd" type="password" :type="showPwd ? 'text' : 'password'">
						<svg-icon class="icon" icon-class="Invisible" slot="suffix" v-show="showPwd"
							@click="showPwd = false" />
						<svg-icon class="icon" icon-class="Visible" slot="suffix" v-show="!showPwd"
							@click="showPwd = true" />
					</el-input>
					<span style="font-size: 12px;color: #666"><span
							style="color: red;font-size: 20px;margin:0 5px">*</span>字母、数字和"_"组成，长度大于6位</span>
				</el-form-item>
				<el-form-item prop="pwds" label="确认密码">
					<el-input v-model="form.pwds" type="password" :type="showPwds ? 'text' : 'password'">
						<svg-icon class="icon" icon-class="Invisible" slot="suffix" v-show="showPwds"
							@click="showPwds = false" />
						<svg-icon class="icon" icon-class="Visible" slot="suffix" v-show="!showPwds"
							@click="showPwds = true" />
					</el-input>
					<span style="font-size: 12px;color: #666"><span
							style="color: red;font-size: 20px;margin:0 5px">*</span>字母、数字和"_"组成，长度大于6位</span>
				</el-form-item>

			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save"><b>{{buttonName}}</b></el-button>
				<el-button type="warning" @click="close"><b>取 消</b></el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		GetSubUserInfos,
		GetUserByUserId,
		deleteSysUser,
		addUser,
		saveUser,
		ResetPwd,
		CheckSysUserMobileIsExist,
		disabledSysUser
	} from '@/api/sys/user'
	import {
		CheckUserNameIsExist,
	} from '@/api/customer/customer'
	import {
		mapGetters
	} from 'vuex'
	import {
		deepClone
	} from '@/utils/index'
	import waves from '@/directive/waves' // waves directive
	import permission from '@/directive/permission'
	import md5 from 'js-md5'
	export default {
		name: 'User',
		directives: {
			waves,
		},
		computed: {
			...mapGetters([
				'sysUser',
			]),
		},
		data() {
			var checkMobileIsExist = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入手机号'))
					return
				}
				if ((this.type == 'edit' && value != this.mobile) || this.type == 'add') {
					CheckSysUserMobileIsExist(this.sysUser.userId, '' + value).then(res => {
						if (!res.data) {
							callback()
						} else {
							callback(new Error('该手机号码已被注册'))
						}
					}).catch(err => {})
				} else callback()
			}
			var checkPwd = (rule, value, callback) => {
				if (this.form.pwd) {
					console.log(this.form.pwd)
					console.log(md5(this.form.pwd))
					console.log(this.pwd)
					if (md5(this.form.pwd) == this.pwd) {
						callback(new Error('不能与当前使用密码一致!'))
						return
					} else callback()
				} else callback()
			}
			var checkPassword = (rule, value, callback) => {
				if (this.form.pwd) {
					if (this.form.pwd != this.form.pwds) {
						callback(new Error('两次输入的密码不一致!'))
						return
					} else callback()
				} else callback()
			}
			var checkUserNameIsExist = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入用户名'))
					return
				}
				if ((this.type == 'edit' && value != this.userName) || this.type == 'add') {
					CheckUserNameIsExist(value).then(res => {
						if (!res.data) {
							callback()
						} else {
							callback(new Error('该用户名已被注册'))
						}
					})
				} else callback()
			}
			return {
				tableLoading: false,
				mobile: '',
				userName: '',
				pwd: '',
				showPwd: false,
				showPwds: false,
				searchCondition1: {
					userName: '',
					disabled: '',
					nickName: '',
					mobile: '',
				},
				searchCondition: {
					userName: '',
					disabled: '',
					nickName: '',
					mobile: '',
				},
				userList: [],
				totalCount: 0,
				pageSize: 10,
				pageIndex: 1,
				YNEnum: {
					Y: 1,
					N: 0
				},
				visible: false,
				// 角色
				roleList: [],
				groupList: [],
				title: "新增子账号",
				mobileCheck1: {},
				mobileCheck: {},
				form: {
					id: "",
					userName: "",
					mobile: "",
					nickName: "",
					mail: "",
					disabled: "",
					pwd: "",
					pwds: "",
					isSubUser: 1,
					parentUserId: null
				},
				rules: {
					userName: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 18,
							message: '用户名长度应为6~18个字符',
							trigger: 'blur'
						},
						{
							pattern: /^[A-Za-z][A-Za-z0-9]{5,18}$/,
							message: '用户名只能输入字母、数字，需要以字母开头',
							trigger: 'blur'
						},
						{
							validator: checkUserNameIsExist,
							trigger: 'blur'
						}
					],
					mobile: [{
							required: true,
							message: '请输入',
							trigger: 'blur',
						},
						{
							pattern: /^[1](([3][0-9])|([4][1-9])|([5][0-3,4-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0,1,2,3,5,6,7,8,9]))[0-9]{8}$/,
							message: '请输入正确的手机号',
							trigger: 'blur'
						},
						{
							validator: checkMobileIsExist,
							trigger: 'blur'
						}
					],
					nickName: [{
						required: true,
						message: '请输入',
						trigger: 'blur',
					}],
					mail: [{
						pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
						message: '请输入正确的邮箱',
						trigger: 'blur',
						required: true,
					}],
					pwd: [{
							required: true,
							message: '请输入',
							trigger: 'blur',
						},
						{
							min: 6,
							max: 20,
							message: '密码长度应为6~20个字符',
							trigger: 'blur'
						},
						{
							pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/,
							message: '密码格式不正确，至少包含两种以上字母、数字、符号自由组合，区分大小写',
							trigger: 'blur'
						}
					],
					pwds: [{
							required: true,
							message: '请输入',
							trigger: 'blur',
						},
						{
							validator: checkPassword,
							trigger: 'blur'
						}
					],

				},
				visibles: false,
				buttonName: '新 增',
				type: 'add'
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				this.GetSubUserInfos()
				this.form.parentUserId = this.sysUser.userId
			},
			GetSubUserInfos(oriParam) {
				this.userList = []
				this.tableLoading = true

				const param = oriParam || {
					...this.searchCondition1,
					pageSize: this.pageSize,
					pageIndex: this.pageIndex
				}
				GetSubUserInfos(param).then(res => {
					if (res.data) {
						this.userList = res.data.rows
						this.totalCount = res.data.total
					} else {
						this.$message(res.message || '请求失败')
					}
					this.tableLoading = false
				})
			},
			handlePageChange(index) {
				this.pageIndex = index
				this.GetSubUserInfos()
			},
			handleSizeChange(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.GetSubUserInfos()

			},
			handleSearch(type) {
				if (type === 'refresh') {
					this.GetSubUserInfos()
				} else {
					this.searchCondition1 = deepClone(this.searchCondition)
					this.pageIndex = 1
					this.GetSubUserInfos()
				}
			},
			handleReset(formName) {
				this.$refs[formName].resetFields()
				this.form.id = ""
			},
			add() {
				this.type = 'add'
				this.visible = true
				this.title = '新增子账号'
				this.buttonName = '新 增'
				this.form = {
					id: "",
					userName: "",
					mobile: "",
					nickName: "",
					mail: "",
					disabled: "",
					pwd: "",
					pwds: "",
					isSubUser: 1,
					parentUserId: this.sysUser.userId
				}
				this.rules.pwd[0].required = true
				this.rules.pwds[0].required = true
			},
			edit(row) {
				this.type = 'edit'
				this.visible = true
				this.title = '子账号详情'
				this.buttonName = '提 交'
						var obj = deepClone(row)
						this.form = obj
						this.mobile = obj.mobile
						this.userName = obj.userName
						this.pwd = obj.pwd
						this.form.pwd = ""
						this.rules.pwd[0].required = false
						this.rules.pwds[0].required = false
						this.visible = true
			},
			close() {
				this.handleReset('form')
				this.visible = false
				this.showPwd = false
				this.showPwds = false
			},
			changeStatu(row) {
				disabledSysUser(row.disabled == 0 ? 1 : 0, row.userId).then(res => {
					if (res.data) {
						this.$message({
							type: 'success',
							message: '修改成功!'
						});
						this.visible = false
						this.GetSubUserInfos()
					} else {
						this.$message(res.message || '请求失败')
					}
				})
			},
			del(id) {
				this.$confirm('此操作将永久删除该子账号, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deleteSysUser(id).then(res => {
						if (res.data) {
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
							this.GetSubUserInfos()
						} else {
							this.$message(res.message || '请求失败')
						}
					})
				}).catch(() => {});
			},
			save() {
				this.$refs['form'].validate((valid) => {
					if (valid) {
						var obj = deepClone(this.form)
						if (this.form.pwd) {
							obj.pwd = md5(this.form.pwd)
						}
						if (this.type == 'add') {
							addUser(obj).then(res => {
								if (res.data) {
									this.visible = false
									this.$message({
										type: 'success',
										message: '操作成功!'
									});
									this.showPwd = false
									this.showPwds = false
									this.GetSubUserInfos()
								} else {

									this.$message(res.message || '请求失败')
								}
							})
						} else if (this.type == 'edit') {
							saveUser(obj).then(res => {
								if (res.data) {
									this.visible = false
									this.$message({
										type: 'success',
										message: '操作成功!'
									});
									this.GetSubUserInfos()
									this.showPwd = false
									this.showPwds = false
								} else {

									this.$message(res.message || '请求失败')
								}
							})
						}
					}

				})
			},
			changeShowPwd() {

			}
		}
	}
</script>

<style scoped>
	.content {
		margin: 10px;
	}

	.pagination {
		margin-top: 1rem;
	}

	.searchForm>>>.el-form-item {
		width: 130px;
	}

	.searchForm>>>.el-range-editor {
		width: 230px !important;
	}



	.dialogs>>>.el-card__body {
		padding: 0;
	}

	.dialogs>>>.el-input {
		width: 176px;
	}

	.title {
		padding: 20px 20px;
		font-weight: bold;
		margin: 0 0 10px 0;
	}

	.box-shadow {
		-webkit-box-shadow: 0 2px 2px 0 rgb(0 0 0 / 10%);
		box-shadow: 0 2px 2px 0 rgb(0 0 0 / 10%);
	}

	.dialogs1>>>.el-dialog__header {
		padding: 0;
	}

	.dialogs1>>>.el-dialog__close {
		color: #fff;
		font-weight: bold;
		font-size: 20px;
	}

	.dialogs1>>>.el-dialog__headerbtn {
		top: 15px;
		right: 15px;
	}

	.dialogs1>>>.el-dialog__footer {
		text-align: center;
	}

	.dialogs1>>>.el-dialog__body {
		padding: 5px 0;
	}

	.icon {
		cursor: pointer;
		font-size: 20px;
		margin-right: 5px;
		margin-top: 8px;
	}
</style>
