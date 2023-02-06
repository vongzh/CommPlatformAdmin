import request from '@/utils/request'

export function getModule(param) {
  return request({
    url: '/SysModule/Get',
    method: 'get',
    params: param
  })
}

export function getModules(data) {
  return request({
    url: '/SysModule/Query',
    method: 'post',
    data
  })
}

export function deleteModule(param) {
  return request({
    url: '/SysModule/Delete',
    method: 'get',
    params: param
  })
}

export function saveModule(data) {
  return request({
    url: '/SysModule/Save',
    method: 'post',
    data
  })
}
