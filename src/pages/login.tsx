import React, {useState} from 'react';
import {Form, Row, Col, Input, Button, Flex, message} from 'antd';
import {createStyles} from 'antd-style';
import {history} from "umi";
import {loginService} from "@/service/login";
import Body from "../component/body"

const useStyles = createStyles(({token, css, cx}) => {
    return {
        bgStyle: {
            backgroundColor: "rgb(1 98 232 / 30%)",
        }
    };
});

export default () => {
    const onFinish = (values: any) => {
        if ((values.name == undefined || values.name == "") || (values.password == undefined || values.password == "")) {
            message.error("请输入用户名和密码")
        } else {
            loginService(values).then((res: any) => {
                console.log(res)
                if (res?.token != null) {
                    localStorage.setItem("token", res?.token)
                }
                if (res?.code == "200") {
                    message.success('登录成功')
                    setTimeout(() => {
                        setLoading(true)
                        setTimeout(() => {
                            setLoading(false)
                            if (res?.isAdministrators == 0) {
                                history.push("/archives")
                            } else {
                                history.push('/index')
                            }

                        }, 500)
                    }, 1000)
                } else {
                    message.error("登录失败，账号或密码不正确")
                }
            })
        }
    };
    const {styles} = useStyles();
    const [loading, setLoading] = useState(false)
    return (
        <Body loading={loading}>
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
                                    <h1 style={{color: "#1677FF"}}>欢迎回来！</h1>
                                    <h3>请登录以继续.</h3>
                                </div>
                            </Col>
                        </Row>
                        <Form
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
                                <Button type="primary" htmlType="submit" block>
                                    登录
                                </Button>
                            </Form.Item>
                            <Form.Item>
                            </Form.Item>
                        </Form>
                        <div style={{marginTop: "20px"}}>
                            <a style={{color: "black", fontSize: "15px", fontWeight: "bolder"}}>忘记密码？</a>
                            <p><span style={{color: "#6c757d"}}>没有账号？</span>
                                <a onClick={() => {
                                    history.push("/register")
                                }}
                                   style={{color: "black", fontSize: "15px", fontWeight: "bolder"}}>创建账号</a></p>
                        </div>
                    </Col>
                </Col>
            </Row>
        </Body>
    )
}
