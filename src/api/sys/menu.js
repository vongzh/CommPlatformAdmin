import request from '@/utils/request'

export function getMenus(data) {
  return request({
    url: '/SysMenu/Query',
    method: 'post',
    data
  })
}

export function getNestMenus() {
  return request({
    url: '/SysMenu/QueryNest',
    method: 'get'
  })
}

export function getMenu(param) {
  return request({
    url: '/SysMenu/Get',
    method: 'get',
    params: param
  })
}

export function deleteMenu(param) {
  return request({
    url: '/SysMenu/Delete',
    method: 'get',
    params: param
  })
}

export function enabledMenu(param) {
  return request({
    url: '/SysMenu/Enabled',
    method: 'get',
    params: param
  })
}

export function saveMenu(data) {
  return request({
    url: '/SysMenu/Save',
    method: 'post',
    data
  })
}

