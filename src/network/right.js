import { request } from './request'

// 获得所有角色信息
export function getRights(type) {
  return request({
    url: `/rights/${type}`
  })
}
