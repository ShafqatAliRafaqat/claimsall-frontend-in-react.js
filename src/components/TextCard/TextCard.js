import React from 'react';
import {Row, Col} from 'antd';

const textCard = (props) => {
    return (
        <div className='' style={{padding: 12}}>
            <Row type="flex" justify="space-around" align="middle"
                 style={{marginBottom: 12}}>
                <Col span={21} offset={3} className='text-left'>
                    <span
                        style={{fontSize: '24px', fontWeight: 'bold', borderBottom: '1px solid #777'}}>{props.header}</span>
                </Col>
            </Row>
            <Row>
                <Col span={20} offset={4}>
                    <p className='text-left'>{props.text}</p>
                </Col>
            </Row>
        </div>
    );
};

export default textCard;