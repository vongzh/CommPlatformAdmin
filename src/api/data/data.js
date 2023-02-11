import request from '@/utils/request'

export function QueryScheme() {
  return request({
    url: '/Scheme/Query',
    method: 'post'
  })
}

export function QueryCourse(data) {
  return request({
    url: '/Course/Query',
    method: 'post',
    data
  })
}

export function SaveScheme(data) {
  return request({
    url: '/Scheme/Save',
    method: 'post',
    data
  })
}

export function SaveCourse(data) {
  return request({
    url: '/Course/Save',
    method: 'post',
    data
  })
}