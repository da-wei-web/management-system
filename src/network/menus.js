import { request } from './request'

// 获取菜单权限列表
export function getMenus() {
  return request({
    url: '/menus'
  })
}