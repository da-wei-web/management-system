import { request } from './request'

export default function getUsersList() {
  return request({
    url: '/users'
  })
}