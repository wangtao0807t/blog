import React, {useState, useEffect} from 'react';
import {Outlet, history, useLocation, useModel} from 'umi';
import type {MenuProps} from 'antd';
import {Button, Flex, Layout, Menu, Drawer, ConfigProvider, App, message} from 'antd';
import Footer from "../component/footer"
import {createStyles, useResponsive} from 'antd-style';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BookFilled,
    BankFilled,
    UserOutlined,
    SettingFilled
} from "@ant-design/icons";
import Image from "../component/image"

const {Header, Content, Sider} = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const items: any = [
    getItem('系统首页', '/index', <BankFilled/>),
    getItem('文章管理', '/archives', <BookFilled/>),
    getItem('用户管理', '/user', <UserOutlined/>),
    getItem('网站配置', '/web', <SettingFilled/>),
];

const useLayoutStyles = createStyles((): any => {
    return {
        logoStyle: {
            height: "80px",
            padding: "15px",
        },
        header: {
            width: "100%",
            height: "50px",
            lineHeight: "50px",
            position: 'sticky',
            padding: "0",
            top: 0,
            zIndex: 1,
            boxShadow: "0px 2px 10px 0 rgba(29, 35, 41, 0.05)",
            backgroundColor: "white"
        },
        siderStyle: {
            width: "100%",
            height: "100%",
            zIndex: 2,
            position: "fixed !important",
            bottom: 0,
        },
    };
});

export default () => {
    const [collapsed, setCollapsed] = useState(false);
    const [open, setOpen] = useState(false);
    const systemTheme = useModel("theme");
    const menuOnClick: MenuProps['onClick'] = (e) => {
        setOpen(false)
        history.push(e.key)
    };
    const {styles: {logoStyle, header, drawer, siderStyle}} = useLayoutStyles()

    const toggleCollapsed = () => {
        if (mobile) {
            setOpen(true)
        } else {
            setCollapsed(!collapsed)
        }
    }
    const {mobile} = useResponsive();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const location = useLocation();
    useEffect(() => {
        // @ts-ignore
        setSelectedKeys([location?.pathname]);
    }, [location]);
    return (
        <App>
            <ConfigProvider theme={systemTheme?.themes}>
                <Layout>
                    {
                        (mobile && <Drawer className={drawer}
                                           width={220}
                                           onClose={() => {
                                               setOpen(false)
                                           }}
                                           open={open}
                                           placement={"left"}
                                           closeIcon={null}
                        >
                            <div style={{backgroundColor: "white"}}>
                                <Flex justify={"center"} align={"center"}>
                                    {(systemTheme.themes.mode == "dark") ?
                                        !collapsed ?
                                            <Image src={"/images/logo_dark.png"}/> :
                                            <Image src={"/images/logo.svg"}/>
                                        :
                                        !collapsed ?
                                            <Image src={"/images/logo_light.png"}/> :
                                            <Image src={"/images/logo.svg"}/>
                                    }
                                </Flex>
                            </div>
                            <Menu theme="light" selectedKeys={selectedKeys} mode="inline" items={items}
                                  onClick={menuOnClick}
                                  expandIcon={false}
                                  style={{height: "100vh"}}
                            />
                        </Drawer>)
                        ||
                        <div>
                            <Sider collapsed={collapsed}
                                   hidden={mobile}
                                   className={siderStyle}
                                   theme={"light"}
                            >
                                <div className={logoStyle}>
                                    <Flex justify={"center"} align={"center"}>
                                        {(systemTheme.themes.mode == "dark") ?
                                            !collapsed ? <Image src={"/images/logo_dark.png"}/> :
                                                <Image src={"/images/logo.svg"}/>
                                            :
                                            !collapsed ? <Image src={"/images/logo_light.png"}/> :
                                                <Image src={"/images/logo_light.png"}/>
                                        }
                                    </Flex>
                                </div>
                                <Menu theme="light" selectedKeys={selectedKeys} mode="inline" items={items}
                                      onClick={menuOnClick}
                                      style={{height: "100vh"}}
                                />
                            </Sider>
                        </div>
                    }
                    <Layout style={{marginLeft: mobile ? 0 : (collapsed ? "80px" : "200px")}}>
                        <div className={header}>
                            <div style={{float: "left"}}>
                                <Button type="text" onClick={toggleCollapsed} style={{marginBottom: 16}}>
                                    {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                                </Button>
                                <span>左侧内容</span>
                            </div>
                            <div style={{float: "right"}}>
                                <Button type="link" onClick={() => {
                                    systemTheme?.toggle()
                                }} style={{color: "black"}}>
                                    切换主题
                                </Button>
                                <Button type="link" onClick={() => {
                                    localStorage.removeItem("token")
                                    message.success('退出成功');
                                    history.push("/");
                                }} style={{color: "black"}}>
                                    退出登录
                                </Button>
                            </div>
                        </div>
                        <Content style={{overflow: "auto", minHeight: "85vh"}}>
                            <Outlet/>
                        </Content>
                        <Footer></Footer>
                    </Layout>
                </Layout>
            </ConfigProvider>
        </App>
    );
};
