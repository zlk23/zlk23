import request from '@/utils/request'

// 查询业务运行-职业教育各院系人数列表
export function listZyjyFaculty(query) {
  return request({
    url: '/ywyx/zyjyFaculty/list',
    method: 'get',
    params: query
  })
}

// 查询业务运行-职业教育各院系人数详细
export function getZyjyFaculty(id) {
  return request({
    url: '/ywyx/zyjyFaculty/' + id,
    method: 'get'
  })
}

// 新增业务运行-职业教育各院系人数
export function addZyjyFaculty(data) {
  return request({
    url: '/ywyx/zyjyFaculty',
    method: 'post',
    data: data
  })
}

// 修改业务运行-职业教育各院系人数
export function updateZyjyFaculty(data) {
  return request({
    url: '/ywyx/zyjyFaculty',
    method: 'put',
    data: data
  })
}

// 删除业务运行-职业教育各院系人数
export function delZyjyFaculty(id) {
  return request({
    url: '/ywyx/zyjyFaculty/' + id,
    method: 'delete'
  })
}

// 导出业务运行-职业教育各院系人数
export function exportZyjyFaculty(query) {
  return request({
    url: '/ywyx/zyjyFaculty/export',
    method: 'get',
    params: query
  })
}
