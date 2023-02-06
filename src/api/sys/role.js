import request from '@/utils/request'

export function getRole(param) {
  return request({
    url: '/SysRole/Get',
    method: 'get',
    params: param
  })
}

export function getRoles(data) {
  return request({
    url: '/SysRole/Query',
    method: 'post',
    data
  })
}

export function getAllRoles() {
  return request({
    url: '/SysRole/GetAll',
    method: 'get'
  })
}

export function deleteRole(param) {
  return request({
    url: '/SysRole/Delete',
    method: 'get',
    params: param
  })
}

export function saveRole(data) {
  return request({
    url: '/SysRole/Save',
    method: 'post',
    data
  })
}

export function saveUserRoles(userId, data) {
  return request({
    url: '/SysRole/SaveUserRole',
    method: 'post',
    params: { userId: userId },
    data
  })
}

export function getUserRoles(userId) {
  return request({
    url: '/SysRole/GetUserRole',
    method: 'get',
    params: { userId: userId }
  })
}
