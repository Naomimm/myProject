import request from '@/utils/request'

export function getUserList(query) {
  return request({
    url: '/admin/user/',
    method: 'get',
    params: query
  })
}

export function getUser(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

export function createUser(data) {
  return request({
    url: '/admin/user',
    method: 'post',
    data
  })
}

export function updateUser(id, data) {
  return request({
    url: '/admin/user/' + id,
    method: 'put',
    data
  })
}

export function deleteUser(id, data) {
  return request({
    url: '/admin/user/' + id,
    method: 'delete',
  })
}
