import React from "react";

export type ImageProps = {
    src?: any //图片路径
};
const Image: React.FC<ImageProps> = (props) => {
    return (
        <img
            style={{width: "80%", marginTop: "10px"}}
            src={props.src}
        />
    )
};

export default Image;
