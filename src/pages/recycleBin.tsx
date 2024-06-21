import Body from '../component/body'
import {createStyles} from "antd-style";
import {Row, Col, Button, Space, Dropdown, Popconfirm, message, Form} from "antd"
import {ProTable, PageContainer, ProForm, ProFormText, ProFormSelect} from "@ant-design/pro-components";
import React, {useRef, useState} from "react";
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {getRecycleBin, restoreRecycleBin, deleteRecycleBin, batchRestoreRecycleBin} from "@/service/recycelBin";
import {history} from "@@/core/history";

const bodyStyle = createStyles((): any => {
    return {
        proTableStyle: {
            width: "100%",
            marginTop: "10px"
        },

    }
})
type tableItem = {
    url: string;
    id: number;
    number: number;
    title: string;
    labels: {
        name: string;
        color: string;
    }[];
    state: string;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at?: string;
};

export default () => {
    const {styles: {proTableStyle}} = bodyStyle()
    const actionRef = useRef<ActionType>();
    const [form] = Form.useForm();
    //多选
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    //加载
    const [loading, setLoading] = useState(false)

    //表格列数据
    const columns: ProColumns<tableItem>[] = [
        {
            title: '文章名称',
            dataIndex: 'title',
            copyable: true,
            ellipsis: true,
            tooltip: '描述过长会自动收缩'
        },
        {
            title: '作者',
            dataIndex: 'author',
            ellipsis: true,
            sorter: true,
            hideInSearch: true,
        },
        {
            disable: true,
            title: '文章类型',
            dataIndex: 'type',
            filters: true,
            onFilter: true,
            ellipsis: true,
            valueEnum: {
                "daily": {
                    text: '日常',
                },
                "life": {
                    text: '生活',
                },
                "interest": {
                    text: '兴趣',
                },
                "study": {
                    text: '学习',
                }
            },
        },
        {
            title: '发布时间',
            key: 'showTime',
            dataIndex: 'create_time',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <Dropdown menu={{
                    items: [
                        {
                            label: <a style={{color: "black"}} onClick={() => {
                                // form.setFieldsValue(record)
                                restoreRecycleBin({action: "restore", id: record?.id}).then((res) => {
                                    console.log(res)
                                    if (res.code == 200) {
                                        message.success("恢复成功")
                                        actionRef.current?.reload();
                                    } else {
                                        message.error("恢复失败")
                                    }
                                })
                            }}>恢复</a>,
                            key: 0,
                        },
                        {
                            label:
                                <Popconfirm
                                    title="确认要删除吗？"
                                    description="删除之后将不可恢复"
                                    okText="确认"
                                    cancelText="取消"
                                    onConfirm={() => {
                                        deleteRecycleBin({action: "delete", id: record?.id}).then((res) => {
                                            if (res.code == 200) {
                                                message.success("删除成功")
                                                actionRef.current?.reload();
                                            } else {
                                                message.success("删除失败")
                                            }
                                        })
                                    }}
                                >
                                    <a style={{color: "black"}}>永久删除</a>
                                </Popconfirm>,
                            key: 1,
                        },
                    ]
                }} trigger={['click']} key="editable">
                    <a
                        onClick={(e) => e.preventDefault()}>
                        操作
                    </a>
                </Dropdown>
            ],
        },
    ];
    return (
        <PageContainer>
            <Body loading={loading}>
                <Row>
                    <Col span={22} offset={1}>
                        <Row>
                            <Col>
                                <h2>回收站</h2>
                                <ProTable<tableItem>
                                    rowSelection={{
                                        selectedRowKeys,
                                        // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
                                        onChange: (selectedRows: any) => {
                                            setSelectedRowKeys(selectedRows)
                                        },
                                    }}
                                    tableAlertRender={({
                                                           selectedRowKeys,
                                                           selectedRows,
                                                           onCleanSelected,
                                                       }) => {
                                        return (
                                            <Space size={24}>
                                            <span>
                                                已选 {selectedRowKeys.length} 项
                                                <a style={{marginInlineStart: 8}} onClick={onCleanSelected}>
                                                    取消选择
                                                </a>
                                            </span>
                                            </Space>
                                        )
                                    }}
                                    tableAlertOptionRender={(selectedRowKeys) => {
                                        return (
                                            <Space size={16}>
                                                <Button type={"link"} onClick={async () => {
                                                    batchRestoreRecycleBin({
                                                        action: "batchRestore",
                                                        ids: selectedRowKeys?.selectedRowKeys
                                                    })
                                                        .then((res) => {
                                                            if (res?.code === 200) {
                                                                message.success("恢复成功")
                                                                actionRef.current?.reload();
                                                            }
                                                        })
                                                }}>批量恢复</Button>
                                            </Space>
                                        );
                                    }}
                                    className={proTableStyle}
                                    columns={columns}
                                    actionRef={actionRef}
                                    cardBordered
                                    request={async (params, sort, filter) => {
                                        const res = await getRecycleBin({...params})
                                        return Promise.resolve({
                                            data: res?.data,
                                            success: true,
                                        });
                                    }}
                                    rowKey="id"
                                    search={{
                                        labelWidth: 'auto',
                                    }}
                                    options={{
                                        setting: {
                                            listsHeight: 400,
                                        },
                                    }}
                                    pagination={{
                                        pageSize: 20,
                                        // onChange: (page) => console.log(page),
                                    }}
                                    dateFormatter="string"
                                    headerTitle={<h4>文章列表</h4>}
                                    toolBarRender={() => [
                                        <>
                                            <Button
                                                key="goback"
                                                onClick={() => {
                                                    history.push("/archives")
                                                }}
                                                type="primary"
                                            >
                                                返回
                                            </Button>
                                        </>]}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Body>
        </PageContainer>
    )
}
