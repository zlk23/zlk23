import request from '@/utils/request'

// 查询商户列表
export function getShufflingList(query) {
  return request({
    url: '/wx/shuffling/queryShuffling',
    method: 'get',
    params: query
  })
}

// 查询商户详细
export function getShufflingDetail(id) {
  return request({
    url: '/wx/shuffling/selectId?id=' + id,
    method: 'post',
    // data: {}
  })
}

// 新增商户
export function addShuffling(data) {
  return request({
    url: '/wx/shuffling/insertShuffling',
    method: 'post',
    data: data,
    // body: formData
  })
}

// 修改商户
export function updateShuffling(data) {
  return request({
    url: '/wx/shuffling/updateShuffling',
    method: 'post',
    data: data
  })
}


// 删除商户
export function delShuffling(ids) {
  return request({
    url: '/wx/shuffling/deleteShuffling?id=' + ids,
    method: 'post'
  })
}
