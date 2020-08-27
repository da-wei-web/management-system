import { request } from './request'

// 获得所有角色信息
export function getRoles() {
  return request({
    url: '/roles'
  })
}

// 删除角色的指定权限
export function deleteRight(roleId, rightId) {
  return request({
    url: `/roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}