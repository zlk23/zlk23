import request from '@/utils/request'

// 查询工单详情列表
export function listWorkOrderDetail(query) {
  return request({
    url: '/workOrder/workOrderDetail/list',
    method: 'get',
    params: query
  })
}

// 查询工单详情详细
export function getWorkOrderDetail(id) {
  return request({
    url: '/workOrder/workOrderDetail/' + id,
    method: 'get'
  })
}

// 新增工单详情
export function addWorkOrderDetail(data) {
  return request({
    url: '/workOrder/workOrderDetail',
    method: 'post',
    data: data
  })
}

// 修改工单详情
export function updateWorkOrderDetail(data) {
  return request({
    url: '/workOrder/workOrderDetail',
    method: 'put',
    data: data
  })
}

// 删除工单详情
export function delWorkOrderDetail(id) {
  return request({
    url: '/workOrder/workOrderDetail/' + id,
    method: 'delete'
  })
}

// 导出工单详情
export function exportWorkOrderDetail(query) {
  return request({
    url: '/workOrder/workOrderDetail/export',
    method: 'get',
    params: query
  })
}
