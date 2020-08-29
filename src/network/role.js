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

// 更改角色权限
export function changeRoleRights(roleId, rids) {
  console.log(roleId, rids)
  return request({
    url: `/roles/${roleId}/rights`,
    method: 'post',
    data: {
      rids
    }
  })
}