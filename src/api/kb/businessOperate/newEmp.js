import request from '@/utils/request'

// 查询业务运行-新员工培训和职业教育列表
export function listXygZyjy(query) {
  return request({
    url: '/ywyx/xygZyjy/list',
    method: 'get',
    params: query
  })
}

// 查询业务运行-新员工培训和职业教育详细
export function getXygZyjy(id) {
  return request({
    url: '/ywyx/xygZyjy/' + id,
    method: 'get'
  })
}

// 新增业务运行-新员工培训和职业教育
export function addXygZyjy(data) {
  return request({
    url: '/ywyx/xygZyjy',
    method: 'post',
    data: data
  })
}

// 修改业务运行-新员工培训和职业教育
export function updateXygZyjy(data) {
  return request({
    url: '/ywyx/xygZyjy',
    method: 'put',
    data: data
  })
}

// 删除业务运行-新员工培训和职业教育
export function delXygZyjy(id) {
  return request({
    url: '/ywyx/xygZyjy/' + id,
    method: 'delete'
  })
}

// 导出业务运行-新员工培训和职业教育
export function exportXygZyjy(query) {
  return request({
    url: '/ywyx/xygZyjy/export',
    method: 'get',
    params: query
  })
}
