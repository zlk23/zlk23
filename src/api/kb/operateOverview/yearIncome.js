import request from '@/utils/request'

// 查询运营总览_全年经营收入列表
export function listYearIncome(query) {
  return request({
    url: '/yyzl/yearIncome/list',
    method: 'get',
    params: query
  })
}

// 查询运营总览_全年经营收入详细
export function getYearIncome(id) {
  return request({
    url: '/yyzl/yearIncome/' + id,
    method: 'get'
  })
}

// 新增运营总览_全年经营收入
export function addYearIncome(data) {
  return request({
    url: '/yyzl/yearIncome',
    method: 'post',
    data: data
  })
}

// 修改运营总览_全年经营收入
export function updateYearIncome(data) {
  return request({
    url: '/yyzl/yearIncome',
    method: 'put',
    data: data
  })
}

// 删除运营总览_全年经营收入
export function delYearIncome(id) {
  return request({
    url: '/yyzl/yearIncome/' + id,
    method: 'delete'
  })
}

// 导出运营总览_全年经营收入
export function exportYearIncome(query) {
  return request({
    url: '/yyzl/yearIncome/export',
    method: 'get',
    params: query
  })
}
