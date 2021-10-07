import React from 'react';
import {Row, Col} from 'antd';
import {Field} from 'redux-form';


const renderField = ({fields, label, name, required, disabled, meta: {submitFailed, error, warning}}) => (
    <div className='form-group'>
        <Row gutter={8}>
            {fields && fields.length && fields.map((field, index) =>
                <Col span={12} offset={1} key={index}>
                    <div style={{marginTop: '10px', marginBottom: '10px'}}>
                        <Row>
                            <Col span={6}><label className="control-label">{label + '-' + (index + 1)}</label></Col>
                            <Col span={15}><Field className='form-control' name={field} component='input'
                                                  disabled={disabled}/></Col>
                            <Col span={1}/>
                            <Col span={2}>
                                {!disabled && (index === fields.length - 1) ?
                                    <button type="button" className='btn btn-default' onClick={() => fields.push()}>Add
                                        Another</button> : null}
                            </Col>
                        </Row>
                    </div>
                </Col>
            )}
            {!disabled && (!fields || !fields.length) ? <Col span={2} offset={2}>
                <button type="button" className='btn btn-default' onClick={() => fields.push()}>Add</button>
            </Col> : null}
        </Row>
        <Row type='flex' justify='space-around' align='middle'>
            <Col span={12} offset={1} className='text-left'>
                {(submitFailed && error) &&
                ((error && <span className="errorMsg">{error}</span>) ||
                    (warning && <span className="warningMsg">{warning}</span>))}
            </Col>
        </Row>
    </div>
);


export default renderField;