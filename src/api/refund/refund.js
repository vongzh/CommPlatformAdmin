import request from '@/utils/request'

export function ApplyRefound(data) {
  return request({
    url: '/Refund/ApplyRefound',
    method: 'post',
    data
  })
}

export function CancelRefoundApply(refundNo) {
  return request({
    url: '/Refund/CancelRefoundApply',
    method: 'post',
    params: { refundNo: refundNo }
  })
}

export function GetRefundApplys(data) {
  return request({
    url: '/Refund/GetRefundApplys',
    method: 'post',
    data
  })
}

export function ConfirmRefund(refundNo) {
  return request({
    url: '/Refund/Confirm',
    method: 'post',
    params: {
      refundNo
    }
  })
}

export function RejectRefund(refundNo, auditDesc) {
  return request({
    url: '/Refund/Reject',
    method: 'post',
    data: {
      item1: refundNo,
      item2: auditDesc
    }
  })
}

export function RefundTrade(refundNo) {
  return request({
    url: '/Refund/RefundTrade',
    method: 'post',
    params: {
      refundNo
    }
  })
} 

export function AdjustRefund(data) {
  return request({
    url: '/Refund/AdjustRefund',
    method: 'post',
    data
  })
} 