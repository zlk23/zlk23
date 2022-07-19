import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";
import log from "../../views/monitor/job/log";

// 查询微信用户角色
export function listRole(query) {
    return request({
        url: '/wx/role/list',
        method: 'get',
        params: query
    })
}

// 查询微信用户角色详细
export function getRole(roleId) {
    return request({
        url: '/wx/role/' + praseStrEmpty(roleId),
        method: 'get'
    })
}

// 新增微信用户角色
export function addRole(data) {

    return request({
        url: '/wx/role/',
        method: 'post',
        data: data
    })
}

// 修改微信用户角色
export function updateRole(data) {
    return request({
        url: '/wx/role/',
        method: 'put',
        data: data
    })
}

// 删除微信用户角色
export function delRole(roleId) {
    return request({
        url: '/wx/role/' + roleId,
        method: 'delete'
    })
}

// 导出微信用户角色
export function exportRole(query) {
    return request({
        url: '/wx/role/export',
        method: 'get',
        params: query
    })
}

// 查询微信用户权限
export function getWxResources() {
    return request({
        url: '/wx/resource/tree',
        method: 'post',
    })
}

// 查询微信用户权限
export function getWxRoleResources(roleId) {
    console.log(roleId);
    return request({
        url: '/wx/roleResource/tree/' + roleId,
        method: 'get',
    })
}

// 批量更新微信用户权限

// import  qs from 'qs';
export function updateWxRoleResources(data) {
    // import  qs from 'qs';
    var qs = require("qs")
    return request({
        url: '/wx/roleResource/updateWxRoleResources/',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(data)
    })
}
// export function updateWxRoleResources(roleId,resourceIds) {
//   console.log(roleId);
//   console.log(resourceIds)
//   return request({
//     url: '/wx/roleResource/tree/',
//     method: 'post',
//     data:{resourceIds:resourceIds}
//   })
// }