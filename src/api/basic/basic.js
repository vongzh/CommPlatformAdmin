import request from '@/utils/request'

export function GetCities() {
  return request({
    url: '/Basic/Area/GetCities',
    method: 'get'
  })
}

export function GetCitiesGroup() {
  return request({
    url: '/Basic/Area/GetCitiesGroup',
    method: 'get'
  })
}

export function GetHotCities() {
  return request({
    url: '/Basic/Area/GetHotCities',
    method: 'get'
  })
}
