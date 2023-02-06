import request from '@/utils/request'

export function GetThrottlePolicy() {
  return request({
    url: '/Throttle/Policy',
    method: 'post'
  })
}

export function SetThrottlePolicy(data) {
  return request({
    url: '/Throttle/SetPolicy',
    method: 'post',
    data: data
  })
}
