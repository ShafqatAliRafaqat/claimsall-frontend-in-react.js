import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import {Row, Col, Table, Button, Icon, Modal, Spin, Input} from 'antd';
import moment from 'moment';
import * as actions from '../../../store/acl/acl-actions';
import {aclAllowed} from '../../../utils/common-utils';

const confirm = Modal.confirm;

class ACLView extends React.Component {

    componentWillMount() {
        this.props.resetReduxState();
        this.props.setProcessing(true);
    }

    componentDidMount() {
        this.props.resetReduxState();
        this.fetchAcls();
    }

    state = {
        data: null,
        searchFilters: {},
        filters: {},
        sorter: {},
        activeId: -1,
        selectedRowKeys: [],
        expandedRowKeys: []
    };

    showDeleteConfirm = (id) => {
        let {props} = this;
        let _this = this;
        confirm({
            title: 'Are you sure you want to delete selected role(s) ?',
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.setState({selectedRowKeys: []}, () => {
                    props.deleteAcl(id);
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
                    <a className="hover" onClick={() => this.props.history.push({
                        pathname: '/roles/view',
                        state: {id: record.id}
                    })}>
                        {text}
                    </a>
                )
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description'
            },
            {
                title: 'Last Updated',
                dataIndex: 'updated_at',
                key: 'updated_at',
                sorter: (a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix(),
                sortOrder: this.state.sorter.field === 'updated_at' && this.state.sorter.order,
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
                    {
                        aclAllowed('/roles/delete') &&
                        <a className="hover" onClick={() => this.showDeleteConfirm(record.id)}>
                            <Icon type="delete" title='Delete' style={iconStyle}/>
                        </a>
                    }

                    {aclAllowed('/roles/edit') &&
                    <Link to={{pathname: `/roles/edit`, state: {...this.props.location.state, id: record.id}}}>
                        <Icon type="edit" title='Edit' style={iconStyle}/>
                    </Link>
                    }

                    {aclAllowed('/users/all') &&
                    <Link to={{pathname: `/users/roles`, state: {role_code: record.code}}}>
                        Show Users
                    </Link>
                    }

                </div>
            );
        } else {
            return null;
        }
    };

    handleTableChange = (pagination, filters, sorter) => {
        if (filters || sorter) {
            this.setState({
                filters: filters || [],
                sorter: sorter ? {field: sorter.field, order: sorter.order} : {}
            });
        }
    };


    onExpand = (expanded, record) => {
        let expandedRowKeys = [];
        if (this.state.expandedRowKeys.indexOf(record.id) < 0) {
            expandedRowKeys.push(record.id);
        }
        this.setState({expandedRowKeys});
    };

    onInputChange = (e) => {
        let searchVal = e.target.value;

        if (searchVal && searchVal.length) {
            let records = [...this.props.acls];
            const columns = this.columns();

            let filteredRecords = records.filter((record) => {
                for (let i = 0; i < columns.length; i++) {
                    const columnObj = columns[i];
                    if (columnObj && columnObj.dataIndex) {
                        const recordVal = record[columnObj.dataIndex];
                        if (recordVal && recordVal.length && recordVal.toLowerCase().indexOf(searchVal.toLowerCase()) > -1) {
                            return true;
                        }
                    }
                }
                return false;
            });

            this.setState({data: filteredRecords})
        }
        else {
            this.setState({data: null});
        }
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
                           onChange={this.handleTableChange}
                           rowSelection={rowSelection}
                           expandedRowRender={record => this.expandedView(record)}
                           expandedRowKeys={this.state.expandedRowKeys} onExpand={this.onExpand}
                           dataSource={this.state.data ? this.state.data : this.props.acls}
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
        if (aclAllowed('/roles/add')) {
            return (
                <Button className='shadow' style={{fontWeight: 'bold'}}
                        onClick={() => this.props.history.push({pathname: '/roles/add'})}>
                    <Icon type='plus' style={{
                        fontSize: 16
                    }}/> Add Role</Button>
            );
        }

        return null;
    };

    fetchAcls = (pagination = {}) => {
        this.props.fetchAcls(pagination, this.state.searchFilters, this.state.filters, this.state.sorter);
    };

    render() {
        return (
            <div>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={1}/>
                    <Col span={23}>
                        <h3 className='text-left' style={{fontSize: '36px', fontWeight: 900}}>Roles</h3>
                    </Col>
                </Row>
                <Row gutter={32} className='' style={{padding: 12}}>
                    <Col span={24}>
                        <Row>
                            <Col span={3} style={{marginBottom: 13}}>
                                {this.addNew()}
                            </Col>

                            <Col span={8} offset={13}>
                                <div style={{marginBottom: 16}} className='shadow'>
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
        acls: state.acl.acls,
        processing: state.acl.processing,
        chartData: state.acl.chartData,
        pagination: state.acl.tablePagination,
        error: state.acl.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAcls: (pagination, searchFilters, filters, sorter) => {
            dispatch(actions.getAcls({pagination, searchFilters, filters, sorter}))
        },
        deleteAcl: (id) => {
            dispatch(actions.deleteAcl(id))
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

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ACLView);

export default withRouter(_connectedComponent);
