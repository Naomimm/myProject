import request from '@/utils/request'

export function getNewsList(query) {
  return request({
    url: '/admin/news/',
    method: 'get',
    params: query
  })
}

export function getNews(id) {
  return request({
    url: '/admin/news/' + id,
    method: 'get'
  })
}

export function createNews(data) {
  return request({
    url: '/admin/news',
    method: 'post',
    data
  })
}

export function updateNews(id, data) {
  return request({
    url: '/admin/news/' + id,
    method: 'put',
    data
  })
}

export function deleteNews(id, data) {
  return request({
    url: '/admin/news/' + id,
    method: 'delete',
  })
}
