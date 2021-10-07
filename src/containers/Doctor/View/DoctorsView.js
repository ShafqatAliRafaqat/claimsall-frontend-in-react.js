import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import {Row, Col, Table, Input, Button, Icon, Modal, Spin, Menu, Dropdown} from 'antd';
import moment from 'moment';
import {registerDoctor} from '../../../utils/data-fetcher';
import {fetchUsers} from '../../../utils/report-fetcher';
import ReportButton from '../../../components/ReportMenu';

import * as actions from '../../../store/user/user-actions';

const confirm = Modal.confirm;

let timeOutRef = null;

const headers = [
    {label: 'CNIC', key: 'cnic'},
    {label: 'First Name', key: 'first_name'},
    {label: 'Last Name', key: 'last_name'},
    {label: 'Email', key: 'email'},
    {label: 'Contact #', key: 'contact_number'},
    {label: 'Address', key: 'address'},
    {label: 'Contact #', key: 'contact_number'},
    {label: 'DOB', key: 'dob'},
    {label: 'Medical Council #', key: 'medical_council_no'},
    {label: 'Business Address', key: 'business_address'},
    {label: 'Business Latitude', key: 'business_latitude'},
    {label: 'Business Longitude', key: 'business_longitude'},
    {label: 'Business Timing', key: 'business_timing'},
    {label: 'Gender', key: 'gender'},
    {label: 'Created At', key: 'created_at'},
];

class DoctorsView extends React.Component {

    componentWillMount() {
        this.props.resetRedux();
        this.props.setProcessing(true);
    }

    fetchDoctors = (status = 'Approved') => {
        let filters = {role_code: this.props.providerCode, role_user_status: status};
        this.setState({filters, selectedRowKeys: []}, () => {
            this.fetchUsers();
        });
    };

    componentDidMount() {
        this.fetchDoctors();
    };

    state = {
        searchFilters: {},
        filters: {},
        sorter: {},
        activeId: -1,
        selectedRowKeys: [],
        expandedRowKeys: [],
        statusTypeFilters: [
            {text: 'Pending', value: 'Pending'},
            {text: 'Approved', value: 'Approved'}
        ]
    };

    showDeleteConfirm = (id, role_code) => {
        console.log(role_code);
        let {props} = this;
        let _this = this;
        confirm({
            title: _this.state.filters.role_user_status === 'Approved' ? 'Are you sure you want to unregister ?' : 'Are you sure you want to remove the Request ?',
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.setState({selectedRowKeys: []}, () => {
                    props.deleteUser(id, role_code);
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
                dataIndex: 'first_name',
                key: 'first_name',
                sorter: (a, b) => a['first_name'].length - b['first_name'].length,
                sortOrder: this.state.sorter.field === 'first_name' && this.state.sorter.order,
                render: (text, record) => {
                    return (
                        <Link to={{
                            pathname: `/${this.props.module}/details/general`,
                            state: {...this.props.location.state, id: record.id}
                        }}>
                            {text}
                        </Link>
                    );
                }
            },
            {
                title: 'Contact #',
                dataIndex: 'contact_number',
                key: 'contact_number'
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
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


    registerDoctor = (user_id, code) => {
        registerDoctor(user_id, code)
            .then(() => {
                this.props.history.push(`/${this.props.module}/add/qualification`);
            })
            .catch(err => {
                console.log(err);
            });
    };


    serviceProviderMenu = (user_id, roles) => {
        let jsx = null;
        let menus = [];
        if (roles && roles.indexOf('doctor') < 0) {
            menus.push({code: 'doctor', text: 'Register as Doctor'});
        }

        if (roles && roles.indexOf('dentist') < 0) {
            menus.push({code: 'dentist', text: 'Register as Dentist'});
        }

        if (menus && menus.length) {
            let menuJsx = (
                <Menu>
                    {menus.map(menu => {
                        return (
                            <Menu.Item key={menu.code}>
                                <a className='hover' onClick={() => {
                                    this.registerDoctor(user_id, menu.code)
                                }}>{menu.text}</a>
                            </Menu.Item>
                        );
                    })}
                </Menu>
            );

            jsx = (
                <Dropdown overlay={menuJsx}>
                    <a className="ant-dropdown-link hover">
                        More actions <Icon type="down"/>
                    </a>
                </Dropdown>
            );
        }

        return jsx;
    };

    getRecordActions = (record) => {
        let iconStyle = {
            fontSize: 12, color: '#08c', marginRight: 8
        };

        if (this.state.selectedRowKeys.indexOf(record.id) > -1) {
            return (
                <div>
                    <a className="hover" onClick={() => this.showDeleteConfirm(record.id, this.props.providerCode)}>
                        <Icon type="delete" title='Unregister' style={iconStyle}/>
                    </a>

                    {this.editUserMenu(record, iconStyle)}
                </div>
            );
        }
        else {
            return null;
        }
    };

    editUserMenu = (record, iconStyle) => {
        if (this.state.filters.role_user_status === 'Pending') {
            let _iconStyle = {...iconStyle};
            _iconStyle.fontSize = 24;
            _iconStyle.color = 'darkgreen';
            return (
                <Link to={{
                    pathname: `/${this.props.module}/add/general`,
                    state: {...this.props.location.state, id: record.id, pendingDoctor : true}
                }}>
                    <Icon type="check" title='Review' style={_iconStyle}/>
                </Link>
            );
        } else {
            return (
                <Link to={{
                    pathname: `/${this.props.module}/add/general`,
                    state: {...this.props.location.state, id: record.id}
                }}>
                    <Icon type="edit" title='Edit' style={iconStyle}/>
                </Link>
            );
        }
    };


    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.props.pagination};
        pager.current = pagination.current;
        this.props.setPagination(pager);

        if (sorter) {
            this.setState(
                {
                    sorter: sorter ? {field: sorter.field, order: sorter.order} : {}
                }, () => {
                    this.fetchUsers({...pager});
                });
        } else {
            this.fetchUsers({...pager});
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
                    <Table className='thead-black shadow'
                           rowKey='id'
                           pagination={this.props.pagination}
                           loading={this.props.processing}
                           columns={this.columns()}
                           onChange={this.handleTableChange}
                           rowSelection={rowSelection}
                           expandedRowRender={record => this.expandedView(record)}
                           expandedRowKeys={this.state.expandedRowKeys} onExpand={this.onExpand}
                           dataSource={this.state.data && this.state.data.length ? this.state.data : this.props.users}
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
                        onClick={() => this.showDeleteConfirm(this.state.selectedRowKeys, this.props.providerCode)}>
                    <Icon type='delete' style={{
                        fontSize: 16, color: 'red'
                    }}/> Unregister Selected</Button>
            );
        } else {
            return (
                <Button className='shadow' style={{fontWeight: 'bold'}}
                        onClick={() => this.props.history.push({pathname: `/${this.props.module}/add/general`})}> <Icon
                    type='plus' style={{
                    fontSize: 16
                }}/> Add {this.props.singularName}</Button>
            );
        }
    };

    fetchUsers = (pagination = {}) => {
        console.log(this.state);
        this.props.fetchUsers(pagination, this.state.searchFilters, this.state.filters, this.state.sorter);
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
                this.fetchUsers();
            });
        }, 1000);
    };

    onReportDownload = (report) => {
        this.setState({reportDownloading: true});
        let {filters, searchFilters} = {...this.state};
        return fetchUsers({filters, searchFilters, report})
            .then(users => {
                this.setState({reportDownloading: false});
                return Promise.resolve({data: users});
            })
            .catch((err) => {
                this.setState({reportDownloading: false});
                return Promise.reject(err);
            });
    };

    render() {
        return (
            <div>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={23} offset={1}>
                        <h3 className='text-left' style={{fontSize: '36px', fontWeight: 900}}>
                            {this.props.name}
                        </h3>
                    </Col>
                </Row>

                <Row gutter={32} className='' style={{padding: 12}}>
                    <Col span={24}>
                        <Row>
                            <Col span={4}>
                                {this.deleteAll()}
                            </Col>

                            <Col span={5}>
                                <Button className='shadow' style={{fontWeight: 'bold'}}
                                        onClick={() => this.fetchDoctors(this.state.filters.role_user_status === 'Approved' ? 'Pending' : 'Approved')}>
                                    Show {this.state.filters.role_user_status === 'Approved' ? 'Pending' : 'Approved'} {this.props.name}
                                </Button>
                            </Col>

                            <Col span={15} >
                                <Row>
                                    <Col span={10} offset={4}>
                                        <ReportButton headers={headers} filename={"doctors.csv"}
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
        users: state.user.users,
        processing: state.user.processing,
        pagination: state.user.tablePagination,
        error: state.user.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUsers: (pagination, searchFilters, filters, sorter) => {
            dispatch(actions.getUsers({pagination, searchFilters, filters, sorter}))
        },
        deleteUser: (id, role_code) => {
            dispatch(actions.deleteUser(id, undefined, role_code))
        },
        setPagination: (pagination) => {
            dispatch(actions.setPagination(pagination))
        },
        setProcessing: (processing) => {
            dispatch(actions._setProcessing(processing))
        },
        resetRedux: () => dispatch(actions._reset())
    }
};

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DoctorsView);

export default withRouter(_connectedComponent);
