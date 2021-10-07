import React from 'react';
import {withRouter} from 'react-router-dom';
import {Row, Col, Button, Icon} from 'antd';
import General from './General';
import './styles.css';

class OrganizationAdd extends React.Component {

    render() {
        return (
            <div>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={1}/>
                    <Col span={23}>
                        {/*<h3 className='text-left' style={{ fontWeight: 900, height: '10vh' }}>Organizations | {this.props.header || 'Add'}</h3>*/}
                    </Col>
                </Row>
                <Row type="flex" justify="start">
                    <Col span={1}/>
                    <Col span={1}>
                        <Button className='shadow' onClick={() => {
                            this.props.history.push({
                                pathname: this.props.backUrl || this.props.location.state.backUrl,
                                state: {...this.props.location.state}
                            })
                        }} size='large' style={{marginBottom: 8, fontWeight: 'bold'}}>
                            <Icon type="arrow-left"/>{(this.props.location.state && this.props.location.state.backText) || this.props.backText || "Organizations"}
                        </Button>
                    </Col>
                </Row>
                <Row type="flex" justify="space-around" align="middle" gutter={32}>
                    <Col span={1}/>
                    <Col span={23}>
                        <div className='shadow'>
                            <General {...this.props} />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withRouter(OrganizationAdd);