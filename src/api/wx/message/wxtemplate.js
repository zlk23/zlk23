import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listTemplate(query) {
  return request({
    url: '/wx/template/list',
    method: 'get',
    params: query
  })
}
// 查询【请填写功能名称】列表
export function listTemplatetest(query) {
  return request({
    url: '/wechat/slectricDesigned/synchronousCourse',
    method: 'get',
    params: query
  })
}
// 查询【请填写功能名称】详细
export function getTemplate(id) {
  return request({
    url: '/wx/template/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addTemplate(data) {
  return request({
    url: '/wx/template',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateTemplate(data) {
  return request({
    url: '/wx/template',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delTemplate(id) {
  return request({
    url: '/wx/template/' + id,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportTemplate(query) {
  return request({
    url: '/wx/template/export',
    method: 'get',
    params: query
  })
}