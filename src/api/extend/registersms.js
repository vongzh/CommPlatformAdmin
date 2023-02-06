import request from '@/utils/request'

export function SubmitRegisterBatch(format, content) {
  return request({
    url: '/RegisterSMS/SubmitRegisterBatch',
    method: 'post',
    data: { item1: format, item2: content }
  })
}

export function GetGetRegisterBatch(batchID) {
  return request({
    url: '/RegisterSMS/RegisterBatch',
    method: 'post',
    params: { batchID }
  })
}

export function GetRegisterBatchInfo() {
  return request({
    url: '/RegisterSMS/RegisterBatchInfo',
    method: 'post'
  })
}

export function RetryRegister(batchID) {
  return request({
    url: '/RegisterSMS/RetryRegister',
    method: 'post',
    params: { batchID }
  })
}

export function ImportMails(format, content) {
  return request({
    url: '/RegisterSMS/ImportMails',
    method: 'post',
    data: { item1: format, item2: content }
  })
}

export function GetMailCount() {
  return request({
    url: '/RegisterSMS/GetMailCount',
    method: 'post'
  })
}

export function TodayRegisterAccount() {
  return request({
    url: '/RegisterSMS/TodayRegisterAccount',
    method: 'post'
  })
}

export function TodayRegisterInfo() {
  return request({
    url: '/RegisterSMS/TodayRegisterInfo',
    method: 'post'
  })
}
