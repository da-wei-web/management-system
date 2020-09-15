import { request } from './request'

export function getOrders(query, pagenum, pagesize) {
  console.log(query, pagenum, pagesize)
  return request({
    url: '/orders',
    params: {
      query,
      pagenum,
      pagesize,
    }
  })
}

export function getOrderById(id) {
  return request({
    url: '/orders/' + id,
  })
}

