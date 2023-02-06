import request from '@/utils/request'

export function RequestToken(authorization) {
  const param = new URLSearchParams()
  param.append('grant_type', 'client_credentials')

  return request({
    url: '/token',
    method: 'post',
    data: param,
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
