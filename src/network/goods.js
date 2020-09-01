import { request } from './request'

// 获取商品列表
export function getGoodsList(query, pagenum, pagesize) {
  return request({
    url: '/goods',
    params: {
      query,
      pagenum, 
      pagesize
    }
  })
}