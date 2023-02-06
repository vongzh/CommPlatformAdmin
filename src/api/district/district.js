import request from '@/utils/request'

export function GetHotDistricts() {
  return request({
    url: '/District/GetHotDistricts',
    method: 'get'
  })
}

export function GetGroupDistricts() {
  return request({
    url: '/District/GetGroupDistricts',
    method: 'get'
  })
}

export function GetDistricts(keywords) {
  return request({
    url: '/District/GetDistricts',
    method: 'get',
    params: {
      keywords
    }
  })
}

export function GetDistrictDetails(cityId) {
  return request({
    url: '/District/GetDistrictDetails',
    method: 'get',
    params: {
      cityId
    }
  })
}

