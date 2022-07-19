import request from '@/utils/request'

// 查询培训班次费用列表
export function listCost(query) {
  return request({
    url: '/wx/cost/list',
    method: 'get',
    params: query
  })
}

// 查询培训班次费用详细
export function getCost(id) {
  return request({
    url: '/wx/cost/' + id,
    method: 'get'
  })
}

// 新增培训班次费用
export function addCost(data) {
  return request({
    url: '/wx/cost',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改培训班次费用
export function updateCost(data) {
  return request({
    url: '/wx/cost',
    method: 'put',
    data: data
  })
}

// 删除培训班次费用
export function delCost(id) {
  return request({
    url: '/wx/cost/' + id,
    method: 'delete'
  })
}

// 导出培训班次费用
export function exportCost(query) {
  return request({
    url: '/wx/cost/export',
    method: 'get',
    params: query
  })
}

// 获取训班次费用
export function getAllCost(shortClassId) {
  return request({
    url: '/wx/cost/fee/' + shortClassId,
    method: 'get',
  })
}

