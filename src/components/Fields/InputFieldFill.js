import React from 'react';

const renderField = ({
    input,
    label,
    type,
    name,
    placeholder,
    meta: { touched, error, warning }
}) => (
        <div className="form-group">
            <div className='col-sm-12'>
                <input className="form-control" {...input} id={name} placeholder={placeholder} type={type} />
                {touched &&
                    ((error && <span className="errorMsg">{error}</span>) ||
                        (warning && <span className="warningMsg">{warning}</span>))}
            </div>
        </div>
    );

export default renderField;