import { request } from './request'

// 获取商品分类列表
export function getGoodsCategory(type) {
  return request({
    url: '/categories',
    query: type
  })
}
