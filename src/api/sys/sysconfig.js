import request from '@/utils/request'

export function GetDataConfigs(data) {
  return request({
    url: 'SysConfig/GetDataConfigs',
    method: 'post',
    data
  })
}

export function DataConfig(data) {
  return request({
    url: 'SysConfig/DataConfig',
    method: 'post',
    data
  })
}

export function DelateDataConfig(id) {
  return request({
    url: 'SysConfig/Delete',
    method: 'post',
    params: id
  })
}

// 获取采购平台信息
export function GetPurchasePlatforms() {
  return request({
    url: 'SysConfig/GetPurchasePlatforms',
    method: 'post',
  })
}


