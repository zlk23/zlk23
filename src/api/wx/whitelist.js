import request from '@/utils/request'

// 查询报名缴费白名单列表
export function listWhitelist(query) {
  return request({
    url: '/wx/whitelist/list',
    method: 'get',
    params: query
  })
}

// 查询报名缴费白名单详细
export function getWhitelist(id) {
  return request({
    url: '/wx/whitelist/' + id,
    method: 'get'
  })
}

// 新增报名缴费白名单
export function addWhitelist(data) {
  return request({
    url: '/wx/whitelist',
    method: 'post',
    data: data
  })
}

// 修改报名缴费白名单
export function updateWhitelist(data) {
  return request({
    url: '/wx/whitelist',
    method: 'put',
    data: data
  })
}

// 删除报名缴费白名单
export function delWhitelist(id) {
  return request({
    url: '/wx/whitelist/' + id,
    method: 'delete'
  })
}

// 导出报名缴费白名单
export function exportWhitelist(query) {
  return request({
    url: '/wx/whitelist/export',
    method: 'get',
    params: query
  })
}