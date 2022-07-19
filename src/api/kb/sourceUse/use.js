import request from '@/utils/request'

// 查询资源使用列表
export function listSourceUsed(query) {
  return request({
    url: '/resource/used/list',
    method: 'get',
    params: query
  })
}

// 查询资源使用详细
export function getSourceUsed(id) {
  return request({
    url: '/resource/used/' + id,
    method: 'get'
  })
}

// 新增资源使用
export function addSourceUsed(data) {
  return request({
    url: '/resource/used',
    method: 'post',
    data: data
  })
}

// 修改资源使用
export function updateSourceUsed(data) {
  return request({
    url: '/resource/used',
    method: 'put',
    data: data
  })
}

// 删除资源使用
export function delSourceUsed(id) {
  return request({
    url: '/resource/used/' + id,
    method: 'delete'
  })
}

// 导出资源使用
export function exportSourceUsed(query) {
  return request({
    url: '/resource/used/export',
    method: 'get',
    params: query
  })
}
