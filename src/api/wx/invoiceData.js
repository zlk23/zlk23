import request from '@/utils/request'

// 查询缴费项目列表
export function listInvoiceData(query) {
  return request({
    url: '/wx/invoiceData/list',
    method: 'get',
    params: query
  })
}

// 查询缴费项目详细
export function getInvoiceData(id) {
  return request({
    url: '/wx/invoiceData/' + id,
    method: 'get'
  })
}

// 新增缴费项目
export function addInvoiceData(data) {
  return request({
    url: '/wx/invoiceData',
    method: 'post',
    data: data
  })
}

// 修改缴费项目
export function updateInvoiceData(data) {
  return request({
    url: '/wx/invoiceData',
    method: 'put',
    data: data
  })
}

// 删除缴费项目
export function delInvoiceData(id) {
  return request({
    url: '/wx/invoiceData/' + id,
    method: 'delete'
  })
}

// 导出缴费项目
export function exportInvoiceData(query) {
  return request({
    url: '/wx/invoiceData/export',
    method: 'get',
    params: query
  })
}

// 导出缴费项目
export function importTemplate() {
  return request({
    url: '/wx/invoiceData/importTemplate',
    method: 'get',
  })
}

//同步
export function refreshTemplate() {
  return request({
    url: '/wx/invoiceData/syncInvoice',
    method: 'get',
  })
}