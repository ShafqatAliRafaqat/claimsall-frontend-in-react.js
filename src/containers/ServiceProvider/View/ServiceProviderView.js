import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import {Row, Col, Table, Input, Button, Icon, Modal, Spin} from 'antd';
import moment from 'moment';
import * as actions from '../../../store/organization/organization-actions';
import {fetchOrganizationTypes} from '../../../utils/data-fetcher.js';
import {fetchOrganizations} from '../../../utils/report-fetcher';
import ReportButton from '../../../components/ReportMenu';

const headers = [
    {label: 'Name', key: 'name'},
    {label: 'Type', key: 'organization_type_name'},
    {label: 'Description', key: 'description'},
    {label: 'UAN', key: 'contact_number'},
    {label: 'Email', key: 'email'},
    {label: 'Website', key: 'website'},
    {label: 'NTN', key: 'ntn_number'},
    {label: 'Address', key: 'address'},
    {label: 'Coordinates', key: 'latlng'},
    {label: 'Timing', key: 'timing'}
];

const confirm = Modal.confirm;
let timeOutRef = null;

class OrganizationsView extends React.Component {

    componentWillMount() {
        this.props.setProcessing(true);
    }

    componentDidMount() {
        fetchOrganizationTypes(this.props.providerCode)
            .then(organizationTypeFilters => {
                let filters = {};
                organizationTypeFilters.forEach(type => {
                    filters = {organization_type_id: type.id};
                });

                this.setState({filters}, () => {
                    this.fetchOrganizations();
                });
            }).catch(err => console.log(err));
    };

    state = {
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
            title: 'Are you sure you want to delete selected record(s) ?',
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.setState({selectedRowKeys: []}, () => {
                    props.deleteOrganization(id);
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
                sorter: true,
                sortOrder: this.state.sorter.field === 'name' && this.state.sorter.order,
                render: (text, record) => {
                    return (
                        <a className='hover' onClick={() => {
                            this.props.history.push({pathname: `/${this.props.module}/details`, state: {id: record.id}})
                        }}>
                            {text}
                        </a>);
                }
            },
            {
                title: 'UAN#',
                dataIndex: 'contact_number',
                key: 'contact_number'
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'Website',
                dataIndex: 'website',
                key: 'website'
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

    getRecordActions = (record, index) => {
        let iconStyle = {
            fontSize: 12, color: '#08c', marginRight: 8
        };

        if (this.state.selectedRowKeys.indexOf(record.id) > -1) {
            return (
                <div>
                    <a className="hover" onClick={() => this.showDeleteConfirm(record.id)}>
                        <Icon type="delete" title='Delete' style={iconStyle}/>
                    </a>

                    <Link to={{
                        pathname: `/${this.props.module}/edit`,
                        state: {...this.props.location.state, id: record.id}
                    }}>
                        <Icon type="edit" title='Edit' style={iconStyle}/>
                    </Link>
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

        if (sorter) {
            this.setState({sorter: sorter ? {field: sorter.field, order: sorter.order} : {}}, () => {
                this.fetchOrganizations({...pager});
            });
        }
        else {
            this.fetchOrganizations({...pager});
        }
    };

    onExpand = (expanded, record) => {
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
                    <Table className='thead-black shadow'
                           pagination={this.props.pagination}
                           loading={this.props.processing}
                           columns={this.columns()}
                           onChange={this.handleTableChange}
                           rowSelection={rowSelection}
                           expandedRowRender={record => this.expandedView(record)}
                           expandedRowKeys={this.state.expandedRowKeys} onExpand={this.onExpand}
                           dataSource={this.state.data && this.state.data.length ? this.state.data : this.props.organizations}
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

    deleteAll = () => {
        if (this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0) {
            return (
                <Button className='shadow' type="danger"
                        onClick={() => this.showDeleteConfirm(this.state.selectedRowKeys)}> <Icon type='delete' style={{
                    fontSize: 16, color: 'red'
                }}/> Delete Selected</Button>
            );
        } else {
            return (
                <Button className='shadow' style={{fontWeight: 'bold'}}
                        onClick={() => this.props.history.push({pathname: `/${this.props.module}/add`})}> <Icon
                    type='plus' style={{
                    fontSize: 16
                }}/> Add {this.props.singularName}</Button>
            );
        }
    };

    fetchOrganizations = (pagination = {}) => {
        this.props.fetchOrganizations(pagination, this.state.searchFilters, this.state.filters, this.state.sorter);
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
                this.fetchOrganizations();
            });
        }, 1000);

    };

    onReportDownload = (report) => {
        let {filters, searchFilters} = {...this.state};
        return fetchOrganizations({filters, searchFilters, report})
            .then(users => {
                return Promise.resolve({data: users});
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    };

    render() {
        return (
            <div>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={1}/>
                    <Col span={23}>
                        <h3 className='text-left' style={{fontSize: '36px', fontWeight: 900}}>{this.props.name}</h3>
                    </Col>
                </Row>
                <Row gutter={32} className='' style={{padding: 12}}>
                    <Col span={24}>
                        <Row>
                            <Col span={3}>
                                {this.deleteAll()}
                            </Col>

                            <Col span={15} offset={6}>
                                <Row>
                                    <Col span={10} offset={4}>
                                        <ReportButton headers={headers} filename={`${this.props.module}.csv`}
                                                      onDownload={this.onReportDownload}/> </Col>
                                    <Col span={10}>
                                        <div style={{marginBottom: 16}} className='shadow'>
                                            <Input addonBefore="Search" onChange={this.onInputChange}/>
                                        </div>
                                    </Col>
                                </Row>
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
        organizations: state.organization.organizations,
        processing: state.organization.processing,
        chartData: state.organization.chartData,
        pagination: state.organization.tablePagination,
        error: state.organization.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchOrganizations: (pagination, searchFilters, filters, sorter) => {
            dispatch(actions.getOrganizations({pagination, searchFilters, filters, sorter}))
        },
        deleteOrganization: (id) => {
            dispatch(actions.deleteOrganization(id))
        },
        setPagination: (pagination) => {
            dispatch(actions.setPagination(pagination))
        },
        setProcessing: (processing) => {
            dispatch(actions._setProcessing(processing))
        }
    }
};

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(OrganizationsView);

export default withRouter(_connectedComponent);
