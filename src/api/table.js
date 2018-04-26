import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'article/posts',
    method: 'get',
    params
  })
}

export function updStat(postID, status) {
  return request({
    url: 'article/upstat',
    method: 'post',
    data: {
      postID: postID,
      status: status
    }
  })
}
