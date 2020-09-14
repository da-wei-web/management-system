import { request } from './request'

export function getOrders(pagenum, pagesize) {
  return request({
    url: '/orders',
    params: {
      pagenum,
      pagesize,
    }
  })
}