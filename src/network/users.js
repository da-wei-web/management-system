import { request } from './request'

export function getUsersList(query, pagenum, pagesize) {
  return request({
    url: '/users',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

// 添加用户
export function addUser(data) {
  return request({
    url: '/users',
    method: "post",
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/users/` + id,
    method: 'delete'
  })
}

