import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Row, Col, Spin, Alert} from 'antd';
import * as actions from '../../../store/grade/grade-actions';
import GeneralForm from '../../../components/Forms/GradeGeneralForm';

class General extends React.Component {

    componentDidMount() {
        this.props.resetReduxState();

        // load edit form
        if (this.props.location && this.props.location.state && this.props.location.state.id) {
            this.props.editGrade(this.props.location.state.id);
        }
    }

    onFormSubmit = (form) => {
        console.log(form);
        this.props.addGrade(form);
    };

    form = () => {
        let jsx;
        if (this.props.processing) {
            jsx = <Spin size='large'/>
        } else {
            jsx = (
                <GeneralForm onSubmit={this.onFormSubmit} enableReinitialize={true} initialValues={this.props.grade}
                             readOnly={this.props.readOnly}/>
            );
        }

        return jsx;
    };

    componentDidUpdate() {
        let {props} = this;
        if (props.message) {
            props.history.push({pathname: '/grades/all', state: {message: props.message}});
        }
    }

    render() {
        return (
            <div>
                <Row style={{borderBottom: '2px solid #777'}}>
                    <Col span={24}>
                        <h2 className='form-headline'>
                            Grade
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
        message: state.grade.message,
        error: state.grade.error,
        processing: state.grade.processing,
        grade: state.grade.grade,
        jwt: state.auth.token
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addGrade: (grade) => {
            dispatch(actions.addGrade(grade))
        },
        editGrade: (id) => {
            dispatch(actions.getGrade(id))
        },
        resetReduxState: () => {
            dispatch(actions._reset())
        }
    };
};

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(General);
export default withRouter(_connectedComponent);