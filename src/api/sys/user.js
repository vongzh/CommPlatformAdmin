import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/SysUser/Login',
    method: 'get',
    params: data
  })
}

export function Wechatlogin(data) {
  return request({
    url: '/SysUser/WechatLogin',
    method: 'get',
    params: data
  })
}

export function getUserInfo(userId) {
  return request({
    url: '/SysUser/Get',
    method: 'post',
    params: {
      userId: userId
    }
  })
}

export function deleteSysUser(userId) {
  return request({
    url: '/SysUser/Delete',
    method: 'get',
    params: {
      userId: userId
    }
  })
}

export function getUserList() {
  return request({
    url: '/SysUser/GetList',
    method: 'get'
  })
}

export function queryUserList(data) {
  return request({
    url: '/SysUser/Query',
    method: 'post',
    data
  })
}

export function saveUser(data) {
  return request({
    url: '/SysUser/Save',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/SysUser/Add',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/SysUser/Logout',
    method: 'get'
  })
}

export function ChangePwd(pwd, oldPwd) {
  return request({
    url: '/SysUser/ChangePwd',
    method: 'post',
    params: {
      pwd,
      oldPwd
    }
  })
}

export function disabledSysUser(disabled, userId) {
  return request({
    url: '/SysUser/Disabled',
    method: 'get',
    params: {
      disabled: disabled,
      userId: userId
    }
  })
}

export function ResetPwd(userId) {
  return request({
    url: '/SysUser/ResetPwd',
    method: 'post',
    params: {
      userId: userId
    }
  })
}

export function CheckSysUserMobileIsExist(userId, mobile) {
  return request({
    url: '/SysUser/CheckSysUserMobileIsExist',
    method: 'post',
    params: {
      userId,
      mobile
    }
  })
}
export function GetSubUserInfos(data) {
  return request({
    url: '/SysUser/GetSubUserInfos',
    method: 'post',
		data
  })
}
export function GetUserByUserId(userId) {
  return request({
    url: '/SysUser/GetUserByUserId',
    method: 'post',
    params: {
      userId: userId
    }
  })
}
export function SaveSubUser(data) {
  return request({
    url: '/SysUser/SaveSubUser',
    method: 'post',
		data
  })
}


export function SubUserDisabled(userId,disabled) {
  return request({
    url: '/SysUser/SubUserDisabled',
    method: 'get',
    params: {
      disabled: disabled,
      userId: userId
    }
  })
}
export function DeleteSubUser( id) {
  return request({
    url: '/SysUser/DeleteSubUser',
    method: 'get',
    params: {
      id: id
    }
  })
}