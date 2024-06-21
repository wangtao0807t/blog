import React, {useEffect, useState} from "react";
import {Row, Col, Button} from "antd";
import {DownOutlined} from '@ant-design/icons';
import {createStyles} from 'antd-style';
import {history} from "umi"
import {useParams} from 'react-router-dom';
import {getArchives} from "@/service/archives";
import "../styles/shanshuo.css"

const contentStyles = createStyles((): any => {
    return {
        titleBackground: {
            height: "100vh",
            backgroundImage: `url(./images/forest.jpg)`,
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
            paddingTop: "300px",
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
            fontSize: "28px",
            fontWeight: "bolder",
            fontFamily: "SimHei"
        },
        cardSubTitle: {
            color: "white",
            fontSize: "18px",
            fontFamily: "SimHei",
            marginTop: "15px"
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
    const [isHidden, setIsHidden] = useState(false);
    const {
        styles: {
            titleBackground,
            titleBox,
            title,
            subTitle,
            cardStyle,
            cardTitle,
            cardSubTitle,
            btnScrollTo,
            goTop
        }
    } = contentStyles()
    const [archivesData, setArchivesData] = useState([])
    useEffect(() => {
        getArchives().then((r) => {
            setArchivesData(r?.data)
        })
    }, [])

    //转换时间格式
    const getTime = (time: any) => {
        const date = new Date(time)
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}年${month}月${day}日`;
    }

    //展示对应的类型值
    const typeFilte = (type: any) => {
        const typeOptions = [
            {value: "daily", label: '日常'},
            {value: "life", label: '生活'},
            {value: "interest", label: '兴趣'},
            {value: "study", label: '学习'}

        ];
        const bidTypeName = typeOptions.filter((item) => item.value === type);
        return bidTypeName[0].label;
    }
    const getCard = () => {
        if (archivesData.length > 0) {
            return (
                <span>
                    {archivesData.map((item: any, index: any) => (
                        <a key={item?.id} onClick={() => {
                            history.push(`/article/#${item?.id}`, {params: item});
                        }}>
                            <div className={cardStyle} style={{backgroundImage: `url(${item?.img_path})`}}>
                                <p className={cardTitle}>{item?.title}</p>
                                <p className={cardSubTitle}>
                                    <span>by {item?.author}</span> /
                                    <span> {getTime(item?.create_time)}</span> /
                                    <span> {typeFilte(item?.type)}</span>
                                </p>
                            </div>
                        </a>
                    ))}
                </span>
            );
        } else {
            return null
        }
    }
    //滚动距离
    window.addEventListener('scroll', function () {
        var scrollDistance = window.scrollY;
        if (scrollDistance > 500) {
            setIsHidden(true)
        } else {
            setIsHidden(false)
        }
    });
    return (
        <>
            <div className={titleBackground}>
                {/*<div style={{float: "right", color: "white", fontSize: "18px"}}>home</div>*/}
                <div className={titleBox}>
                    <p className={title}>道阻且长</p>
                    <p className={subTitle}>The road is obstructed and long</p>
                </div>
                <Button icon={<DownOutlined style={{fontSize: "30px",}}/>} type="link"
                        className={btnScrollTo}
                        onClick={() => {
                            window.scrollTo({behavior: 'smooth', top: window.innerHeight * 100 / 100});
                        }}
                >
                </Button>
                {
                    isHidden ? <Button
                        className={goTop}
                        style={{fontSize: "30px"}}
                        type="link" onClick={() => {
                        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                        console.log(scrollTop)
                        window.scrollTo({behavior: 'smooth', top: 0});
                    }}>
                        <img src="./images/rocket.png" style={{width: "40px"}}/>
                    </Button> : null
                }
            </div>
            <Row>
                <Col span={14} offset={5}>
                    <div style={{textAlign: "center", marginBottom: "30px"}}>
                        {getCard()}
                    </div>
                </Col>
            </Row>
        </>
    );
}
