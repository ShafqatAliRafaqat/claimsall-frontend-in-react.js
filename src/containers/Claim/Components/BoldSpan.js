import React from 'react';

const boldSpan = (props) => {
    return (
        <span style={{fontWeight: 'bold'}}>
            {props.text}
        </span>
    );
};

export default boldSpan;