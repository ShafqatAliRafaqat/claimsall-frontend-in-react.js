import React from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button, Icon } from 'antd';

class ServiceProviders extends React.Component {

    state = {
        types: [
            {
                text: 'Doctor',
                href: '/doctors/all'
            },
            {
                text: 'Hospital',
                href: '/hospitals/all'
            },
            {
                text: 'Laboratory',
                href: '/laboratories/all'
            },
            {
                text: 'Clinic',
                href: '/clinics/all'
            },
            {
                text: 'Pharmacy',
                href: '/pharmacies/all'
            }
        ]
    };

    getTypes = () => {
        return this.state.types.map(type => {
            return <Col span={4} key={type.href} style={{ margin: 8 }}>
                <Button onClick={() => { this.props.history.push(type.href) }}>
                    {type.text}<Icon type="right" />
                </Button>
            </Col>
        });
    };

    render() {
        return (
            <div>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={1} />
                    <Col span={23}>
                        <h3 className='text-left' style={{ fontSize: '36px', fontWeight: 900 }}>Service Providers</h3>
                    </Col>
                </Row>
                <Row gutter={32} className='shadow' style={{ padding: 12 }}>
                    <Col span={24}>
                        <Row>
                            {this.getTypes()}
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withRouter(ServiceProviders);
