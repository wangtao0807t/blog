import request from '../untils/request';

//获取回收站列表
export async function getRecycleBin(params?: {}, options?: { [key: string]: any }) {
    return request<any>('/recycleBin.php', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

//永久删除
export async function deleteRecycleBin(body?: {}, options?: { [key: string]: any }) {
    return request<any>('/recycleBin.php', {
        method: 'post',
        data: body,
        ...(options || {}),
    });
}

//恢复
export async function restoreRecycleBin(body?: {}, options?: { [key: string]: any }) {
    return request<any>('/recycleBin.php', {
        method: 'post',
        data: body,
        ...(options || {}),
    });
}

//批量恢复
export async function batchRestoreRecycleBin(body?: {}, options?: { [key: string]: any }) {
    return request<any>('/recycleBin.php', {
        method: 'post',
        data: body,
        ...(options || {}),
    });
}
