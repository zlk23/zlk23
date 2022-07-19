import request from '@/utils/request'

// 查询经营收入-本周经营收入列表
export function listWeekTotalAmount(query) {
  return request({
    url: '/jysr/amount/list',
    method: 'get',
    params: query
  })
}

// 查询经营收入-本周经营收入详细
export function getWeekTotalAmount(id) {
  return request({
    url: '/jysr/amount/' + id,
    method: 'get'
  })
}

// 新增经营收入-本周经营收入
export function addWeekTotalAmount(data) {
  return request({
    url: '/jysr/amount',
    method: 'post',
    data: data
  })
}

// 修改经营收入-本周经营收入
export function updateWeekTotalAmount(data) {
  return request({
    url: '/jysr/amount',
    method: 'put',
    data: data
  })
}

// 删除经营收入-本周经营收入
export function delWeekTotalAmount(id) {
  return request({
    url: '/jysr/amount/' + id,
    method: 'delete'
  })
}

// 导出经营收入-本周经营收入
export function exportWeekTotalAmount(query) {
  return request({
    url: '/jysr/amount/export',
    method: 'get',
    params: query
  })
}
