import { request } from './request'

// 添加商品参数
export function addParameters(id, data) {
  return request({
    url: `/categories/${id}/attributes`,
    method: 'post',
    data
  })
}

// 获取商品参数数据
export function getGoodsParameters(id, sel) {
  return request({
    url: `/categories/${id}/attributes`,
    params: {
      sel
    }
  })
}

// 修改商品参数
export function modifyGoodsParameters(id, attrId, data) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'put',
    data
  })
}


