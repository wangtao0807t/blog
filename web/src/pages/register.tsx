import React, {useEffect, useState} from 'react';
import {Form, Row, Col, Input, Button, Flex, message} from 'antd';
import {FacebookOutlined, GithubOutlined, GoogleOutlined, TwitterOutlined} from '@ant-design/icons';
import {createStyles} from 'antd-style';
import {history} from "umi";
import Body from "../component/body"
import {registerService} from "@/service/login";

const useStyles = createStyles(({token, css, cx}) => {
    return {
        bgStyle: {
            backgroundColor: "rgb(1 98 232 / 30%)",
        }
    };
});

export default function () {
    const onFinish = (values: any) => {
        if ((values?.name == undefined || values?.name == "") || (values?.password == undefined || values?.password == "")) {
            message.error("请输入用户名和密码")
        } else {
            registerService(values).then((res) => {
                if (res?.code == "200") {
                    message.success(res?.message)
                    setTimeout(() => {
                        setLoading(true)
                        setTimeout(() => {
                            setLoading(false)
                            history.push('/')
                        }, 500)
                    }, 1000)
                } else {
                    // message.error("注册失败")
                    message.error(res?.message)
                }
            })
        }
    };
    const {styles} = useStyles();
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm<any>();
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [])
    return (
        <Body loading={loading}>
            <div>
                <Row>
                    <Col className={styles.bgStyle} xs={0} md={14}>
                        <Flex style={{height: "100vh"}} justify={"center"} align={"center"}>
                            <img
                                style={{minWidth: "200px", maxWidth: "650px"}}
                                src="./images/bgImg.png"
                            />
                        </Flex>
                    </Col>
                    <Col xs={24} md={10}>
                        <Col span={18} push={3}>
                            <Row style={{marginTop: "120px"}}>
                                <Col>
                                    <div style={{marginTop: "40px"}}>
                                        <h1 style={{color: "#1677FF"}}>欢迎回来!</h1>
                                        <h3>请注册您的账户.</h3>
                                    </div>
                                </Col>
                            </Row>
                            <Form
                                form={form}
                                layout="vertical"
                                name="normal_login"
                                className="login-form"
                                initialValues={{remember: true}}
                                onFinish={onFinish}
                                style={{textAlign: "center", margin: "0 auto", marginTop: "30px"}}
                            >
                                <Form.Item
                                    label={"账号"}
                                    colon={false}
                                    name="name"
                                >
                                    <Input placeholder="请输入账号"/>
                                </Form.Item>
                                <Form.Item
                                    label={"密码"}
                                    colon={false}
                                    name="password"
                                >
                                    <Input
                                        type="password"
                                        placeholder="请输入密码"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button style={{backgroundColor: "#2ac14e"}} type="primary" htmlType="submit" block>
                                        注册
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <h4 style={{color: "#6c757d"}}>已经有帐户了吗？
                                        <a style={{fontWeight: "bold", marginLeft: "5px", color: "black"}}
                                           onClick={() => {
                                               history.push("/")
                                           }}
                                        >去登录</a>
                                    </h4>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Col>
                </Row>
            </div>
        </Body>
    )
};
