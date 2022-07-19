import request from '@/utils/request'

// 查询经营收入-上周数据-本周计划列表
export function listJiHua(query) {
  return request({
    url: '/jysr/jihua/list',
    method: 'get',
    params: query
  })
}

// 查询经营收入-上周数据-本周计划详细
export function getJiHua(id) {
  return request({
    url: '/jysr/jihua/' + id,
    method: 'get'
  })
}

// 新增经营收入-上周数据-本周计划
export function addJiHua(data) {
  return request({
    url: '/jysr/jihua',
    method: 'post',
    data: data
  })
}

// 修改经营收入-上周数据-本周计划
export function updateJiHua(data) {
  return request({
    url: '/jysr/jihua',
    method: 'put',
    data: data
  })
}

// 删除经营收入-上周数据-本周计划
export function delJiHua(id) {
  return request({
    url: '/jysr/jihua/' + id,
    method: 'delete'
  })
}

// 导出经营收入-上周数据-本周计划
export function exportJiHua(query) {
  return request({
    url: '/jysr/jihua/export',
    method: 'get',
    params: query
  })
}
