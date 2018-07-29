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

export function deletePost(postID) {
  return request({
    url: 'article/delete',
    method: 'post',
    data: {
      postID: postID
    }
  })
}

export function createPost(info) {
  return request({
    url: 'article/create',
    method: 'post',
    data: info
  })
}

export function updatePost(info) {
  return request({
    url: 'article/update',
    method: 'post',
    data: info
  })
}
export function fetchArticle(id) {
  return request({
    url: 'article/detail',
    method: 'get',
    params: { //  axios  get传参用params
      postID: id
    }
  })
}

export function getPostTags(id) {
  return request({
    url: 'article/post-tags',
    method: 'get',
    params: { //  axios  get传参用params
      postID: id
    }
  })
}
