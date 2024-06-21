import React from "react";
import {ConfigProvider, Layout, Spin} from "antd";
import {createStyles} from "antd-style";

const useStyles = createStyles((): any => {
    return {
        body: {
            width: "100%",
            margin: "0 auto",
            lineHeight: "100vh"
        },
    };
});

export type BodyProps = {
    loading?: boolean;//是否加载状态
    style?: any;//样式
    className?: any;//样式名
    children?: any
};

const Body: React.FC<BodyProps> = (props) => {
    const {children, loading, style, className} = props;
    const {styles: {body}} = useStyles();
    return <ConfigProvider>
        {(loading && <Spin spinning={true} size="large" className={body}></Spin>) ||
            <Layout style={style} className={className}>
                {children}
            </Layout>}
    </ConfigProvider>
}

export default Body
