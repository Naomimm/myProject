import request from '@/utils/request'

export function getIssuerList(query) {
  return request({
    url: '/admin/issuer/',
    method: 'get',
    params: query
  })
}

export function getIssuer(id) {
  return request({
    url: '/admin/issuer/' + id,
    method: 'get'
  })
}

export function createIssuer(data) {
  return request({
    url: '/admin/issuer',
    method: 'post',
    data
  })
}

export function updateIssuer(id, data) {
  return request({
    url: '/admin/issuer/' + id,
    method: 'put',
    data
  })
}

export function deleteIssuer(id, data) {
  return request({
    url: '/admin/issuer/' + id,
    method: 'delete',
  })
}
