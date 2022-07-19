import request from '@/utils/request'

// 查询商户列表
export function getNoticeList(query) {
  return request({
    url: '/wx/notice/queryNotice',
    method: 'get',
    params: query
  })
}

// 查询商户详细
export function getNoticeDetail(id) {
  return request({
    url: '/wx/notice/selectId?id=' + id,
    method: 'post'
  })
}

// 修改商户
export function updateNotice(data) {
  return request({
    url: '/wx/notice/updateNotice',
    method: 'post',
    data: data
  })
}

// 新增商户
export function addNotice(data) {
  return request({
    url: '/wx/notice/insertNotice',
    method: 'post',
    data: data
  })
}

// 删除商户
export function delNotice(id) {
  return request({
    url: '/wx/notice/deleteNotice?id=' + id,
    method: 'post'
  })
}
