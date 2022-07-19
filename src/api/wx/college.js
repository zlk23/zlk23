import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询学校列表
export function listCollege(query) {
  return request({
    url: '/wx/college/list',
    method: 'get',
    params: query
  })
}

// 查询学校详细
export function getCollege(collegeId) {
  return request({
    url: '/wx/college/' + praseStrEmpty(collegeId),
    method: 'get'
  })
}

// 新增学校
export function addCollege(data) {
  return request({
    url: '/wx/college/',
    method: 'post',
    data: data
  })
}

// 修改学校
export function updateCollege(data) {
  return request({
    url: '/wx/college/',
    method: 'put',
    data: data
  })
}

// 删除学校
export function delCollege(collegeId) {
  return request({
    url: '/wx/college/' + collegeId,
    method: 'delete'
  })
}

// 导出学校
export function exportCollege(query) {
  return request({
    url: '/wx/college/export',
    method: 'get',
    params: query
  })
}

// 学校状态修改
export function changeCollegeStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/wx/college/changeStatus',
    method: 'put',
    data: data
  })
}

// 学校logo上传
export function uploadAvatar(data) {
  return request({
    url: '/wx/college/profile/avatar',
    method: 'post',
    data: data
  })
}
