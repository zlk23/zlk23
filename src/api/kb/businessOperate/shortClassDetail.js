import request from '@/utils/request'

// 查询短期班培训详情列表
export function listShortClassDetail(query) {
  return request({
    url: '/ywyx/shortClassDetail/list',
    method: 'get',
    params: query
  })
}

// 查询短期班培训详情详细
export function getShortClassDetail(id) {
  return request({
    url: '/ywyx/shortClassDetail/' + id,
    method: 'get'
  })
}

// 新增短期班培训详情
export function addShortClassDetail(data) {
  return request({
    url: '/ywyx/shortClassDetail',
    method: 'post',
    data: data
  })
}

// 修改短期班培训详情
export function updateShortClassDetail(data) {
  return request({
    url: '/ywyx/shortClassDetail',
    method: 'put',
    data: data
  })
}

// 删除短期班培训详情
export function delShortClassDetail(id) {
  return request({
    url: '/ywyx/shortClassDetail/' + id,
    method: 'delete'
  })
}

// 导出短期班培训详情
export function exportShortClassDetail(query) {
  return request({
    url: '/ywyx/shortClassDetail/export',
    method: 'get',
    params: query
  })
}
