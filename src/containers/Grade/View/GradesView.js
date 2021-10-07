import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import {Row, Col, Table, Button, Icon, Modal, Spin} from 'antd';
import moment from 'moment';
import * as actions from '../../../store/grade/grade-actions';
import {aclAllowed} from '../../../utils/common-utils';

const confirm = Modal.confirm;

class GradesView extends React.Component {

    componentWillMount() {
        this.props.setProcessing(true);
    }

    componentDidMount() {
        this.props.resetReduxState();
        this.fetchGrades();
    }

    state = {
        searchFilters: {},
        filters: {},
        sorter: {},
        activeId: -1,
        selectedRowKeys: [],
        expandedRowKeys: [],
        gradeTypeFilters: []
    };

    showDeleteConfirm = (id) => {
        let {props} = this;
        let _this = this;
        confirm({
            title: 'Are you sure you want to delete selected grade(s) ?',
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.setState({selectedRowKeys: []}, () => {
                    props.deleteGrade(id);
                });
            },
            onCancel() {
            },
        });
    };

    columns = () => {
        return [
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
                sorter: (a, b) => a.title.length - b.title.length,
                sortOrder: this.state.sorter.field === 'title' && this.state.sorter.order,
                render: (text, record) => (
                    <a className="ant-dropdown-link hover" onClick={() => this.props.history.push({
                        pathname: '/grades/details',
                        state: {id: record.id, grade: record}
                    })}>
                        {text}
                    </a>
                ),
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description'
            },
            {
                title: 'Created Date',
                dataIndex: 'created_at',
                key: 'created_at',
                sorter: true,
                sortOrder: this.state.sorter.field === 'created_at' && this.state.sorter.order,
                render: (text) => (
                    <span>
                        {moment(text).format("MM/DD/YY hh:mm:ss")}
                    </span>
                )
            },
            {
                title: (
                    <div>
                        <Icon type='bars' size='large'/>
                    </div>
                ),
                key: 'actions',
                render: (text, record, index) => this.getRecordActions(record, index)
            }
        ];
    };

    getRecordActions = (record) => {
        let iconStyle = {
            fontSize: 12, color: '#08c', marginRight: 8
        };

        if (this.state.selectedRowKeys.indexOf(record.id) > -1) {
            return (
                <div>
                    {aclAllowed('/grades/delete') &&
                    <a className="hover" onClick={() => this.showDeleteConfirm(record.id)}>
                        <Icon type="delete" title='Delete' style={iconStyle}/>
                    </a>
                    }

                    {aclAllowed('/grades/edit') &&
                    <Link to={{pathname: `/grades/edit`, state: {...this.props.location.state, id: record.id}}}>
                        <Icon type="edit" title='Edit' style={iconStyle}/>
                    </Link>
                    }

                </div>
            );
        } else {
            return null;
        }
    };

    onExpand = (expanded, record) => {
        console.log(expanded, record);
        let expandedRowKeys = [];
        if (this.state.expandedRowKeys.indexOf(record.id) < 0) {
            expandedRowKeys.push(record.id);
        }
        this.setState({expandedRowKeys});
    };

    componentDidUpdate() {
        let {location} = this.props;
        if (location.state && location.state.message && location.state.messagerRender) {
            location.state.messagerRender = false;
            setTimeout(() => {
                delete location.state.message;
            }, 2000);
        }
    };

    table = () => {
        if (this.props.processing) {
            return <Spin size='large'/>
        } else {
            const rowSelection = {
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.onSelectChange,
            };
            return (
                <div>
                    {/*{this.props.error ? (*/}
                        {/*<Alert message={"Error"} description={this.props.error} type="error" showIcon/>) : null}*/}

                    {/*{(this.props.location.state && this.props.location.state.message && (this.props.location.state.messagerRender = true)) ? (*/}
                        {/*<Alert message={"Success"} description={this.props.location.state.message} type="success"*/}
                               {/*showIcon/>) : null}*/}

                    <Table rowKey='id' className='thead-black shadow'
                           loading={this.props.processing}
                           columns={this.columns()}
                           rowSelection={rowSelection}
                           expandedRowRender={record => this.expandedView(record)}
                           expandedRowKeys={this.state.expandedRowKeys} onExpand={this.onExpand}
                           dataSource={this.state.data && this.state.data.length ? this.state.data : this.props.grades}
                    />
                </div>
            );
        }
    };

    expandedView = (record) => {
        return (
            <div>
                <p style={{margin: 0}}>{record.description}</p>
            </div>
        );
    };

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({selectedRowKeys});
    };

    addNew = () => {
        if (aclAllowed('/grades/add')) {
            return (
                <Button className='shadow' style={{fontWeight: 'bold'}}
                        onClick={() => this.props.history.push({pathname: '/grades/add'})}>
                    <Icon type='plus' style={{
                        fontSize: 16
                    }}/> Add Grade</Button>
            );
        }
        return null;
    };

    fetchGrades = (pagination = {}) => {
        console.log(this.state);
        this.props.fetchGrades(pagination, this.state.searchFilters, this.state.filters, this.state.sorter);
    };

    render() {
        return (
            <div>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={1}/>
                    <Col span={23}>
                        <h3 className='text-left' style={{fontSize: '36px', fontWeight: 900}}>Grades</h3>
                    </Col>
                </Row>
                <Row gutter={32} className='' style={{padding: 12}}>
                    <Col span={24}>
                        <Row>
                            <Col span={3} style={{marginBottom: 13}}>
                                {this.addNew()}
                            </Col>

                            <Col span={8} offset={13}/>
                        </Row>
                        <Row>
                            <Col span={24}>
                                {this.table()}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        grades: state.grade.grades,
        processing: state.grade.processing,
        chartData: state.grade.chartData,
        pagination: state.grade.tablePagination,
        error: state.grade.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchGrades: (pagination, searchFilters, filters, sorter) => {
            dispatch(actions.getGrades({pagination, searchFilters, filters, sorter}))
        },
        deleteGrade: (id) => {
            dispatch(actions.deleteGrade(id))
        },
        setPagination: (pagination) => {
            dispatch(actions.setPagination(pagination))
        },
        setProcessing: (processing) => {
            dispatch(actions._setProcessing(processing))
        },
        resetReduxState: () => {
            dispatch(actions._reset())
        }
    }
};

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(GradesView);

export default withRouter(_connectedComponent);
