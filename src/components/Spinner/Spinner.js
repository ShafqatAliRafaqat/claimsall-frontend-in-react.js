import React from 'react';

const spinner = (props) => {
    return (
        <div style={{textAlign: "center"}}>
            <i className="fa fa-circle-o-notch fa-spin" style={{fontSize: props.size || "32px"}}></i>
        </div>
    );
};

export default spinner;