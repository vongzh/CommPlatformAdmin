import request from '@/utils/request'

export function GetOrderShunts(data) {
  return request({
    url: 'SysConfig/GetOrderShuntConfig', 
    method: 'post',
    data
  })
}

export function OrderShunt(data) {
  return request({
    url: 'SysConfig/SaveOrderShuntConfig',
    method: 'post',
    data
  })
}

export function DeleteOrderShunt(id) {
  return request({
    url: 'SysConfig/DeleteOrderShuntConfig',
    method: 'post',
    params: id
  })
}

export function CheckOrderShunt(id) {
  return request({
    url: 'SysConfig/CheckOrderShuntConfigIsExist', 
    method: 'post',
    params: id
  })
}
