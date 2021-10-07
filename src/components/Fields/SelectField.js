import React from 'react';

const getLabel = (label, name, required) => {
    if (label && label.length) {
        return <label className="col-sm-2 control-label" htmlFor={name}>{label} {required && <span className='font-red'>*</span>}</label>;
    }
    return null;
};

const getOptions = (values) => {
    return values.map(value => {
        return <option key={value.id} value={value.id}>{value.name}</option>
    });
};

const renderField = ({
    input,
    label,
    name,
    values,
    multiple,
    required,
    disabled,
    meta: { touched, error, warning }
}) => (
        <div className="form-group">
            {getLabel(label, name, required)}
            <div className='col-sm-5'>
                <select className="form-control" {...input} id={name} disabled={disabled}>
                    <option></option>
                    {getOptions(values)}
                </select>
                {touched &&
                    ((error && <span className="errorMsg">{error}</span>) ||
                        (warning && <span className="warningMsg">{warning}</span>))}
            </div>
            <div className='col-sm-5'></div>
        </div>
    );

export default renderField;