import React from 'react';

const submitButton = (props) => {
    const buttonStyle = {
        backgroundColor: '#000',
        color: 'white',
        borderRadius: 0,
        fontSize: 16
    };

    return (
        <button style={buttonStyle} className="btn" type="submit" {...props}>
            {props.children && props.children}
        </button>
    );
};

export default submitButton;