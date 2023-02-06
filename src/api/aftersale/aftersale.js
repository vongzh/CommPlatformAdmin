import request from '@/utils/request'
export function QueryAfterSaleApplys(data) {
  return request({
    url: 'AfterSale/Query',
    method: 'post',
    data: data
  })
}

export function Apply(data) {
  return request({
    url: 'AfterSale/Apply',
    method: 'post',
    data: data
  })
}

export function Handler(afterSaleNo, status) {
  return request({
    url: 'AfterSale/Handler',
    method: 'post',
    params: {
      afterSaleNo,
      status
    }
  })
}

export function AddRecord(data) {
  return request({
    url: 'AfterSale/AddRecord',
    method: 'post',
    data: data
  })
}

export function RecordEnd(afterSaleNo, sessionId) {
  return request({
    url: 'AfterSale/RecordEnd',
    method: 'post',
    params: {
      afterSaleNo,
      sessionId
    }
  })
}

export function QiYuLogin(data) {
  return request({
    url: 'QiYu/Login',
    method: 'post',
    data: data
  })
}
