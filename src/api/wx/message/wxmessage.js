import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listMessage(query) {
  return request({
    url: '/wx/message/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getMessage(id) {
  return request({
    url: '/wx/message/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addMessage(data) {
  return request({
    url: '/wx/message',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateMessage(data) {
  return request({
    url: '/wx/message',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delMessage(id) {
  return request({
    url: '/wx/message/' + id,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportMessage(query) {
  return request({
    url: '/wx/message/export',
    method: 'get',
    params: query
  })
}