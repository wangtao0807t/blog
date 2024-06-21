import {extend} from 'umi-request';
import {message} from "antd";
import {history} from 'umi';

const request = extend({
    prefix: 'http://121.41.108.225',
    timeout: 6000,
    headers: {
        "token": getToken(),
        'Content-Type': 'application/json',
    }
});

function getToken() {
    return localStorage.getItem("token") || ''
}

// 请求拦截器
// request.interceptors.request.use((url, options) => {
//     // 在请求发送之前做一些处理，比如添加 token
//     const token = localStorage.getItem('token');
//     if (token) {
//         const headers = {
//             ...options.headers,
//             token
//         };
//         return {
//             url,
//             options: {...options, headers},
//         };
//     }
//     return {url, options};
// });

// 响应拦截器
request.interceptors.response.use(async (response: any) => {
    // 在接收到响应后做一些处理，比如检查响应状态码
    const data = await response.clone().json();
    if (data.code === 503) {
        message.error('登录已过期，请重新登录');
        localStorage.removeItem('token');
        history.push('/');
        return
    }
    return response;
});
//中间件 对请求前后做处理
request.use(async (ctx, next) => {
    // console.log(ctx.req);
    const {req} = ctx;
    const {options} = req;
    ctx.req.options = {
        ...options,
        foo: 'foo',
        headers: {
            "token": getToken(),
        }
    };
    //next前是对请求前进行处理
    await next();
    //next后是对请求后进行处理
});
export default request;
