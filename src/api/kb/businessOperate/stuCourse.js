import request from '@/utils/request'

// 查询业务运行-职业教育课程列表
export function listZyjyCourse(query) {
  return request({
    url: '/ywyx/zyjyCourse/list',
    method: 'get',
    params: query
  })
}

// 查询业务运行-职业教育课程详细
export function getZyjyCourse(id) {
  return request({
    url: '/ywyx/zyjyCourse/' + id,
    method: 'get'
  })
}

// 新增业务运行-职业教育课程
export function addZyjyCourse(data) {
  return request({
    url: '/ywyx/zyjyCourse',
    method: 'post',
    data: data
  })
}

// 修改业务运行-职业教育课程
export function updateZyjyCourse(data) {
  return request({
    url: '/ywyx/zyjyCourse',
    method: 'put',
    data: data
  })
}

// 删除业务运行-职业教育课程
export function delZyjyCourse(id) {
  return request({
    url: '/ywyx/zyjyCourse/' + id,
    method: 'delete'
  })
}

// 导出业务运行-职业教育课程
export function exportZyjyCourse(query) {
  return request({
    url: '/ywyx/zyjyCourse/export',
    method: 'get',
    params: query
  })
}
