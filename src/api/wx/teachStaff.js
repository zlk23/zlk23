import request from '@/utils/request'

// 查询教职工列表
export function listStaff(query) {
  return request({
    url: '/wx/staff/list',
    method: 'get',
    params: query
  })
}

// 查询教职工详细
export function getStaff(id) {
  return request({
    url: '/wx/staff/' + id,
    method: 'get'
  })
}

// 新增教职工
export function addStaff(data) {
  return request({
    url: '/wx/staff',
    method: 'post',
    data: data
  })
}

// 修改教职工
export function updateStaff(data) {
  return request({
    url: '/wx/staff',
    method: 'put',
    data: data
  })
}

// 删除教职工
export function delStaff(id) {
  return request({
    url: '/wx/staff/' + id,
    method: 'delete'
  })
}

// 导出教职工
export function exportStaff(query) {
  return request({
    url: '/wx/staff/export',
    method: 'get',
    params: query
  })
}