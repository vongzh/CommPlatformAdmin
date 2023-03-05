import request from '@/utils/request'

export function QueryOrders(data) {
    return request({
        url: '/Order1/Query',
        method: 'post',
        data
    })
}

export function GetOrder(orderNo) {
    return request({
        url: '/Order1/Get',
        method: 'post',
        params: {
            orderNo
        }
    })
}

export function GetPaymentOrders(orderNo, openId ) {
    return request({
        url: '/Payment/GetPaymentOrders',
        method: 'post',
        params: {
            orderNo,
            openId
        }
    })
}