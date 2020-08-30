import { request } from './request'

// 获得所有权限列表
export function getRights(type) {
  return request({
    url: `/rights/${type}`
  })
}
