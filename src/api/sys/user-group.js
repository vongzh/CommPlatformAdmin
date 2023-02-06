import request from '@/utils/request'

export function getUserGroup(param) {
  return request({
    url: '/SysUserGroup/Get',
    method: 'get',
    params: param
  })
}

export function getAllUserGroups() {
  return request({
    url: '/SysUserGroup/GetAll',
    method: 'get'
  })
}

export function getUserGroups(data) {
  return request({
    url: '/SysUserGroup/Query',
    method: 'post',
    data
  })
}

export function WalletRecharge(data) {
  return request({
    url: '/AccountInfo/AccountRecharge',
    method: 'post',
    data: data
  })
}

export function deleteUserGroup(param) {
  return request({
    url: '/SysUserGroup/Delete',
    method: 'get',
    params: param
  })
}

export function saveUserGroup(data) {
  return request({
    url: '/SysUserGroup/Save',
    method: 'post',
    data
  })
}
