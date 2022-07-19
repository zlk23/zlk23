import request from '@/utils/request'

// 查询缴费方式 列表
export function listType(query) {
  return request({
    url: '/wx/payType/list',
    method: 'get',
    params: query
  })
}

// 查询缴费方式 详细
export function getType(id) {
  return request({
    url: '/wx/payType/' + id,
    method: 'get'
  })
}

// 新增缴费方式
export function addType(data) {
  return request({
    url: '/wx/payType',
    method: 'post',
    data: data
  })
}

// 修改缴费方式
export function updateType(data) {
  return request({
    url: '/wx/payType',
    method: 'put',
    data: data
  })
}

// 删除缴费方式
export function delType(id) {
  return request({
    url: '/wx/payType/' + id,
    method: 'delete'
  })
}

// 导出缴费方式
export function exportType(query) {
  return request({
    url: '/wx/payType/export',
    method: 'get',
    params: query
  })
}

export function allListPayType(query) {
  return request({
    url: '/wx/payType/list',
    method: 'get',
    params: query
  })
}
