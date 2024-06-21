import Body from '../component/body'
import {createStyles} from "antd-style";
import {history} from "umi";
import {Row, Col, Button, Space, Dropdown, Popconfirm, message, Form, Drawer, Upload} from "antd"
import {ProTable, PageContainer, ProForm, ProFormText, ProFormSelect} from "@ant-design/pro-components";
import React, {useEffect, useRef, useState} from "react";
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {PlusOutlined, UploadOutlined} from "@ant-design/icons";
import {
    addArchives,
    batchDeleteArchives,
    deleteArchives,
    getArchives,
    updateArchives,
    uploadImage
} from "@/service/archives";
import type {UploadProps, UploadFile} from 'antd';
import {Editor, Toolbar} from '@wangeditor/editor-for-react'
import {IDomEditor, IEditorConfig, IToolbarConfig} from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'

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
export const waitTime = async (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

export default () => {
    const {styles: {proTableStyle}} = bodyStyle()
    const actionRef = useRef<ActionType>();
    const [form] = Form.useForm();
    //抽屉开关
    const [open, setOpen] = useState(false)
    //多选
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    //加载
    const [loading, setLoading] = useState(false)
    //抽屉标题
    const [drawerTitle, setDrawerTitle] = useState("")
    // editor 实例
    const [editor, setEditor] = useState<IDomEditor | null>(null)
    // 编辑器内容
    const [html, setHtml] = useState('')
    //回传的图片地址
    const [imgPath, setImgPath] = useState("")
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
            render: (text, record: any, _, action) => [
                <Dropdown menu={{
                    items: [
                        {
                            label: <a style={{color: "black"}} onClick={() => {
                                setOpen(true)
                                setDrawerTitle("编辑")
                                form.setFieldsValue(record)
                                setHtml(record?.content)
                            }}>编辑</a>,
                            key: 0,
                        },
                        {
                            label:
                                <Popconfirm
                                    title="确认要删除吗？"
                                    description="删除之后可在回收站中找到"
                                    okText="确认"
                                    cancelText="取消"
                                    onConfirm={() => {
                                        deleteArchives({action: "delete", id: record?.id}).then((res) => {
                                            if (res.code == 200) {
                                                message.success("删除成功")
                                                actionRef.current?.reload();
                                            }
                                        })
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
    //关闭抽屉
    const onClose = () => {
        setOpen(false)
        form.resetFields();
        // @ts-ignore
        editor.clear();
    }
    //图片上传
    const props: UploadProps = {
        beforeUpload: (file: any) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('只能上传jpg或者png格式的图片');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('图片大小必须小于2MB');
            }
            return isJpgOrPng || Upload.LIST_IGNORE;

        },
        onChange: (info: any) => {
            setImgPath("")
            if (info.fileList[0]?.status === 'uploading') {
                const formData = new FormData();
                const fileList = info.fileList;
                fileList.forEach((file: any) => {
                    formData.append("name", file.originFileObj);
                });
                // 调后端接口发送上传的图片
                uploadImage(formData).then((res: any) => {
                    if (res.code === 200) {
                        setImgPath(res?.data)
                        return true
                    } else {
                        return false
                    }
                });
            } else if (info.fileList[0]?.status === 'done') {
                return true
            } else if (info.fileList[0]?.status === 'error') {
                message.error("上传失败");
            }

        },
        listType: "picture",
    };

    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = {}

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {
        MENU_CONF: {}
    }
    editorConfig.placeholder = '请输入内容...',
        // @ts-ignore 上传图片的配置
        editorConfig.MENU_CONF['uploadImage'] = {
            server: 'http://121.41.108.225/upload.php ',
        }
    // 及时销毁 editor
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])
    return (
        <PageContainer>
            <Body loading={loading}>
                <Row>
                    <Col span={22} offset={1}>
                        <Row>
                            <Col>
                                <h2>文章管理</h2>
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
                                                <Popconfirm
                                                    title="确认要删除吗？"
                                                    description="删除之后可在回收站中找到"
                                                    okText="确认"
                                                    cancelText="取消"
                                                    onConfirm={() => {
                                                        batchDeleteArchives({
                                                            action: "batchDel",
                                                            ids: selectedRowKeys?.selectedRowKeys
                                                        })
                                                            .then((res) => {
                                                                if (res?.code === 200) {
                                                                    message.success("删除成功")
                                                                    actionRef.current?.reload();
                                                                }
                                                            })
                                                    }}
                                                >
                                                    <Button type={"link"}>批量删除</Button>
                                                </Popconfirm>
                                            </Space>
                                        );
                                    }}
                                    className={proTableStyle}
                                    columns={columns}
                                    actionRef={actionRef}
                                    cardBordered
                                    request={async (params, sort, filter) => {
                                        const res = await getArchives({...params})
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
                                                key="button"
                                                icon={<PlusOutlined/>}
                                                onClick={() => {
                                                    setDrawerTitle("新建")
                                                    setOpen(true)
                                                }}
                                                type="primary"
                                            >
                                                新建
                                            </Button>
                                            <Button
                                                key="recycle_bin"
                                                onClick={() => {
                                                    history.push("/recycleBin")
                                                }}
                                                type="text"
                                            >
                                                回收站
                                            </Button>
                                        </>]}
                                />
                                <Drawer title={drawerTitle} width={"100%"}
                                        onClose={onClose} open={open}
                                        destroyOnClose={true}>
                                    <ProForm<{
                                        name: string;
                                        company?: string;
                                        useMode?: string;
                                    }>
                                        form={form}
                                        onReset={(e) => {
                                            editor?.clear();
                                            setImgPath("")
                                        }}
                                        onFinish={async (values) => {
                                            await waitTime(2000);
                                            if (drawerTitle == "新建") {
                                                addArchives({
                                                    action: "add",
                                                    values,
                                                    editorValue: editor?.getHtml(),
                                                    imgPath: imgPath
                                                }).then((res) => {
                                                    if (res?.code === 200) {
                                                        message.success('新建成功');
                                                        setOpen(false);
                                                        form.resetFields();
                                                        editor?.clear();
                                                        actionRef.current?.reload();
                                                    }
                                                })
                                            }
                                            if (drawerTitle == "编辑") {
                                                const id = form.getFieldValue('id')
                                                updateArchives({
                                                    action: "update",
                                                    id: id,
                                                    values,
                                                    editorValue: editor?.getHtml(),
                                                    imgPath: imgPath
                                                }).then((res) => {
                                                    if (res?.code === 200) {
                                                        message.success('修改成功');
                                                        setOpen(false);
                                                        form.resetFields();
                                                        editor?.clear();
                                                        actionRef.current?.reload();
                                                    }
                                                })
                                            }
                                        }}
                                        layout={"horizontal"}
                                    >
                                        <ProFormText
                                            width="md"
                                            name="title"
                                            label="标题"
                                            tooltip="文章标题"
                                            placeholder="请输入标题"
                                            rules={[{required: true}]}
                                        />
                                        <ProFormSelect
                                            options={[
                                                {
                                                    value: 'life',
                                                    label: '生活',
                                                },
                                                {
                                                    value: "daily",
                                                    label: "日常"
                                                },
                                                {
                                                    value: 'interest',
                                                    label: '兴趣',
                                                },
                                                {
                                                    value: 'study',
                                                    label: '学习',
                                                },

                                            ]}
                                            width="md"
                                            name="type"
                                            label="分类"
                                            tooltip="文章分类"
                                            rules={[{required: true}]}
                                        />
                                        <ProFormText
                                            width="md"
                                            name="bgImg"
                                            label="特色图片"
                                        >
                                            <Upload {...props}
                                                // fileList={fileList}
                                                    maxCount={1}>
                                                <Button icon={<UploadOutlined/>}>上传</Button>
                                            </Upload>
                                        </ProFormText>
                                        <div style={{border: '1px solid #ccc', zIndex: 100, marginBottom: "20px"}}>
                                            <Toolbar
                                                editor={editor}
                                                defaultConfig={toolbarConfig}
                                                mode="default"
                                                style={{borderBottom: '1px solid #ccc'}}
                                            />
                                            <Editor
                                                defaultConfig={editorConfig}
                                                value={html}
                                                onCreated={setEditor}
                                                onChange={editor => setHtml(editor.getHtml())}
                                                mode="default"
                                                style={{height: '500px', overflowY: 'hidden'}}
                                            />
                                        </div>
                                    </ProForm>
                                </Drawer>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Body>
        </PageContainer>
    )
}
