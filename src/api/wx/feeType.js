import request from '@/utils/request'

// 查询缴费类型 列表
export function listType(query) {
  return request({
    url: '/wx/feeType/list',
    method: 'get',
    params: query
  })
}

// 查询缴费类型 详细
export function getType(id) {
  return request({
    url: '/wx/feeType/' + id,
    method: 'get'
  })
}

// 新增缴费类型
export function addType(data) {
  return request({
    url: '/wx/feeType',
    method: 'post',
    data: data
  })
}

// 修改缴费类型
export function updateType(data) {
  return request({
    url: '/wx/feeType',
    method: 'put',
    data: data
  })
}

// 删除缴费类型
export function delType(id) {
  return request({
    url: '/wx/feeType/' + id,
    method: 'delete'
  })
}

// 导出缴费类型
export function exportType(query) {
  return request({
    url: '/wx/feeType/export',
    method: 'get',
    params: query
  })
}
// 查询缴费类型 列表
export function allListFeeType(query) {
  return request({
    url: '/wx/feeType/list',
    method: 'get',
    params: query
  })
}
