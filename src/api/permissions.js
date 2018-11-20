import request from '@/utils/request'

export function getPermissionList(query) {
  return request({
    url: '/admin/permission/',
    method: 'get',
    params: query
  })
}

export function getPermission(id) {
  return request({
    url: '/admin/permission/' + id,
    method: 'get'
  })
}

export function createPermission(data) {
  return request({
    url: '/admin/permission',
    method: 'post',
    data
  })
}

export function updatePermission(id, data) {
  return request({
    url: '/admin/permission/' + id,
    method: 'put',
    data
  })
}

export function deletePermission(id, data) {
  return request({
    url: '/admin/permission/' + id,
    method: 'delete'
  })
}
