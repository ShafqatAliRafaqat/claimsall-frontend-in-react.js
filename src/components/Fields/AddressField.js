import React from 'react';
import {Row, Col} from 'antd';
import {Field} from 'redux-form';


const getLabel = (label, name, required) => {
    if (label && label.length) {
        return <label className="col-sm-2 control-label" htmlFor={name}>{label} {required &&
        <span className='font-red'>*</span>}</label>;
    }
    return null;
};

const renderField = ({fields, label, name, required, disabled, meta: {submitFailed, error, warning}}) => (
    <div className='form-group'>
        {getLabel(label, name, required)}
        <div className='col-sm-10'>
            <Row gutter={8}>
                {fields.map((field, index) =>
                    <Col span={12} key={index}>
                        <div style={{marginTop: '10px', marginBottom: '10px'}}>
                            <Field className='form-control' name={field} component={"textarea"} disabled={disabled}/>
                        </div>
                    </Col>
                )}
            </Row>
            <Row>
                <Col span={24} className='text-left'>
                    {(submitFailed && error) &&
                    ((error && <span className="errorMsg">{error}</span>) ||
                        (warning && <span className="warningMsg">{warning}</span>))}
                </Col>
            </Row>
            <Row type="flex" justify="start">
                <Col span={2}>
                    {!disabled && <button type="button" className='btn btn-default'
                                          onClick={() => fields.push()}>{fields && fields.length ? 'Add Another Address' : 'Add Address'}</button>}
                </Col>
            </Row>
        </div>
    </div>
);


export default renderField;