import { request } from './request'

export function getRoles() {
  return request({
    url: 'roles'
  })
}