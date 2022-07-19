import request from '@/utils/request'

// 查询用户列表
export function listInfo(query) {
  return request({
    url: '/wx/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getInfo(id) {
  return request({
    url: '/wx/user/' + id,
    method: 'get',
  })
}

// 查询用户已选角色列表
export function getUserRoleInfo(id) {
  return request({
    url: '/wx/userRole/list',
    method: 'get',
    params: {wxUserId: id}
  })
}



// 修改用户
export function updateInfo(data) {
  return request({
    url: '/wx/user/',
    method: 'put',
    data: data
  })
}

// 导出用户
export function exportInfo(query) {
  return request({
    url: '/wx/user/export',
    method: 'get',
    params: query
  })
}

// 导出用户
export function getAddress(id) {
  return request({
    url: '/wechat/personal/regionList',
    method: 'get',
    params: {'id':id}
  })
}

export function getUserInfo(id) {
  return request({
    url: '/wx/info/' + id,
    method: 'get',
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/wx/info',
    method: 'put',
    data: data
  })
}


