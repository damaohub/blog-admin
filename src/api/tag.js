import request from '@/utils/request'

export function getTags() {
  return request({
    url: 'tags',
    method: 'get'
  })
}

export function postCountBytag(tag) {
  return request({
    url: 'tags/post-count',
    method: 'post',
    data: {
      tagName: tag
    }
  })
}
