import request from '@/utils/request'
// 获取微信菜单列表
export function listWxMenu() {
  return request({
    url: '/wx/resource/listTree',
    method: 'get',
  })
}

// 获取菜单
export function uploadFile(data) {
  return request({
    url: '/wx/upload/uploadFile',
    method: 'post',
    data: data
  })
}

// 获取菜单
export function getWxMenu(id) {
  return request({
    url: '/wx/resource/' + id,
    method: 'get',
  })
}

// 添加菜单
export function addWxMenu(data) {
  return request({
    url: '/wx/resource/',
    method: 'post',
    data: data
  })
}

// 更新菜单
export function updateWxMenu(data) {
  return request({
    url: '/wx/resource/',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function deleteWxMenu(id) {
  return request({
    url: '/wx/resource/' + id,
    method: 'delete'
  })
}

// 删除菜单
export function deleteWxMenuAndChildren(id) {
  return request({
    url: '/wx/resource/delete/' + id,
    method: 'delete'
  })
}
