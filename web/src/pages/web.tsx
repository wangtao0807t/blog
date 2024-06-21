import React, {useRef, useState} from "react";
import {addArchives, updateArchives, uploadImage} from "@/service/archives";
import {Button, Card, Col, Form, message, Row, Upload, UploadProps} from "antd";
import {ActionType, ProForm, ProFormSelect, ProFormText} from "@ant-design/pro-components";
import {UploadOutlined} from "@ant-design/icons";
import {Editor, Toolbar} from "@wangeditor/editor-for-react";
import {waitTime} from "@/pages/archives";

const Web: React.FC = () => {
    const [form] = Form.useForm();
    //回传的图片地址
    const [imgPath, setImgPath] = useState("")
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
    return (
        <div>
            <Card style={{width: "80%", height: "80vh", margin: "0 auto", marginTop: "30px"}}>
                <Row>
                    <Col span={12} offset={6}>
                        <ProForm<{
                            name: string;
                            company?: string;
                            useMode?: string;
                        }>
                            form={form}
                            onReset={(e) => {
                                setImgPath("")
                            }}
                            onFinish={async (values) => {
                                await waitTime(2000);
                            }}
                            layout={"vertical"}
                        >
                            <ProFormText
                                width="md"
                                name="title"
                                label="站点标题"
                                tooltip="站点标题"
                                placeholder="请输入标题"
                                rules={[{required: true}]}
                            />
                            <ProFormText
                                width="md"
                                name="url"
                                label="站点地址"
                                tooltip="站点地址"
                                placeholder="请输入地址"
                                rules={[{required: true}]}
                            />
                            <ProFormText
                                width="md"
                                name="logo"
                                label="站点图标"
                                tooltip="站点标题"
                            >
                                <Upload {...props}
                                        maxCount={1}>
                                    <Button icon={<UploadOutlined/>}>上传</Button>
                                </Upload>
                            </ProFormText>
                        </ProForm>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

export default Web
