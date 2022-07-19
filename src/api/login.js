import request from '@/utils/request'
import { decrypt } from '@/api/system/user.js'

// 登录方法
export function login(username, password, code, uuid) {
    const data = {
        username,
        password,
        code,
        uuid
    }
    console.log(data);
    return request({
        url: '/login',
        method: 'post',
        data: data
    })
}
// 获取用户详细信息
export function getInfo() {
    return request({
        url: '/getInfo',
        method: 'get'
    })
}

// 退出方法
export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    })
}
// 获取公钥
export function getRsa() {
    return request({
        url: '/web/home/getPublicKey',
        method: 'get'
    })
}
// 获取验证码
export function getCodeImg() {
    return request({
        url: '/captchaImage',
        method: 'get'
    })
}