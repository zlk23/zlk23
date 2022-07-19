import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listTemplate(query) {
  return request({
    url: '/wx/msg/list',
    method: 'get',
    params: query
  })
}
// 查询【请填写功能名称】详细
export function getTemplate(id) {
  return request({
    url: '/wx/msg/' + id,
    method: 'get'
  })
}

// 删除【请填写功能名称】
export function delTemplate(id) {
    return request({
      url: '/wx/msg/' + id,
      method: 'delete'
    })
  }
// 新增【请填写功能名称】
export function addTemplate(data) {
  return request({
    url: '/wx/msg/add',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateTemplate(data) {
  return request({
    url: '/wx/msg',
    method: 'put',
    data: data
  })
}


//克隆
export function cloneTemplate(query) {
    return request({
      url: '/wx/msg/copy',
      method: 'post',
      params: query
    })
  }

//发布
export function releaseTemplate(query) {
    return request({
      url: '/wx/msg/issue',
      method: 'post',
      params:query
    })
  }

//合并发布
export function allReleaseTemplate(query) {
  return request({
    url: '/wx/msg/mergeIssue',
    method: 'post',
    data:query
  })
}
// 同步【moodle课程】列表
export function refreshTemplate() {
  return request({
    url: '/wechat/slectricDesigned/synchronousCourse',
    method: 'get',
  })
}