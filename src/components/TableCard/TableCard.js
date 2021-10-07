import React from 'react';
import {Row, Col} from 'antd';


const getRecords = (records) => {
    let jsx = null;
    if (records && records.length) {
        jsx = records.map((record) => {
            return (
                <Row key={record.title} type="flex" justify="space-around" align="middle" gutter={32}>
                    <Col span={12} style={{fontWeight: 'bold', fontSize: 16}}>
                        {record.title}
                    </Col>
                    <Col span={12}>
                        {record.value}
                    </Col>
                </Row>
            );
        });
    }

    return jsx;
};

const tableCard = (props) => {
    return (
        <div className='' style={{padding: 12}}>
            <Row type="flex" justify="space-around" align="middle"
                 style={{marginBottom: 12}}>
                <Col span={21} offset={3} className='text-left'>
                    <span style={{fontSize: '24px', fontWeight: 'bold', borderBottom: '1px solid #777'}}>{props.header}</span>
                </Col>
            </Row>
            {getRecords(props.records)}
        </div>
    );
};

export default tableCard;