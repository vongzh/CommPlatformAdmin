import request from '@/utils/request'

export function SaveNotice(data) {
  return request({
    url: '/Notice/SaveNotice',
    method: 'post',
    data: data
  })
}

export function GetNotices(data) {
  return request({
    url: '/Notice/GetNotices',
    method: 'post',
    data: data
  })
}

export function GetNotice(id) {
  return request({
    url: '/Notice/GetNotice',
    method: 'post',
    params: {
      id
    }
  })
}

export function NoticeRead(noticeId) {
  return request({
    url: '/Notice/NoticeRead',
    method: 'post',
    params: {
      noticeId
    }
  })
}

export function NoticePublish(noticeId) {
  return request({
    url: '/Notice/publish',
    method: 'post',
    params: {
      noticeId
    }
  })
}

export function NoticeTop(noticeId) {
  return request({
    url: '/Notice/Top',
    method: 'post',
    params: {
      noticeId
    }
  })
}

