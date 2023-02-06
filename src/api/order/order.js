import request from '@/utils/request'

export function CreateOrder(data) {
  return request({
    url: '/Order/Create',
    method: 'post',
    data
  })
}

export function GetOrder(orderNo) {
  return request({
    url: '/Order/Get',
    method: 'get',
    params: {
      orderNo
    }
  })
}

export function Reminder(orderNo) {
  return request({
    url: '/Order/Reminder',
    method: 'get',
    params: {
      orderNo
    }
  })
}

export function QueryOrders(data) {
  return request({
    url: '/Order/query',
    method: 'post',
    data
  })
}

export function QueryCustomerOrders(data) {
  return request({
    url: '/Order/query',
    method: 'post',
    data
  })
}

export function QueryBackOrders(data) {
  return request({
    url: '/Order/queryback',
    method: 'post',
    data
  })
}

export function GetPayment(orderNo) {
  return request({
    url: '/Order/GetPayment',
    method: 'get',
    params: {
      orderNo
    }
  })
}

export function CreatePaymentOrder(orderNo, payType) {
  return request({
    url: '/PaymentOrder/Create',
    method: 'post',
    params: {
      orderNo,
      payType
    }
  })
}

export function GetWaitPaymentOrder(orderNo) {
  return request({
    url: '/PaymentOrder/GetWaitPay',
    method: 'get',
    params: {
      orderNo
    }
  })
}

export function CancelPaymentOrder(paymentNo) {
  return request({
    url: '/PaymentOrder/Cancel',
    method: 'get',
    params: {
      paymentNo
    }
  })
}

export function PaymentCallback(paymentNo) {
  return request({
    url: '/PaymentOrder/Callback',
    method: 'get',
    params: {
      paymentNo
    }
  })
}

export function ConfirmOrder(orderNo) {
  return request({
    url: '/Order/Confirm',
    method: 'post',
    params: {
      orderNo
    }
  })
}

export function RejectOrder(orderNo) {
  return request({
    url: '/Order/Reject',
    method: 'post',
    params: {
      orderNo
    }
  })
}

export function LockOrder(orderNo) {
  return request({
    url: '/Order/Lock',
    method: 'post',
    params: {
      orderNo
    }
  })
}

export function UnlockOrder(orderNo) {
  return request({
    url: '/Order/Unlock',
    method: 'post',
    params: {
      orderNo
    }
  })
}

export function GetPaymentOrder(paymentOrderNo) {
  return request({
    url: '/PaymentOrder/Get',
    method: 'get',
    params: {
      paymentOrderNo
    }
  })
}

export function GetOrderLogs(orderNo) {
  return request({
    url: 'OrderLog/GetLogs',
    method: 'get',
    params: {
      orderNo
    }
  })
}

export function AddLog(orderNo, businessParam, optType) {
  return request({
    url: 'OrderLog/AddLog',
    method: 'post',
    params: {
      orderNo,
      businessParam,
      optType
    }
  })
}

export function QueryPurchaseOrders(data) {
  return request({
    url: 'PurchaseOrder/GetPurchaseOrders',
    method: 'post',
    data: data
  })
}

export function PurchaseRequest(orderNo) {
  return request({
    url: 'PurchaseOrder/PurchaseRequest',
    method: 'post',
    params: {
      orderNo
    }
  })
}

export function Purchase(data) {
  return request({
    url: 'PurchaseOrder/Purchase',
    method: 'post',
    data: data
  })
}

export function PurchaseOrderFromPlatform(orderNo) {
  return request({
    url: 'PurchaseOrder/PurchaseOrderFromPlatform',
    method: 'post',
    params: {
      orderNo
    }
  })
}

export function PurchaseFail(purchaseOrderNo) {
  return request({
    url: 'PurchaseOrder/PurchaseFail',
    method: 'post',
    params: {
      purchaseOrderNo
    }
  })
}

export function PurchaseRefund(purchaseOrderNo) {
  return request({
    url: 'PurchaseOrder/PurchaseRefund',
    method: 'post',
    params: {
      purchaseOrderNo
    }
  })
}

export function TurnToManual(orderNo) {
  return request({
    url: 'Order/TurnToManual',
    method: 'post',
    params: {
      orderNo
    }
  })
}

export function ConfirmFail(orderNo) {
  return request({
    url: 'Order/ConfirmFail',
    method: 'post',
    params: {
      orderNo
    }
  })
}

export function WaitReject(orderNo) {
  return request({
    url: 'Order/WaitReject',
    method: 'post',
    params: {
      orderNo
    }
  })
}


export function PurchaseSuccess(purchaseNo) {
  return request({
    url: 'Order/PurchaseSuccess',
    method: 'post',
    params: {
      purchaseNo
    }
  })
}

export function SuspendPurchase(orderNo) {
  return request({
    url: 'Order/SuspendPurchase',
    method: 'post',
    params: {
      orderNo
    }
  })
}

export function QueryPreSaleOrders(data) {
  return request({
    url: 'Order/QueryPreSaleOrders',
    method: 'post',
    data: data
  })
}

export function QueryOrderAfterSales(data) {
  return request({
    url: 'Order/QueryAfterSale',
    method: 'post',
    data: data
  })
}

export function CancelOrder(orderNo) {
  return request({
    url: 'Order/CancelOrder',
    method: 'post',
    params: {
      orderNo
    }
  })
}

export function PayLink(orderNo, payLink, amount, group) {
  return request({
    url: 'Order/PayLink',
    method: 'post',
    params: {
      orderNo,
      payLink,
      amount,
      group
    }
  })
}

export function GetWaitPayLink(group) {
  return request({
    url: 'Order/GetWaitPayLink',
    method: 'post',
    params: {
      group
    }
  })
}

export function GetPayLink(group) {
  return request({
    url: 'Order/GetPayLink',
    method: 'post',
    params: {
      group
    }
  })
}

export function Pay(orderNo, group) {
  return request({
    url: 'Order/Pay',
    method: 'post',
    params: {
      orderNo,
      group
    }
  })
}

export function RemovePay(orderNo, group) {
  return request({
    url: 'Order/RemovePay',
    method: 'post',
    params: {
      orderNo,
      group
    }
  })
}

export function GetUseable(data) {
  return request({
    url: '/PaymentType/GetUseable',
    method: 'post',
    data: data
  })
}

export function BalancePayment(paymentNo, paymentPwd) {
  return request({
    url: '/PaymentOrder/BalancePayment',
    method: 'post',
    params: {
      paymentNo,
      paymentPwd
    }
  })
}

export function UpdateThirdOrder(orderNo, thirdOrderNo, thirdPlatformId) {
  return request({
    url: '/Order/UpdateThirdOrder',
    method: 'post',
    params: {
      orderNo,
      thirdOrderNo,
      thirdPlatformId
    }
  })
}
