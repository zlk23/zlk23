import request from '@/utils/request'

// 查询订单详情列表
export function listDetail(query) {
  return request({
    url: '/wx/orders/list',
    method: 'get',
    params: query
  })
}

//修改订单信息
export function updateOrderDetail(data) {
  return request({
    url: '/wx/orders/updateOrderDetail',
    method: 'put',
    data: data
  })
}

// 查询实时交易订单列表
export function getZfzxPayResultByOrderId(orderId) {
  return request({
    url: '/zfzx/orders/getZfzxPayResult/'+orderId,
    method: 'get',
  })
}


// 查询实时交易订单列表
export function getGdPayResultByOrderId(orderId) {
  return request({
    url: '/weChat/orders/getGdPayResultByOrderId/'+orderId,
    method: 'get',
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

// 查询订单详情详细
export function getDetail(id) {
  return request({
    url: '/wx/orders/' + id,
    method: 'get'
  })
}

// 新增订单详情
export function addDetail(data) {
  return request({
    url: '/wx/orders',
    method: 'post',
    data: data
  })
}

// 修改订单详情
export function updateDetail(data) {
  return request({
    url: '/wx/orders',
    method: 'put',
    data: data
  })
}

// 删除订单详情
export function delDetail(id) {
  return request({
    url: '/wx/orders/' + id,
    method: 'delete'
  })
}

// 导出订单详情
export function exportDetail(ids) {
  return request({
    url: '/wx/orders/export/'+ids,
    method: 'get',
    responseType: 'blob'
  })
}

// 业务订单ERP汇总数据
export function querySummaryList(query) {
  return request({
    url: '/wx/erp/getErpList',
    method: 'post',
    params: query
   })
}

//业务订单ERP详细数据
export function querySummaryDetailList(id) {
  return request({
    url: '/wx/erp/getErpOrderDetailList/'+id,
    method: 'get',
  })
}

//业务订单ERP推送数据
export function push(ids) {
   return request({
     url: '/wx/erp/pushErp/'+ids,
     method: 'get',
   })
}

// 业务订单批量开票数据
export function getInvoice(data) {
  // console.log(ids);
  return request({
    url: '/wx/MakeInvoice/list',
    method: 'get',
    // timeout: 1000000,
    params: data
  })
}

// 业务订单批量开票
export function batchMakeInvoice(ids) {
  console.log(ids);
  return request({
    url: '/wx/MakeInvoice/batchMakeInvoice/' + ids,
    method: 'get',
  })
}

// 业务订单批量开票
export function pushErpInvoice() {
  return request({
    url: '/wx/erpInvoice/pushErpInvoice/',
    method: 'get',
  })
}

//  业务订单快递数据
export function expressagePushList(data) {
  return request({
    url: '/expressagePush/list',
    method: 'get',
    params: data
  })
}

// 批量打印快递
export function expressageBatchPrint(ids) {
  return request({
    url: '/expressage/batchPush/' + ids,
    method: 'post',
  })
}

//获取快递助手地址
export function getMallUrl() {
  return request({
    url: '/expressage/getMallUrl',
    method: 'get',
  })
}

//获取快递信息详情
export function getExpressagePush(id) {
  return request({
    url: '/expressagePush/' + id,
    method: 'get',
  })
}

//修改快递信息
export function updateExpressagePush(data) {
  return request({
    url: '/expressagePush/',
    method: 'put',
    data: data
  })
}

//批量删除快递信息
export function batchDeleteExperssPush(ids) {
  return request({
    url: '/expressagePush/' + ids,
    method: 'delete',
  })
}

//删除快递信息
export function deleteExperssPush(id) {
  return request({
    url: '/expressagePush/delete/' + id,
    method: 'delete',
  })
}

export function reopen(id) {
  return request({
    url: '/wx/MakeInvoice/reopen/' + id,
    method: 'post',
  })
}

export function expressReopen(id) {
  return request({
    url: '/expressagePush/reopen/' + id,
    method: 'post',
  })
}

//同步快递数据到快递助手平台
export function testTradeUpdate(id) {
  return request({
    url: '/expressage/testTradeUpdate/' + id,
    method: 'put',
  })
}

// 查询异常订单列表
export function listOrder(query) {
  return request({
    url: '/wx/orders/abnormalOrderList',
    method: 'get',
    params: query
  })
}

// 修改异常订单
export function updateOrder(id) {
  return request({
    url: '/weChat/orders/abnormalOrderUpdate/'+id,
    method: 'get',
  })
}

// 发票凭证
export function erpInvoice(query) {
  return request({
    url: '/wx/erpInvoice/list',
    method: 'get',
    params: query
  })
}

// 发票凭证详细
export function erpClassInvoice(query) {
  return request({
    url: '/wx/erpClassInvoice/list',
    method: 'get',
    params: query
  })
}

//发票凭证预览
export function erpInvoiceerpInvoicePreview() {
  return request({
    url: '/wx/erpInvoice/erpInvoicePreview',
    method: 'get',
  })
}

