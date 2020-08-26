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

export function setUserRole(id, rid) {
  console.log(id, rid)
  return request({
    url: `/users/${id}/role`,
    method: 'put',
    data: {
      rid: rid
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

// 编辑用户信息
export function editUser(id, data) {
  return request({
    url: `/users/` + id,
    method: 'put',
    data
  })
}

// 根据id查询用户信息
export function getUserById(id) {
  return request({
    url: '/users/' + id
  })
}

// 修改用户状态
export function modifyUserState(uId, type) {
  return request({
    url: `users/${uId}/state/${type}`,
    method: 'put'
  })
}