import request from '@/utils/request'

export function regist(formData) {
  return request({
    url: 'regist',
    method: 'post',
    data: {
      username: formData.username,
      email: formData.email,
      password: formData.password
    }
  })
}

export function loginByUsername(username, password) {
  return request({
    url: 'login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function logout() {
  return request({
    url: 'logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: 'info',
    method: 'get',
    params: { token }
  })
}
