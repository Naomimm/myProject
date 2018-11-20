import request from '@/utils/request'

export function getAssetList(query) {
    return request({
        url: '/admin/asset/',
        method: 'get',
        params: query
    })
}

export function getAsset(id) {
  return request({
    url: '/admin/asset/' + id,
    method: 'get'
  })
}

export function createAsset(data) {
  return request({
    url: '/admin/asset',
    method: 'post',
    data
  })
}

export function updateAsset(id, data) {
  return request({
    url: '/admin/asset/' + id,
    method: 'put',
    data
  })
}

export function deleteAsset(id, data) {
  return request({
    url: '/admin/asset/' + id,
    method: 'delete',
  })
}
