import React from 'react';
import axios from '../../../utils/axios';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Alert, Col, message, Row, Spin} from 'antd';
import GeneralForm from '../../../components/Forms/ClaimProcessForm';
import serverConfig from '../../../config/config.json';


class General extends React.Component {

    state = {
        processing: true,
        data: []
    };


    fetchProcessFlow = () => {
        const url = `${serverConfig.serverUrl}/policy/view-approval-process`;
        const headers = {headers: {'Authorization': `Bearer ${this.props.jwt}`}};

        axios.get(url, headers)
            .then(resp => {
                let {data} = resp.data;
                this.setState({processing: false, data})
            })
            .catch(err => {
                console.log(err.response);
                message.error(err.response.message);
                this.setState({processing: false});
            });
    };

    componentDidMount() {
        this.fetchProcessFlow();
    }

    onFormSubmit = (form) => {
        console.log('processFlow Form', form);


        const url = `${serverConfig.serverUrl}/policy/approval-process`;
        const headers = {headers: {'Authorization': `Bearer ${this.props.jwt}`}};

        this.setState({processing: true, data: form});

        axios.post(url, {data: form}, headers)
            .then(() => {
                this.setState({processing: false});
                message.success('Workflow saved');
            })
            .catch(err => {
                this.fetchProcessFlow();
                message.error(err.response.data.message);
                console.log('error on updating workflow', err.response);
            });
    };

    form = () => {
        let jsx;
        if (this.state.processing) {
            jsx = <Spin size='large'/>
        } else {
            jsx = (
                <GeneralForm onSubmit={this.onFormSubmit} initialData={this.state.data}/>
            );
        }

        return jsx;
    };

    render() {
        return (
            <div>
                <Row style={{borderBottom: '2px solid #777'}}>
                    <Col span={24}>
                        <h2 className='form-headline'>
                            Workflow
                        </h2>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div style={{padding: '12px'}}>
                            {this.props.message ? (
                                <Alert message={"Success"} description={this.props.message} type="success"
                                       showIcon/>) : null}
                            {this.props.error ? (
                                <Alert message={"Error"} description={this.props.error} type="error" showIcon/>) : null}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div style={{padding: '12px'}}>
                            {this.form()}
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        jwt: state.auth.token,
    };
};

const _connectedComponent = connect(mapStateToProps)(General);
export default withRouter(_connectedComponent);