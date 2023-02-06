import request from '@/utils/request'

export function Dashboard() {
  return request({
    url: 'Statistics/Dashboard',
    method: 'post'
  })
}

export function OrderStatistics() {
  return request({
    url: 'Statistics/OrderStatistics',
    method: 'post'
  })
}
