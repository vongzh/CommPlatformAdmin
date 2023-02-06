import request from '@/utils/request'

export function GetSMSTemplate(id) {
  return request({
    url: '/SMS/GetSMSTemplate',
    method: 'post',
    params: {
      id
    }
  })
}

export function GetSMSTemplates(data) {
  return request({
    url: '/SMS/GetSMSTemplates',
    method: 'post',
    data: data
  })
}

export function SaveSMSTemplate(data) {
  return request({
    url: '/SMS/SaveSMSTemplate',
    method: 'post',
    data: data
  })
}

export function DeleteSMSTemplate(id) {
  return request({
    url: '/SMS/DeleteSMSTemplate',
    method: 'post',
    params: {
      id
    }
  })
}

export function GetSMSs(data) {
  return request({
    url: '/SMS/GetSMSs',
    method: 'post',
    data: data
  })
}

export function AddPlatform(data) {
  return request({
    url: '/SMSPlatform/Add',
    method: 'post',
    data: data
  })
}

export function EnabledPlatform(id) {
  return request({
    url: '/SMSPlatform/Enabled',
    method: 'post',
    params: {
      id
    }
  })
}

export function UpdatePlatform(id, templateId, sort) {
  return request({
    url: '/SMSPlatform/Update',
    method: 'post',
    params: {
      id
    },
    data: {
      item1: templateId,
      item2: sort
    }
  })
}
