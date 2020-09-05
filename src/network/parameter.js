import { request } from './request'

export function getGoodsParameters(id, sel) {
  return request({
    url: `/categories/${id}/attributes`,
    params: {
      sel
    }
  })
}