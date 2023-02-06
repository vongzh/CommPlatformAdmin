import request from '@/utils/request'

export function GetHotelQuotes(data) {
  return request({
    url: 'SysConfig/GetHotelOfferConfigs',
    method: 'post',
    data
  })
}

export function HotelQuote(data) {
  return request({
    url: 'SysConfig/SaveHotelOfferConfig',
    method: 'post',
    data
  })
}

export function DeleteHotelQuote(id) {
  return request({
    url: 'SysConfig/DeleteHotelOfferConfig',
    method: 'post',
    params: id
  })
}

export function CheckHotelQuote(id) {
  return request({
    url: 'SysConfig/CheckHotelOfferConfigIsExist', 
    method: 'post',
    params: id
  })
}
