import request from '@/utils/request'

// 查询运营总览-本周数据一览列表
export function listDataThisWeek(query) {
  return request({
    url: '/yyzl/yywd/list',
    method: 'get',
    params: query
  })
}

// 查询运营总览-本周数据一览详细
export function getDataThisWeek(id) {
  return request({
    url: '/yyzl/yywd/' + id,
    method: 'get'
  })
}

// 新增运营总览-本周数据一览
export function addDataThisWeek(data) {
  return request({
    url: '/yyzl/yywd',
    method: 'post',
    data: data
  })
}

// 修改运营总览-本周数据一览
export function updateDataThisWeek(data) {
  return request({
    url: '/yyzl/yywd',
    method: 'put',
    data: data
  })
}

// 删除运营总览-本周数据一览
export function delDataThisWeek(id) {
  return request({
    url: '/yyzl/yywd/' + id,
    method: 'delete'
  })
}

// 导出运营总览-本周数据一览
export function exportDataThisWeek(query) {
  return request({
    url: '/yyzl/yywd/export',
    method: 'get',
    params: query
  })
}
