import React from 'react';

const bigBoldSpan = (props) => {
    return (
        <span style={{fontWeight: 'bold', fontSize: '18px'}}>
            {props.text}
        </span>
    );
};

export default bigBoldSpan;