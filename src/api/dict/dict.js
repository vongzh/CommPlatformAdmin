import request from '@/utils/request'

export function GetPlatformDict() {
  return request({
    url: '/SysConfig/GetDiretctPlatformList',
    method: 'post'
  })
}


export function GetOrderStatusDict() {
  return request({
    url: '/SysConfig/GetDiretctPlatformList',
    method: 'post'
  })
}

