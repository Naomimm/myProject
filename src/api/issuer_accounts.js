import request from '@/utils/request'

export function getIssuerAccountList(query) {
  return request({
    url: '/admin/issuer-account/',
    method: 'get',
    params: query
  })
}
export function getIssuerAccount(id) {
  return request({
    url: '/admin/issuer-account/' + id,
    method: 'get'
  })
}

export function createIssuerAccount(data) {
  return request({
    url: '/admin/issuer-account',
    method: 'post',
    data
  })
}

export function updateIssuerAccount(id, data) {
  return request({
    url: '/admin/issuer-account/' + id,
    method: 'put',
    data
  })
}

export function deleteIssuerAccount(id, data) {
  return request({
    url: '/admin/issuer-account/' + id,
    method: 'delete',
  })
}
