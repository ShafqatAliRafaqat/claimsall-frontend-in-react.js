import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Row, Col, Spin, Alert} from 'antd';
import * as actions from '../../../store/acl/acl-actions';
import GeneralForm from '../../../components/Forms/ACLForm';
import {fetchOrgModules} from "../../../utils/data-fetcher";


class General extends React.Component {

    state = {
        modules: []
    };

    componentDidMount() {
        this.props.resetReduxState();

        // load edit form
        if (this.props.location && this.props.location.state && this.props.location.state.id) {
            this.props.editAcl(this.props.location.state.id);
        }

        fetchOrgModules()
            .then(modules => {
                this.setState({modules});
            })
            .catch(err => console.log(err));
    }

    onFormSubmit = (form) => {
        console.log('Acl Add Form', form);
        this.props.addAcl(form);
    };

    form = () => {
        let jsx;
        if (this.props.processing) {
            jsx = <Spin size='large'/>
        } else {
            jsx = (
                <GeneralForm onSubmit={this.onFormSubmit} modules={this.state.modules}
                             initialValues={this.props.acl} readOnly={this.props.readOnly}/>
            );
        }

        return jsx;
    };

    componentDidUpdate() {
        let {props} = this;
        if (props.message) {
            if (props.callBack) {
                props.callBack();
            } else {
                props.prevPage({message: props.message});
            }
        }
    }

    render() {
        return (
            <div>
                <Row style={{borderBottom: '2px solid #777'}}>
                    <Col span={24}>
                        <h2 className='form-headline'>
                            {this.props.acl && this.props.acl.name ? this.props.acl.name : 'Role'}
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
        message: state.acl.message,
        error: state.acl.error,
        processing: state.acl.processing,
        acl: state.acl.acl,
        jwt: state.auth.token,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addAcl: (acl) => {
            dispatch(actions.addAcl(acl))
        },
        editAcl: (id) => {
            dispatch(actions.getAcl(id))
        },
        resetReduxState: () => {
            dispatch(actions._reset())
        }
    };
};

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(General);
export default withRouter(_connectedComponent);