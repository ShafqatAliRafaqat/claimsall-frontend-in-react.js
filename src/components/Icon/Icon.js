import React from 'react';

const icon = (props) => {
    let style = {
        display: 'inline-block',
        height: props.height || '20vh'
    };

    const { src, alt } = props;

    return (
        <img src={src} alt={alt} style={style} />
    );
};

export default icon;