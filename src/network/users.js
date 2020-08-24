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

