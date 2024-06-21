import Body from '../component/body'
import {createStyles} from "antd-style";
import {Row, Col, Button, Space, Table, Dropdown, Popconfirm, message, Form, Modal, Input, Select} from "antd"
import {ProTable, ProFormText, ModalForm, ProFormSelect, PageContainer} from "@ant-design/pro-components";
import React, {useRef, useState} from "react";
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {PlusOutlined} from "@ant-design/icons";

const bodyStyle = createStyles((): any => {
    return {
        body: {
            // height: "100vh",
        },
        proTableStyle: {
            width: "100%",
            marginTop: "10px"
        },
        title: {
            // marginTop: "20px"
        }
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
export const waitTime = async (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

export default () => {
    const {styles: {body, proTableStyle, title}} = bodyStyle()
    const actionRef = useRef<ActionType>();
    const [form] = Form.useForm();
    const [isModelOpen, setIsModelOpen] = useState(false)
    const [modelTitle, setModelTitle] = useState("")
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false)
    const columns: ProColumns<tableItem>[] = [
        {
            title: '用户名',
            dataIndex: 'user_name',
            copyable: true,
            ellipsis: true,
            tooltip: '描述过长会自动收缩'
        },
        {
            title: '密码',
            dataIndex: 'password',
            ellipsis: true,
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
                                setIsModelOpen(true)
                                setModelTitle("编辑")
                                form.setFieldsValue(record)
                            }}>编辑</a>,
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

                                    }}
                                >
                                    <a style={{color: "black"}}>删除</a>
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
            <Body className={body} loading={loading}>
                <Row>
                    <Col span={22} offset={1}>
                        <Row>
                            <Col>
                                <h2 className={title}>用户列表</h2>
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

                                                }}>批量删除</Button>
                                            </Space>
                                        );
                                    }}
                                    className={proTableStyle}
                                    columns={columns}
                                    actionRef={actionRef}
                                    cardBordered
                                    // request={async (params, sort, filter) => {
                                    //     const res = await getTableList({action: "getList", ...params})
                                    //     return Promise.resolve({
                                    //         // @ts-ignore
                                    //         data: res?.result,
                                    //         success: true,
                                    //     });
                                    // }}
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
                                        <Button
                                            key="button"
                                            icon={<PlusOutlined/>}
                                            onClick={() => {
                                                form.resetFields()
                                                setModelTitle("新建")
                                                setIsModelOpen(true)
                                            }}
                                            type="primary"
                                        >
                                            新建
                                        </Button>
                                    ]}
                                />
                                <ModalForm
                                    title={modelTitle}
                                    form={form}
                                    open={isModelOpen}
                                    onOpenChange={setIsModelOpen}
                                    autoFocusFirstInput
                                    width={'30%'}
                                    modalProps={{
                                        maskClosable: false
                                    }}
                                    onFinish={async (values) => {

                                    }}
                                >
                                    <ProFormText
                                        name="rule_name"
                                        label="规则名称"
                                        placeholder="请输入规则名称"
                                        rules={[{required: true, message: '请输入'}]}
                                    />
                                    <ProFormText
                                        name="description"
                                        label="描述"
                                        placeholder="请输入描述"
                                        rules={[{required: true, message: '请输入'}]}
                                    />
                                    <ProFormText
                                        name="count"
                                        label="服务调用次数"
                                        placeholder="请输入调用次数"
                                        rules={[{required: true, message: '请输入'}]}
                                    />
                                    <ProFormSelect
                                        request={async () => [
                                            {
                                                value: '0',
                                                label: '正常',
                                            },
                                            {
                                                value: '1',
                                                label: '异常',
                                            },
                                            {
                                                value: '2',
                                                label: '解决中',
                                            },
                                            {
                                                value: '3',
                                                label: '已关闭',
                                            },
                                        ]}
                                        name="status"
                                        label="状态"
                                        rules={[{required: true, message: '请输入'}]}
                                    />
                                </ModalForm>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Body>
        </PageContainer>
    )
}
