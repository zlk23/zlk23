import request from '@/utils/request'

// 发票作废
export function fpzf(id) {
    return request({
        url: '/wx/MakeInvoice/voidInvoice/'+id,
        method: 'get',
    })
}

// 修改发票状态
export function updateInvoiceState(id,state) {
  const data = {id, state}
  const url1= (state && 7!=state) ?'/wx/MakeInvoice/updateInvoiceState':'/wx/MakeInvoice/updateInvoiceStateCancel'
  //console.log(state,url1)
  return request({
    url: url1,
    method: 'post',
    params: data
  })
}

// 废票率查询

export function getVoidInvoiceRateList(query) {
  return request({
    url: '/wx/MakeInvoice/voidInvoicesRate',
    method: 'post',
    params: query
  })

}

// 导出发票数据
export function exportInvote(query) {
  return request({
    url: '/wx/MakeInvoice/export',
    method: 'get',
    params: query
  })

}

// 下载模版

export function importTemplate(query) {
  return request({
      url: '',
      method: 'get'
  })

}