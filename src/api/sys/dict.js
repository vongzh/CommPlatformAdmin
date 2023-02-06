import request from '@/utils/request'

export function GetPurchasePlatForms(data) {
  return request({
    url: 'SysConfig/GetPurchasePlatForms',
    method: 'post',
    data
  })
}