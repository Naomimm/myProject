import request from '@/utils/request'

export function createKeypair(query) {
    return request({
        url: '/admin/wallet/create-keypair',
        method: 'post',
        params: query
    })
}

export function getUserWallet(userId) {
  return request({
    url: '/admin/user-wallet/',
    method: 'get',
    params: {limit: 10, page: 1, user_id: userId}
  })
}
