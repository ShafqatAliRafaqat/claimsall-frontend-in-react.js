import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import {Row, Col, Table, Button, Icon, Modal, Spin, Input} from 'antd';
import moment from 'moment';
import * as actions from '../../../store/policy/policy-actions';
import {aclAllowed, toDisplayPolicyType, toDisplayPolicyLevel} from '../../../utils/common-utils';

const confirm = Modal.confirm;
let timeOutRef = null;

class PoliciesView extends React.Component {

    componentWillMount() {
        this.props.resetReduxState();
        this.props.setProcessing(true);
    }

    componentDidMount() {
        this.props.resetReduxState();
        this.fetchPolicies();
    }

    state = {
        searchFilters: {},
        filters: {},
        sorter: {},
        activeId: -1,
        selectedRowKeys: [],
        expandedRowKeys: [],
        typeFilters: [{text: 'Organization', value: 'Organization'}, {text: 'Grade', value: 'Grade'}]
    };

    showDeleteConfirm = (id) => {
        let {props} = this;
        let _this = this;
        confirm({
            title: 'Are you sure you want to delete selected policy(s) ?',
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.setState({selectedRowKeys: []}, () => {
                    props.deletePolicy(id);
                });
            },
            onCancel() {
            },
        });
    };

    columns = () => {
        return [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name.length - b.name.length,
                sortOrder: this.state.sorter.field === 'name' && this.state.sorter.order,
                render: (text, record) => (
                    <a className="ant-dropdown-link hover" onClick={() => this.props.history.push({
                        pathname: '/policies/details',
                        state: {id: record.id, policy: record}
                    })}>
                        {text}
                    </a>
                ),
            },
            {
                title: 'Short Code',
                dataIndex: 'short_code',
                key: 'short_code'
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description'
            },
            {
                title: 'Type',
                dataIndex: 'policy_type',
                key: 'policy_type',
                render: (text) => toDisplayPolicyType(text)
            },
            {
                title: 'Level',
                dataIndex: 'policy_level',
                key: 'policy_level',
                render: (text) => toDisplayPolicyLevel(text)
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
                    {aclAllowed('/policies/delete') &&
                    <a className="hover" onClick={() => this.showDeleteConfirm(record.id)}>
                        <Icon type="delete" title='Delete' style={iconStyle}/>
                    </a>
                    }

                    {aclAllowed('/policies/edit') &&
                    <Link to={{pathname: `/policies/edit`, state: {...this.props.location.state, id: record.id}}}>
                        <Icon type="edit" title='Edit' style={iconStyle}/>
                    </Link>
                    }
                </div>
            );
        } else {
            return null;
        }
    };

    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.props.pagination};
        pager.current = pagination.current;
        this.props.setPagination(pager);

        if (filters || sorter) {
            this.setState({
                filters: filters || [],
                sorter: sorter ? {field: sorter.field, order: sorter.order} : {}
            }, () => {
                this.fetchPolicies({...pager});
            });
        } else {
            this.fetchPolicies({...pager});
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

    onInputChange = (e) => {
        let filters = null;
        let searchVal = e.target.value;

        if (searchVal && searchVal.length) {
            let columns = this.columns();

            filters = {};
            columns.forEach(column => {
                if (column.dataIndex && ["created_at"].indexOf(column.dataIndex) < 0) {
                    filters[column.dataIndex] = searchVal;
                }
            });
        }

        clearTimeout(timeOutRef);
        timeOutRef = setTimeout(() => {
            this.setState({searchFilters: filters}, () => {
                this.fetchPolicies();
            });
        }, 1000);
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
                           pagination={this.props.pagination}
                           loading={this.props.processing}
                           columns={this.columns()}
                           onChange={this.handleTableChange}
                           rowSelection={rowSelection}
                           expandedRowRender={record => this.expandedView(record)}
                           expandedRowKeys={this.state.expandedRowKeys} onExpand={this.onExpand}
                           dataSource={this.state.data && this.state.data.length ? this.state.data : this.props.policies}
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
        if (aclAllowed('/policies/add')) {
            return (
                <Button className='shadow' style={{fontWeight: 'bold'}}
                        onClick={() => this.props.history.push({pathname: '/policies/add'})}>
                    <Icon type='plus' style={{
                        fontSize: 16
                    }}/> Add Policy</Button>
            );
        }
        return null;
    };

    fetchPolicies = (pagination = {}) => {
        this.props.fetchPolicies(pagination, this.state.searchFilters, this.state.filters, this.state.sorter);
    };

    render() {
        return (
            <div>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={1}/>
                    <Col span={23}>
                        <h3 className='text-left' style={{fontSize: '36px', fontWeight: 900}}>Policies</h3>
                    </Col>
                </Row>
                <Row gutter={32} className='' style={{padding: 12}}>
                    <Col span={24}>
                        <Row>
                            <Col span={3} style={{marginBottom: 13}}>
                                {this.addNew()}
                            </Col>

                            <Col span={8} offset={13}>
                                <div className='shadow' style={{marginBottom: 16}}>
                                    <Input addonBefore="Search" onChange={this.onInputChange}/>
                                </div>
                            </Col>
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
        policies: state.policy.policies,
        processing: state.policy.processing,
        chartData: state.policy.chartData,
        pagination: state.policy.tablePagination,
        error: state.policy.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPolicies: (pagination, searchFilters, filters, sorter) => {
            dispatch(actions.getPolicies({pagination, searchFilters, filters, sorter}))
        },
        deletePolicy: (id) => {
            dispatch(actions.deletePolicy(id))
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

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(PoliciesView);

export default withRouter(_connectedComponent);
