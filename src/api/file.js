import request from '@/utils/request'

export function getFileList(query) {
  return request({
    url: '/admin/help',
    method: 'get',
    params: query
  })
}

export function getFile(id) {
  return request({
    url: '/admin/help/' + id,
    method: 'get'
  })
}

export function creatFile(data) {
  return request({
    url: '/admin/help',
    method: 'post',
    data
  })
}

export function updataFile(id, data) {
  return request({
    url: '/admin/help/' + id,
    method: 'put',
    data
  })
}

export function deleteFile(id, data) {
  return request({
    url: '/admin/help/' + id,
    method: 'delete'
  })
}
