import { request } from './request'

export const login = data => {
  return request({
    url: '/login',
    method: 'post',
    // 向后端发送的数据
    data
  })
}