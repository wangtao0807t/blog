import request from "@/untils/request";

//用户登录
export async function loginService(body?: {}, options?: { [key: string]: any }) {
    return request<any>('/login.php', {
        method: 'post',
        data: body,
        ...(options || {}),
    });
}

//注册用户
export async function registerService(body?: {}, options?: { [key: string]: any }) {
    return request<any>('/register.php', {
        method: 'post',
        data: body,
        ...(options || {}),
    });
}
//退出登录
// export async function logOut(body?: {}, options?: { [key: string]: any }) {
//     return request<any>('/logout.php', {
//         method: 'post',
//         data: body,
//         ...(options || {}),
//     });
// }
