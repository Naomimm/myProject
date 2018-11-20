import request from '@/utils/request'

export function getRoleList(query) {
  return request({
    url: '/admin/role/',
    method: 'get',
    params: query
  })
}

export function getRole(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export function createRole(data) {
  return request({
    url: '/admin/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: '/admin/role/' + id,
    method: 'put',
    data
  })
}

export function deleteRole(id, data) {
  return request({
    url: '/admin/role/' + id,
    method: 'delete'
  })
}

export function getRolePermissions(id) {
  return request({
    url: '/admin/role/get-permissions/' + id,
    method: 'get'
  })
}
export function setRolePermissions(data) {
  return request({
    url: '/admin/role/set-permissions',
    method: 'post',
    params: data
  })
}
