import { request } from './request'

// 添加商品
export function addGoods(data) {
  return request({
    url: '/goods',
    method: 'post',
    data
  })
}

// 删除商品
export function deleteGoodsById(id) {
  return request({
    url: '/goods/' + id,
    method: 'delete'
  })
}

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
