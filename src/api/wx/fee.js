import request from '@/utils/request'

// 查询缴费项目列表
export function listFee(query) {
    return request({
        url: '/wx/fee/list',
        method: 'get',
        params: query
    })
}

// 查询缴费项目详细
export function getFee(id) {
    return request({
        url: '/wx/fee/' + id,
        method: 'get'
    })
}

// 新增缴费项目
export function addFee(data) {
    return request({
        url: '/wx/fee',
        method: 'post',
        data: data
    })
}

// 修改缴费项目
export function updateFee(data) {
    return request({
        url: '/wx/fee',
        method: 'put',
        data: data
    })
}
// 查询发票项目
export function getFPDetail(data) {
    // /wx/orders/queryByOrderDetailId
    return request({
        url: '/wx/orders/queryByOrderDetailId',
        method: 'get',
        params: data
    })
}
// 修改发票项目
export function changeFPDetail(data) {
    // /wx/orders/edit
    var qs = require('qs')
    return request({
        url: '/wx/orders/edit',
        method: 'post',
        data: qs.stringify(data),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
}
// /wx/orders/edit
// 删除缴费项目
export function delFee(id) {
    return request({
        url: '/wx/fee/' + id,
        method: 'delete'
    })
}

// 导出缴费项目
export function exportFee(query) {
    return request({
        url: '/wx/fee/export',
        method: 'get',
        params: query
    })
}

// 缴费商户
export function getAllMerchant() {
    return request({
        url: '/wx/merchant/AList',
        method: 'get',
    })
}
