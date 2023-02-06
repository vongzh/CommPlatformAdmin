import request from '@/utils/request'

export function GetLoginLogs(data) {
  return request({
    url: '/Log/LoginLog',
    method: 'post',
    data: data
  })
}

export function GetOperationLogs(data) {
  return request({
    url: '/Log/OperationLog',
    method: 'post',
    data: data
  })
}

export function GetOperationLogTimes(data) {
  return request({
    url: '/Log/OperationLogTime',
    method: 'post',
    data: data
  })
}

export function AddOperationLog(optType, businessParam) {
  return request({
    url: '/Log/AddOperationLog',
    method: 'post',
    data: {
      item1: optType,
      item2: businessParam
    }
  })
}
