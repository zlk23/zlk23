import request from '@/utils/request'

// 查询微信交易记录列表
export function listDetail(query) {
  return request({
    url: '/wx/tradeDetail/list',
    method: 'get',
    params: query
  })
}

// 查询实时交易订单列表
export function queryListDetail(query) {
  return request({
    url: '/wx/orders/queryList',
    method: 'get',
    params: query
  })
}

// 查询业务订单详情列表
export function queryClearList(query) {
  return request({
    url: '/wx/orders/queryClearList',
    method: 'post',
    params: query
  })
}

export function queryTotalAmount(queryTime) {
  return request({
    url: '/wx/orders/queryTotalAmount',
    method: 'post',
    params: queryTime
  })
}

// 查询微信交易记录详细
export function getDetail(id) {
  return request({
    url: '/wx/tradeDetail/' + id,
    method: 'get'
  })
}

// 新增微信交易记录
export function addDetail(data) {
  return request({
    url: '/wx/tradeDetail',
    method: 'post',
    data: data
  })
}

// 修改微信交易记录
export function updateDetail(data) {
  return request({
    url: '/wx/tradeDetail',
    method: 'put',
    data: data
  })
}

// 删除微信交易记录
export function delDetail(id) {
  return request({
    url: '/wx/tradeDetail/' + id,
    method: 'delete'
  })
}

// 导出微信交易记录
export function exportDetail(query) {
  return request({
    url: '/wx/tradeDetail/export',
    method: 'get',
    params: query
  })
}
