import request from '@/utils/request'

export function GetOrderPurchaseMethodCongfigs(data) {
  return request({
    url: 'SysConfig/GetOrderPurchaseMethodConfigs', 
    method: 'post',
    data
  })
}

export function SaveOrderPurchaseMethodConfig(data) {
  return request({
    url: 'SysConfig/SaveOrderPurchaseMethodConfig',
    method: 'post',
    data
  })
}

export function DeleteOrderPurchaseMethod(id) {
  return request({
    url: 'SysConfig/DeleteOrderPurchaseMethodConfig',
    method: 'post',
    params: id
  })
}

export function CheckPurchaseMthodConfig(id) {
  return request({
    url: 'SysConfig/OrderPurchaseMethodConfigIsExist', 
    method: 'post',
    params: id
  })
}
