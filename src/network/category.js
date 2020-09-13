import { request } from './request'

// 获取商品分类列表
export function getGoodsCategory(type, pagenum, pagesize) {
  return request({
    url: '/categories',
    params: {
      type,
      pagenum,
      pagesize
    }
  })
}
