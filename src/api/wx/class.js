import request from '@/utils/request'

// 查询短期培训班列表
export function listClass(query) {
    return request({
        url: '/wx/class/list',
        method: 'get',
        params: query
    })
}
// 获取教师班次
export function teacherClass(query) {
    return request({
        url: '/wx/staff/teacher',
        method: 'get',
        params: query
    })
}

// 查询短期培训班详细
export function getClass(id) {
    return request({
        url: '/wx/class/' + id,
        method: 'get'
    })
}

// 获取班级学生报名详情
export function getStudentById(query) {
    return request({
        url: '/wx/apply/list' ,
        method: 'get',
        params: query
    })
}

// 修改班级学生报名信息
export function updateStudentInfo(data) {
  return request({
    url: '/wx/apply' ,
    method: 'put',
    data: data
  })
}

// 修改班级学生报名信息
export function cancelApply(id) {
  return request({
    url: '/wx/apply/del/' + id ,
    method: 'delete',
  })
}

// 获取学生报名信息详情
export function getStudentInfo(id) {
  return request({
    url: '/wx/apply/' + id ,
    method: 'get',
  })
}

// 导出班级学生报名详情
export function getStudentExportById(shortClassId) {
  console.log(shortClassId)
  return request({
    url: '/wx/apply/export/'+shortClassId ,
    method: 'get',
    responseType: 'blob'
  })
}

// 导出班级学生报名详情
export function getStudentExport2ById(shortClassId) {
  console.log(shortClassId)
  return request({
    url: '/wx/apply/export2' ,
    method: 'get',
    timeout: 600000,
    params: { shortClassId: shortClassId },
    // responseType: 'blob'
  })
}

/*export function getSmallClassListByClassId(classId) {
  return request({
    url: '/wx/smallClasses/listByClassId',
    method: 'post',
    p
  })
}*/

//文件上传
export function uploadFile(data) {
    return request({
        url: '/wx/class/uploadClassPic',
        method: 'post',
        headers: { 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq' },
        data: data
    })
}
// 新增短期培训班
export function addClass(data) {
    return request({
        url: '/wx/class',
        method: 'post',
        data: data
    })
}

// 修改短期培训班
export function updateClass(data) {
  console.log(data)
    return request({
        url: '/wx/class',
        method: 'put',
        data: data
    })
}

// 删除短期培训班
export function delClass(id) {
    return request({
        url: '/wx/class/' + id,
        method: 'delete'
    })
}

// 导出短期培训班
export function exportClass(query) {
    return request({
        url: '/wx/class/export',
        method: 'get',
        params: query
    })
}
// 上传图片
export function uploadImg(data) {
    console.log(data)
    var qs = require('qs');
    return request({
        url: '/wx/imgUpload',
        method: 'post',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data)
    })
}
//查询班次报名
export function getClassSign() {
    return request({
        url: '/wx/staff/teacher',
        method: 'get',
    })
}

//查询所有班主任
export function teachStaffList() {
  return request({
    url: '/wx/staff/teachStaffList',
    method: 'get',
  })
}
//查询班次报名缴费总金额
export function queryClassTotalAmount(shortClassId) {
  return request({
    url: '/weChat/orders/queryTotalAmount/'+shortClassId,
    method: 'get'
  })
}

//获取小班数据
export function getSmallClass(classId) {
  return request({
    url: '/wx/smallClasses/listByClassId',
    method: 'post',
    params: {classId:classId}
  })
}


//获取小班数据
export function getAllClassList() {
  return request({
    url: '/wx/class/allClassList',
    method: 'get',
  })
}

export function saleClass(id) {
  return request({
    url: "/wx/class/saleClass",
    method: "post",
    params: {id: id}
  })
}

