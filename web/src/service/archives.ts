import request from '../untils/request';

//获取文章列表
export async function getArchives(params?: {}, options?: { [key: string]: any }) {
    return request<any>('/archives.php', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

//上传
export async function uploadImage(body?: {}, options?: { [key: string]: any }) {
    return request<any>('/upload.php', {
        method: 'post',
        data: body,
        ...(options || {}),
    });
}

//新增
export async function addArchives(body?: {}, options?: { [key: string]: any }) {
    return request<any>('/archives.php', {
        method: 'post',
        data: body,
        ...(options || {}),
    });
}

//删除
export async function deleteArchives(body?: {}, options?: { [key: string]: any }) {
    return request<any>('/archives.php', {
        method: 'post',
        data: body,
        ...(options || {}),
    });
}

//批量删除
export async function batchDeleteArchives(body?: {}, options?: { [key: string]: any }) {
    return request<any>('/archives.php', {
        method: 'post',
        data: body,
        ...(options || {}),
    });
}

//修改
export async function updateArchives(body?: {}, options?: { [key: string]: any }) {
    return request<any>('/archives.php', {
        method: 'post',
        data: body,
        ...(options || {}),
    });
}
