import request from '@/utils/request'

export function getAccountList(query) {
  return request({
    url: '/admin/account/',
    method: 'get',
    params: query
  })
}

export function getAccount(id) {
  return request({
    url: '/admin/account/' + id,
    method: 'get'
  })
}

export function createAccount(data) {
  return request({
    url: '/admin/account',
    method: 'post',
    data
  })
}

export function updateAccount(id, data) {
  return request({
    url: '/admin/account/' + id,
    method: 'put',
    data
  })
}

export function deleteAccount(id, data) {
  return request({
    url: '/admin/account/' + id,
    method: 'delete'
  })
}
export function AccountLogin(data) {
  return request({
    url: '/admin/account/login',
    method: 'post',
    params: data
  })
}

export function getAccountRoles(id) {
  return request({
    url: '/admin/account/get-roles/' + id,
    method: 'get'
  })
}

export function setAccountRoles(data) {
  return request({
    url: '/admin/account/set-roles',
    method: 'post',
    params: data
  })
}

export function getPermissions(id) {
  return request({
    url: '/admin/account/get-permissions/' + id,
    method: 'get'
  })
}
