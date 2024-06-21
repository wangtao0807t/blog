import {useLocation} from "umi";
import React, {useEffect, useState} from "react";
import {Row, Col, Button, Card, Input, message, Form} from "antd";
import {createStyles} from 'antd-style';
import "../styles/shanshuo.css";
import '@wangeditor/editor/dist/css/style.css';
import type {FormLayout} from 'antd/lib/form/Form';
import {ProForm, ProFormText, ProFormTextArea,} from '@ant-design/pro-components';

const contentStyles = createStyles((): any => {
    return {
        titleBackground: {
            height: "60vh",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "50% 50%",
            backgroundColor: "rgba(0, 0, 0, 0.4)", /* 黑色蒙层，50%透明度 */
            backgroundBlendMode: "multiply"
        },
        titleBox: {
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            paddingTop: "180px",
        },
        title: {
            color: "white",
            fontSize: "80px",
            fontWeight: "bolder",
            fontFamily: "SimHei"
        },
        subTitle: {
            color: "white",
            fontSize: "20px",
            fontWeight: "bolder",
            fontFamily: "SimHei",
            marginTop: "10px"
        },
        cardStyle: {
            height: "200px",
            marginTop: "30px",
            borderRadius: "5px",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "0 50%",
            transition: "transform 0.3s ease",
            paddingTop: "130px"
        },
        cardTitle: {
            color: "white",
            fontSize: "50px",
            fontWeight: "bolder",
            fontFamily: "SimHei"
        },
        cardSubTitle: {
            color: "white",
            fontSize: "18px",
            fontFamily: "SimHei",
            marginTop: "15px",
        },
        btnScrollTo: {
            position: "absolute",
            bottom: "10%",
            left: "49%",
            color: "white",
            width: "200px",
            animation: "blink 2s infinite"
        },
        goTop: {
            position: 'fixed',
            right: 20,
            bottom: 50,
            color: "white",
        }
    }
})

export default () => {
    const location: any = useLocation();
    const [data, setData] = useState<any>({})
    const [form] = Form.useForm();
    const {
        styles: {
            titleBackground,
            titleBox,
            cardTitle,
            cardSubTitle,
        }
    } = contentStyles()
    useEffect(() => {
        setData(location?.state?.params)
        console.log(location?.state?.params)
    }, [])

    //转换时间格式
    const getTime = (time: any) => {
        const date = new Date(time)
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}年${month}月${day}日`;
    }
    const getHtmlContent = () => {
        // const parser = new DOMParser();
        // const doc = parser.parseFromString(htmlString, "text/html");
        // const divElement = doc.querySelector("div");

        // return element;
        const htmlString = location?.state?.params?.content
        console.log('99999', htmlString)
        return true
    }
    const LAYOUT_TYPE_HORIZONTAL = 'horizontal';
    const [formLayoutType, setFormLayoutType] = useState<FormLayout>(
        LAYOUT_TYPE_HORIZONTAL,
    );
    const waitTime = (time: number = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    };
    return (
        <>
            <div className={titleBackground} style={{backgroundImage: `url(${data?.img_path})`,}}>
                <div className={titleBox}>
                    <p className={cardTitle}> {data.title}</p>
                    <p className={cardSubTitle}>
                        <span style={{opacity: 0.8}}>by </span><span
                        style={{fontWeight: "bold"}}>{data?.author}</span> /
                        <span style={{opacity: 0.8}}> on </span><span
                        style={{fontWeight: "bold"}}>{getTime(data?.create_time)}</span>
                    </p>
                </div>
            </div>
            <Row>
                <Col span={14} offset={5}>
                    <div style={{textAlign: "center", marginBottom: "30px"}}>
                        <div dangerouslySetInnerHTML={{__html: data?.content}}/>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={14} offset={5}>
                    <ProForm<{
                        name: string;
                        company?: string;
                        useMode?: string;
                    }>
                        form={form}
                        style={{paddingTop: "20px"}}
                        layout={"inline"}
                        grid={true}
                        rowProps={{
                            gutter: [16, 16],
                        }}
                        submitter={{
                            // 配置按钮文本
                            searchConfig: {
                                submitText: '发布',
                            },
                            resetButtonProps: {
                                style: {
                                    // 隐藏重置按钮
                                    display: 'none',
                                },
                            },
                            submitButtonProps: {
                                style: {
                                    color: 'white',
                                    backgroundColor: '#FE9600',
                                    margin: "20px 0",
                                },
                            }
                        }}
                        onFinish={async (values) => {
                            await waitTime(2000);
                            console.log(values);
                            message.success('提交成功');
                        }}
                    >
                        <ProFormText colProps={{md: 12, xl: 8}} name="name" label="昵称" rules={[{required: true}]}
                                     placeholder="必填：请输入昵称"
                        />
                        <ProFormText colProps={{md: 12, xl: 8}} name="email" label="邮箱" rules={[{required: true}]}
                                     placeholder="必填：请输入邮箱"/>
                        <ProFormText colProps={{md: 12, xl: 8}} name="web" label="网址" placeholder="选填：请输入邮箱"/>
                        <ProFormTextArea
                            colProps={{span: 24}}
                            name="comment"
                            label=""
                        />
                    </ProForm>
                </Col>
            </Row>

        </>
    );
}
