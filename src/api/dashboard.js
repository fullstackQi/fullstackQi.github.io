import request from '@/utils/request'

export function getTwManager(data) {
    return request({
        url: '/vue-element-admin/user/login',
        method: 'post',
        data
    })
}
