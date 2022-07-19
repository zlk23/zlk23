import request from '@/utils/request'

// 查询业务运行-职业教育列表
export function listZyjy(query) {
  return request({
    url: '/ywyx/zyjy/list',
    method: 'get',
    params: query
  })
}

// 查询业务运行-职业教育详细
export function getZyjy(id) {
  return request({
    url: '/ywyx/zyjy/' + id,
    method: 'get'
  })
}

// 新增业务运行-职业教育
export function addZyjy(data) {
  return request({
    url: '/ywyx/zyjy',
    method: 'post',
    data: data
  })
}

// 修改业务运行-职业教育
export function updateZyjy(data) {
  return request({
    url: '/ywyx/zyjy',
    method: 'put',
    data: data
  })
}

// 删除业务运行-职业教育
export function delZyjy(id) {
  return request({
    url: '/ywyx/zyjy/' + id,
    method: 'delete'
  })
}

// 导出业务运行-职业教育
export function exportZyjy(query) {
  return request({
    url: '/ywyx/zyjy/export',
    method: 'get',
    params: query
  })
}
