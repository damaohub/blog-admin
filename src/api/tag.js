import request from '@/utils/request'

export function getTags() {
  return request({
    url: 'tags',
    method: 'get'
  })
}

export function postsBytag(tag) {
  return request({
    url: 'tag-posts',
    method: 'post',
    data: {
      tagName: tag
    }
  })
}

export function deleteTag(_tagId) {
  return request({
    url: 'tag-delete',
    method: 'post',
    data: {
      tagId: _tagId
    }
  })
}
