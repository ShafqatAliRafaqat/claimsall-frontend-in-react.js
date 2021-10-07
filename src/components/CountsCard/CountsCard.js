import React from 'react';
import {Row, Col, Button} from 'antd';

class CountsCard extends React.Component {

    render() {
        return (
            <div className='shadow' style={{backgroundColor: 'white', margin: 10}}>
                <Row type="flex" justify="center" align="top">
                    <Col span={24}>
                        <div style={{backgroundColor: this.props.color, height: '2vh'}}/>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="top">
                    <Col span={24}>
                        <div
                            style={{fontSize: '42px', color: this.props.color, height: '14vh'}}>{this.props.count}</div>
                    </Col>
                </Row>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={24}>
                        <div style={{fontSize: '16px', height: '14vh', fontWeight: 'bold'}}>
                            {this.props.text}
                        </div>
                    </Col>
                </Row>
                <Row type="flex" justify="space-between" align="bottom">
                    <Col span={24}>
                        <div style={{marginBottom: '12px'}}>
                            <Button type="primary"
                                    onClick={this.props.onClick}
                                    ghost
                                    style={{color: this.props.color, borderColor: this.props.color}}>
                                Explore
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default CountsCard;