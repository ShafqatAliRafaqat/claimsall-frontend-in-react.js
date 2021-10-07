import React from 'react';
import {withRouter} from 'react-router-dom';
import {Row, Col, Button, Icon} from 'antd';
import General from './General';

class MedicalPolicyAdd extends React.Component {

    prevPage = (state) => {
        this.props.history.push({pathname: this.props.backUrl, state: {...this.props.location.state, ...state}});
    };

    render() {
        return (
            <div>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={1}/>
                    <Col span={23}>
                        {/*<h3 className='text-left' style={{fontWeight: 900, height: '10vh'}}>*/}
                        {/*Policy | {this.props.header || 'Add'}*/}
                        {/*</h3>*/}
                    </Col>
                </Row>
                <Row type="flex" justify="start">
                    <Col span={1}/>
                    <Col span={1}>
                        <Button className='shadow' onClick={() => {
                            this.prevPage()
                        }}>
                            <Icon type="arrow-left"/>{this.props.backText || "Policies"}
                        </Button>
                    </Col>
                </Row>
                <Row type="flex" justify="space-around" align="middle" gutter={32}>
                    <Col span={1}/>
                    <Col span={23}>
                        <div className='shadow'>
                            <General {...this.props} prevPage={this.prevPage}/>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withRouter(MedicalPolicyAdd);