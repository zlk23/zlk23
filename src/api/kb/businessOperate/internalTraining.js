import request from '@/utils/request'

// 查询业务运行-国际化培训列表
export function listGuojiPeixun(query) {
  return request({
    url: '/ywyx/guoJiPeiXun/list',
    method: 'get',
    params: query
  })
}

// 查询业务运行-国际化培训详细
export function getGuojiPeixun(id) {
  return request({
    url: '/ywyx/guoJiPeiXun/' + id,
    method: 'get'
  })
}

// 新增业务运行-国际化培训
export function addGuojiPeixun(data) {
  return request({
    url: '/ywyx/guoJiPeiXun',
    method: 'post',
    data: data
  })
}

// 修改业务运行-国际化培训
export function updateGuojiPeixun(data) {
  return request({
    url: '/ywyx/guoJiPeiXun',
    method: 'put',
    data: data
  })
}

// 删除业务运行-国际化培训
export function delGuojiPeixun(id) {
  return request({
    url: '/ywyx/guoJiPeiXun/' + id,
    method: 'delete'
  })
}

// 导出业务运行-国际化培训
export function exportGuojiPeixun(query) {
  return request({
    url: '/ywyx/guoJiPeiXun/export',
    method: 'get',
    params: query
  })
}
