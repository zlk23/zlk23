import request from '@/utils/request'

// 查询微信用户角色
export function listIntegratedQuery(query) {
  return request({
    url: '/wx/integrated/integratedQuery',
    method: 'get',
    params: query
  })
}

// 查询微信用户角色
export function exportIntegratedExcel(query) {
  return request({
    url: '/wx/integrated/export/integratedExcel',
    method: 'get',
    params: query,
    timeout: 0
  })
}
