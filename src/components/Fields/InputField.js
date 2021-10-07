        import React from 'react';


const getLabel = (label, name, required) => {
    if (label && label.length) {
        return <label className="col-sm-2 control-label" htmlFor={name}>{label} {required && <span className='font-red'>*</span>}</label>;
    }
    return null;
};

const renderField = ({
    input,
    label,
    type,
    name,
    placeholder,
    required,
    disabled,
    meta: { touched, error, warning }
}) => (
        <div className="form-group">
            {getLabel(label, name, required)}
            <div className='col-sm-5'>
                <input className="form-control" {...input} id={name} placeholder={placeholder} type={type} disabled={disabled} />
                {touched &&
                    ((error && <span className="errorMsg">{error}</span>) ||
                        (warning && <span className="warningMsg">{warning}</span>))}
            </div>
            <div className='col-sm-5'></div>
        </div>
    );

export default renderField;