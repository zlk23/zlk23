import request from '@/utils/request'

// 查询商户列表
export function getMerchantList(query) {
  return request({
    url: '/wx//merchant/list',
    method: 'get',
    params: query
  })
}

// 查询商户详细
export function getMerchantDetail(id) {
  return request({
    url: '/wx/merchant/' + id,
    method: 'get'
  })
}

// 修改商户
export function updateMerchant(data) {
  return request({
    url: '/wx//merchant',
    method: 'put',
    data: data
  })
}

// 新增商户
export function addMerchant(data) {
  return request({
    url: '/wx//merchant',
    method: 'post',
    data: data
  })
}

// 删除商户
export function delMerchant(ids) {
  return request({
    url: '/wx/merchant/' + ids,
    method: 'delete'
  })
}

//导出商户
export function exportMerchant(query) {
  return request({
    url: '/wx/merchant/export',
    method: 'get',
    params: query
  })
}
