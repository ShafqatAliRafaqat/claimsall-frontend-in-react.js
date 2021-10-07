import React from 'react';
import {Row, Col} from 'antd';
import BoldSpan from './BoldSpan';

const displayArray = (arrayData) => {
    return arrayData.map((data, index) => {
        return <span key={index}>{`${data + ((index + 1 === arrayData.length) ? '' : ', ')}`}</span>
    });
};

const employeeTab = (props) => {
    let {data} = props;
    return (
        <div className='font-quicksand'>
            {data && data.map(item => {
                return (
                    <Row key={item.name} type="flex" justify="start" style={{marginBottom: 12}}>
                        <Col span={5} offset={1} className='text-left'>
                            <BoldSpan text={item.name}/>
                        </Col>
                        <Col span={10} offset={1} className='text-left'>
                            {Array.isArray(item.value) ? displayArray(item.value) : item.value}
                        </Col>
                    </Row>
                );
            })}

        </div>
    );
};

export default employeeTab;