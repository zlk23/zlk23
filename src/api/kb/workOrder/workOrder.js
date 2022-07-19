import request from '@/utils/request'

// 查询工单列表
export function listWorkOrder(query) {
  return request({
    url: '/workOrder/workOrder/list',
    method: 'get',
    params: query
  })
}

// 查询工单详细
export function getWorkOrder(id) {
  return request({
    url: '/workOrder/workOrder/' + id,
    method: 'get'
  })
}

// 新增工单
export function addWorkOrder(data) {
  return request({
    url: '/workOrder/workOrder',
    method: 'post',
    data: data
  })
}

// 修改工单
export function updateWorkOrder(data) {
  return request({
    url: '/workOrder/workOrder',
    method: 'put',
    data: data
  })
}

// 删除工单
export function delWorkOrder(id) {
  return request({
    url: '/workOrder/workOrder/' + id,
    method: 'delete'
  })
}

// 导出工单
export function exportWorkOrder(query) {
  return request({
    url: '/workOrder/workOrder/export',
    method: 'get',
    params: query
  })
}
