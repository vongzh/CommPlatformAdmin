import request from '@/utils/request'

export function SaveInvoiceInfo(data) {
  return request({
    url: '/Invoice/SaveInvoiceInfo',
    method: 'post',
    data: data
  })
}

export function GetInvoiceInfoResponse(id) {
  return request({
    url: '/Invoice/GetInvoiceInfoResponse',
    method: 'get',
    params: {
      id
    }
  })
}

export function InvoiceRequest(orderNo) {
  return request({
    url: '/Invoice/InvoiceRequest',
    method: 'post',
    params: {
      orderNo
    }
  })
}

export function InvoiceConfirm(invoiceNo) {
  return request({
    url: '/Invoice/InvoiceConfirm',
    method: 'post',
    params: {
      invoiceNo
    }
  })
}

export function GetInvoices(data) {
  return request({
    url: '/Invoice/GetInvoices',
    method: 'post',
    data: data
  })
}

// 可以开票的酒店列表
export function InvoiceHotelList(params) {
  return request({
    url: '/Invoice/InvoiceHotelList',
    method: 'post',
    data: params
  })
}

// 根据酒店名称查询订单列表
export function InvoiceOrderListByHotelName(params) {
  return request({
    url: '/Invoice/InvoiceOrderListByHotelName',
    method: 'post',
    data: params
  })
}

// 导出报表
export function ExportOrderList(params) {
  return request({
    url: '/Invoice/ExportOrderList',
    method: 'post',
    data: params
  })
}

// 联系信息录入
export function InvoiceContactInfoAdd(params) {
  return request({
    url: '/Invoice/InvoiceContactInfoAdd',
    method: 'post',
    data: params
  })
}

// 发票信息录入
export function InvoiceManageAdd(params) {
  return request({
    url: '/Invoice/InvoiceManageAdd',
    method: 'post',
    data: params
  })
}

// 解锁酒店
export function UnlockHotel(params) {
  return request({
    url: '/Invoice/UnlockHotel',
    method: 'post',
    data: params
  })
}

// 发票列表
export function GetInvoiceManageList(params) {
  return request({
    url: '/Invoice/GetInvoiceManageList',
    method: 'post',
    data: params
  })
}

// 根据发票查询订单列表
export function GetInvoiceOrderList(params) {
  return request({
    url: '/Invoice/GetInvoiceOrderList',
    method: 'post',
    data: params
  })
}

// 审核发票
export function AuditInvoiceManage(params) {
  return request({
    url: '/Invoice/AuditInvoiceManage',
    method: 'post',
    data: params
  })
}

// 驳回发票
export function RejectInvoiceManage(params) {
  return request({
    url: '/Invoice/RejectInvoiceManage',
    method: 'post',
    data: params
  })
}

