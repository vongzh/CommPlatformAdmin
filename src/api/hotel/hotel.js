import request from '@/utils/request'

export function GetHotelList(data) {
  return request({
    url: '/Hotel/GetList',
    method: 'post',
    data
  })
}

export function GetAllHotelList(data) {
  return request({
    url: '/Hotel/GetAllList',
    method: 'post',
    data
  })
}

export function HotelSuggest(cityId, keyword) {
  return request({
    url: '/Hotel/Suggest',
    method: 'post',
    params: {
      cityId,
      keyword
    }
  })
}

export function GetHotel(params) {
  return request({
    url: '/Hotel/Get',
    method: 'get',
    params
  })
}

export function GetHotelQuotedPrices(params) {
  return request({
    url: '/Hotel/GetHotelQuotedPrices',
    method: 'get',
    params
  })
}

export function GetRoomType(params) {
  return request({
    url: '/RoomType/Get',
    method: 'get',
    params
  })
}

export function GetHotelCategoryByCityId(cityId) {
  return request({
    url: '/HotelCategory/GetByCityId',
    method: 'post',
    params: {
      cityId
    }
  })
}

export function GetHotelStar() {
  return request({
    url: '/HotelStar/Get',
    method: 'post'
  })
}

export function GetUseable() {
  return request({
    url: ' /PaymentType/GetUseable',
    method: 'post'
  })
}

export function GetHotelBrandByCityId(cityId) {
  return request({
    url: '/HotelBrand/GetByCityId',
    method: 'post',
    params: {
      cityId
    }
  })
}

export function GetHotelBlackList(data) {
  return request({
    url: '/HotelBlack/GetList',
    method: 'post',
    data: data
  })
}

export function EffectHotelBlack(id) {
  return request({
    url: '/HotelBlack/Effect',
    method: 'post',
    params: {
      id
    }
  })
}

export function SaveHotelBlack(data) {
  return request({
    url: '/HotelBlack/Save',
    method: 'post',
    data: data
  })
}

export function GetRoomTypeBlackList(data) {
  return request({
    url: '/RoomTypeBlack/GetList',
    method: 'post',
    data: data
  })
}

export function EffectRoomTypeBlack(id) {
  return request({
    url: '/RoomTypeBlack/Effect',
    method: 'post',
    params: {
      id
    }
  })
}

export function SaveRoomTypeBlack(data) {
  return request({
    url: '/RoomTypeBlack/Save',
    method: 'post',
    data: data
  })
}

export function GetHotelMaapings(data) {
  return request({
    url: '/HotelMapping/GetHotelMaapings',
    method: 'post',
    data: data
  })
}

export function HotelIsOnline(id) {
  return request({
    url: '/HotelMapping/Online',
    method: 'post',
    params: {
      id
    }
  })
}

export function RoomTypeIsOnline(id) {
  return request({
    url: '/RoomTypeMapping/OnLine',
    method: 'post',
    params: {
      id
    }
  })
}

export function GetReserverInfo(hotelCode, roomTypeCode, roomId, platform) {
  return request({
    url: '/Room/GetReserverRoomDetail',
    method: 'post',
    params: {
      hotelCode,
      roomTypeCode,
      roomId,
      platform
    }
  })
}

export function GetPriceCalender(hotelCode, roomTypeCode, roomId, checkInDate, checkOutDate, platform) {
  return request({
    url: '/Room/GetPriceCalender',
    method: 'post',
    params: {
      hotelCode,
      roomTypeCode,
      roomId,
      checkInDate,
      checkOutDate,
			platform
    }
  })
}

export function PreOrderCheck(data) {
  return request({
    url: '/Room/PreOrderCheck',
    method: 'post',
    data: data
  })
}

export function HotelMatch(hotelId, matchType) {
  return request({
    url: '/Hotel/HotelMatch',
    method: 'post',
    params: {
      hotelId,
      matchType
    }
  })
}
