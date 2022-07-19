import request from '@/utils/request'

// 查询运营总览-学院年度培训量列表
export function listYearAmount(query) {
  return request({
    url: '/yyzl/yearAmount/list',
    method: 'get',
    params: query
  })
}

// 查询运营总览-学院年度培训量详细
export function getYearAmount(id) {
  return request({
    url: '/yyzl/yearAmount/' + id,
    method: 'get'
  })
}

// 新增运营总览-学院年度培训量
export function addYearAmount(data) {
  return request({
    url: '/yyzl/yearAmount',
    method: 'post',
    data: data
  })
}

// 修改运营总览-学院年度培训量
export function updateYearAmount(data) {
  return request({
    url: '/yyzl/yearAmount',
    method: 'put',
    data: data
  })
}

// 删除运营总览-学院年度培训量
export function delYearAmount(id) {
  return request({
    url: '/yyzl/yearAmount/' + id,
    method: 'delete'
  })
}

// 导出运营总览-学院年度培训量
export function exportYearAmount(query) {
  return request({
    url: '/yyzl/yearAmount/export',
    method: 'get',
    params: query
  })
}
