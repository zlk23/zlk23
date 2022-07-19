import request from '@/utils/request'

// 获取公众号菜单树形数据
export function listTreeMenu() {
  return request({
    url: '/wx/menu/listTree',
    method: 'get',
  })
}

// 获取公众号菜单列表
export function listMenu() {
  return request({
    url: '/wx/menu/list',
    method: 'get',
  })
}

// 获取菜单详细信息
export function getMenu(id) {
  return request({
    url: '/wx/menu/' + id,
    method: 'get',
  })
}

// 创建或更新微信菜单
export function createWxMenu() {
  return request({
    url: '/wx/menu/createWxMenu',
    method: 'get'
  })
}

// 添加菜单
export function addMenu(data) {
  return request({
    url: '/wx/menu',
    method: 'post',
    data: data
  })
}

// 更新菜单信息
export function updateMenu(data) {
  return request({
    url: '/wx/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function deleteMenu(id) {
  return request({
    url: '/wx/menu/' + id,
    method: 'delete'
  })
}

// // 删除菜单
// export function deleteMenuAndChildren(id) {
//   return request({
//     url: '/wx/menu/delete/' + id,
//     method: 'delete'
//   })
// }
