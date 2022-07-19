import request from '@/utils/request'

// 查询经营收入-计划委托列表
export function listJihuaWeituo(query) {
  return request({
    url: '/jysr/weituo/list',
    method: 'get',
    params: query
  })
}

// 查询经营收入-计划委托详细
export function getJihuaWeituo(id) {
  return request({
    url: '/jysr/weituo/' + id,
    method: 'get'
  })
}

// 新增经营收入-计划委托
export function addJihuaWeituo(data) {
  return request({
    url: '/jysr/weituo',
    method: 'post',
    data: data
  })
}

// 修改经营收入-计划委托
export function updateJihuaWeituo(data) {
  return request({
    url: '/jysr/weituo',
    method: 'put',
    data: data
  })
}

// 删除经营收入-计划委托
export function delJihuaWeituo(id) {
  return request({
    url: '/jysr/weituo/' + id,
    method: 'delete'
  })
}

// 导出经营收入-计划委托
export function exportJihuaWeituo(query) {
  return request({
    url: '/jysr/weituo/export',
    method: 'get',
    params: query
  })
}
