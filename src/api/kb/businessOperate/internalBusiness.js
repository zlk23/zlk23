import request from '@/utils/request'

// 查询业务运行-国际化-业务开展列表
export function listGuojihuaYewu(query) {
  return request({
    url: '/ywyx/guoJiHua/list',
    method: 'get',
    params: query
  })
}

// 查询业务运行-国际化-业务开展详细
export function getGuojihuaYewu(id) {
  return request({
    url: '/ywyx/guoJiHua/' + id,
    method: 'get'
  })
}

// 新增业务运行-国际化-业务开展
export function addGuojihuaYewu(data) {
  return request({
    url: '/ywyx/guoJiHua',
    method: 'post',
    data: data
  })
}

// 修改业务运行-国际化-业务开展
export function updateGuojihuaYewu(data) {
  return request({
    url: '/ywyx/guoJiHua',
    method: 'put',
    data: data
  })
}

// 删除业务运行-国际化-业务开展
export function delGuojihuaYewu(id) {
  return request({
    url: '/ywyx/guoJiHua/' + id,
    method: 'delete'
  })
}

// 导出业务运行-国际化-业务开展
export function exportGuojihuaYewu(query) {
  return request({
    url: '/ywyx/guoJiHua/export',
    method: 'get',
    params: query
  })
}
