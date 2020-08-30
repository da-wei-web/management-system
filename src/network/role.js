import { request } from './request'

// 获得所有角色信息
export function getRoles() {
  return request({
    url: '/roles'
  })
}

// 根据id查询角色
export function getRole(id) {
  return request({
    url: '/roles/' + id
  })
}

// 添加角色
export function addRole(data) {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}



// 删除当前角色 id -> 角色id
export function deleteCurrentRole(id) {
  return request({
    url: '/roles/' + id,
    method: 'delete'
  })
}

// 删除角色的指定权限
export function deleteRight(roleId, rightId) {
  return request({
    url: `/roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

// 编辑角色
export function editRoleById(id, data) {
  return request({
    url: '/roles/' + id,
    method: 'put',
    data
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