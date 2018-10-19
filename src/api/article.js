import request from '@/utils/request'

export function getList() {
  return request({
    url: 'post-list',
    method: 'post'
  })
}

export function updStat(postID, status) {
  return request({
    url: 'post-upstat',
    method: 'post',
    data: {
      postID: postID,
      status: status
    }
  })
}

export function deletePost(postID) {
  return request({
    url: 'post-delete',
    method: 'post',
    data: {
      postID: postID
    }
  })
}

export function createPost(info) {
  return request({
    url: 'post-create',
    method: 'post',
    data: info
  })
}

export function updatePost(info) {
  return request({
    url: 'post-update',
    method: 'post',
    data: info
  })
}
export function fetchArticle(id) {
  return request({
    url: 'post-detail',
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
