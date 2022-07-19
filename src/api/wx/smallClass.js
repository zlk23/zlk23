import request from '@/utils/request'

// 查询小班列表
export function listSmallClass(query) {
  return request({
    url: '/wx/smallClasses/list',
    method: 'get',
    params: query
  })
}

// 获取小班详情
export function getSmallClass(id) {
  return request({
    url: '/wx/smallClasses/' + id,
    method: 'get',
  })
}

// 新增小班
export function addSmallClass(data) {
  return request({
    url: '/wx/smallClasses',
    method: 'post',
    data: data
  })
}

// 专业批量新增小班
export function batchDddSmallClassByMajorId(data) {
  return request({
    url: '/wx/smallClasses/batchAdd',
    method: 'post',
    data: data
  })
}

// 修改小班
export function updateSmallClass(data) {
  console.log(data)
  return request({
    url: '/wx/smallClasses',
    method: 'put',
    data: data
  })
}

// 删除小班
export function delSmallClass(id) {
  return request({
    url: '/wx/smallClasses/' + id,
    method: 'delete'
  })
}

// 导出小班
export function exportSmallClass(query) {
  return request({
    url: '/wx/smallClasses/export',
    method: 'get',
    params: query
  })
}
