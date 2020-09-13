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

export function addCategory(data) {
  return request({
    url: '/categories',
    method: 'post',
    data,
  })
}

export function deleteCategory(id) {
  return request({
    url: '/categories/' + id,
    method: 'delete',
  })
}

export function getCategoryById(id) {
  return request({
    url: `/categories/` + id,
  })
}


export function editCategory(id, cat_name) {
  console.log(id, cat_name)
  return request({
    url: '/categories/' + id,
    method: 'put',
    data: {
      cat_name
    }
  })
}