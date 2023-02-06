import request from '@/utils/request'

export function GetTranscations(data) {
  return request({
    url: '/TransactionDetail/GetTranscations',
    method: 'post',
    data: data
  })
}

export function GetTotalTranscation(data) {
  return request({
    url: '/TransactionDetail/GetTotalTranscation',
    method: 'post',
    data: data
  })
}

export function GetAccountTranscations(data) {
  return request({
    url: '/AccountTransactionDetail/GetAccountTranscations',
    method: 'post',
    data: data
  })
}

export function UpdatePayPwd(data) {
  return request({
    url: '/Account/UpdatePayPwd',
    method: 'post',
    data: data
  })
}

export function ResetPayPwd(userId) {
  return request({
    url: '/Account/ResetPayPwd',
    method: 'post',
    params: {
      userId
    }
  })
}

export function GetAccountBills(data) {
  return request({
    url: '/AccountTransaction/GetAccountBills',
    method: 'post',
    data: data
  })
}
