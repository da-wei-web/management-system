import { request } from './request'

export function reportsData() {
  return request({
    url: '/reports/type/1',
  })
}