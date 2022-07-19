import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listPerson(query) {
  return request({
    url: '/wx/person/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getPerson(id) {
  return request({
    url: '/wx/person/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addPerson(data) {
  return request({
    url: '/wx/person',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updatePerson(data) {
  return request({
    url: '/wx/person',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delPerson(id) {
  return request({
    url: '/wx/person/' + id,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportPerson(query) {
  return request({
    url: '/wx/person/export',
    method: 'get',
    params: query
  })
}