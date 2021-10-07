import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import {Row, Col, Table, Input, Button, Icon, Modal, Spin, Menu, Dropdown, message} from 'antd';
import ReportButton from '../../../components/ReportMenu';
import {aclAllowed, validImportFile, uploadImportFile} from '../../../utils/common-utils';
import {fetchOrganizationGrades, fetchOrganizationRoles} from '../../../utils/data-fetcher';
import {fetchUsers} from '../../../utils/report-fetcher';

import * as actions from '../../../store/user/user-actions';

const confirm = Modal.confirm;

const headers = [
    {label: 'CNIC', key: 'cnic'},
    {label: 'First Name', key: 'first_name'},
    {label: 'Last Name', key: 'last_name'},
    {label: 'Email', key: 'email'},
    {label: 'Contact #', key: 'contact_number'},
    {label: 'Address', key: 'address'},
    {label: 'DOB', key: 'dob'},
    {label: 'Age', key: 'age'},
    {label: 'Gender', key: 'gender'},
    {label: 'Blood Group', key: 'blood_group'},
    {label: 'Medical Conditions', key: 'medical_conditions'},
    {label: 'Doctor', key: 'isDoctor'},
    {label: 'Created At', key: 'created_at'},
];

let timeOutRef = null;

class UsersView extends React.Component {

    componentWillMount() {
        this.props.setProcessing(true);
    }

    extractOrganizationId = (props) => {
        return props.location && props.location.state ? props.location.state.organization_id : null;
    };

    loadFilters = (organization_id) => {
        fetchOrganizationGrades(organization_id)
            .then(grades => {
                let gradeFilters = [];

                grades.forEach(grade => {
                    gradeFilters.push({text: grade.name, value: grade.id});
                });

                this.setState({gradeFilters});

                return fetchOrganizationRoles(organization_id);
            })
            .then(roles => {
                let roleFilters = [];

                roles.forEach(role => {
                    roleFilters.push({text: role.name, value: role.code});
                });

                this.setState({roleFilters});

            })
            .catch(err => {
                console.log(err);
            });
    };

    componentDidMount() {
        let {props} = this;
        props.resetReduxState();

        const organization_id = this.extractOrganizationId(props);
        this.loadFilters(organization_id);

        const filters = {};
        filters.status = props.user_status;

        if (props.location && props.location.state) {
            filters.role_code = props.location.state.role_code;
        }

        this.setState({filters}, () => {
            if (organization_id) {
                filters.organization_id = organization_id;
                this.setState({filters, organization_id}, () => {
                    this.fetchUsers();
                });
            }
            else {
                this.fetchUsers();
            }
        });

    }

    state = {
        searchFilters: {},
        filters: {},
        sorter: {},
        modalVisible: false,
        activeId: -1,
        selectedRowKeys: [],
        expandedRowKeys: [],
        organization_id: null,
        gradeFilters: [],
        roleFilters: [],
        fileUploading: false
    };


    getReportHeaders = () => {
        let _headers = [...headers];

        if (!this.props.showSuperActions || (this.props.location && this.props.location.state && this.props.location.state.organization_id)) {
            _headers.push({label: 'Employee Code', key: 'employee_code'});
            _headers.push({label: 'Date Joining', key: 'date_joining'});
            _headers.push({label: 'Date Confirmation', key: 'date_confirmation'});
            _headers.push({label: 'Basic Salary', key: 'basic_salary'});
            _headers.push({label: 'Gross Salary', key: 'gross_salary'});
            _headers.push({label: 'Role', key: 'adminRoleTitle'});
            _headers.push({label: 'Grade', key: 'grade'});
            _headers.push({label: 'Team', key: 'team'});
        }

        return _headers;
    };

    columns = () => {
        let columns = [
            {
                title: 'First Name',
                dataIndex: 'first_name',
                key: 'first_name',
                sorter: true,
                sortOrder: this.state.sorter.field === 'first_name' && this.state.sorter.order,
                render: (text, record) => (
                    <a className="ant-dropdown-link hover" onClick={() => this.props.history.push({
                        pathname: this.props.location.state && this.props.location.state.organization_id ? '/organizations/users/details' : '/users/details',
                        state: {...this.props.location.state, id: record.id}
                    })}>
                        {text}
                    </a>
                ),
            },
            {
                title: 'Last Name',
                dataIndex: 'last_name',
                key: 'last_name',
                sorter: true,
                sortOrder: this.state.sorter.field === 'last_name' && this.state.sorter.order
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            }
        ];

        if (!this.props.showSuperActions || (this.props.location && this.props.location.state && this.props.location.state.organization_id)) {
            columns.push(
                {
                    title: 'Employee Code',
                    dataIndex: 'employee_code',
                    key: 'employee_code'
                }
            );

            if (this.props.user_status !== 'Pending') {
                columns.push(
                    {
                        title: 'Grade',
                        dataIndex: 'grade',
                        key: 'grade_id',
                        filters: this.state.gradeFilters,
                        filteredValue: this.state.filters.grade_id || []
                    }
                );

                columns.push(
                    {
                        title: 'Role',
                        dataIndex: 'administrative_role',
                        key: 'role_code',
                        filters: this.state.roleFilters,
                        filteredValue: this.state.filters.role_code || [],
                        render: (object) => {
                            return object ? object.title : ''
                        }
                    }
                );
            }
        }
        else {
            columns.push(
                {
                    title: 'Contact #',
                    dataIndex: 'contact_number',
                    key: 'contact_number'
                }
            );
            columns.push(
                {
                    title: 'CNIC',
                    dataIndex: 'cnic',
                    key: 'cnic'
                }
            );
        }

        columns.push(
            {
                title: (
                    <div>
                        <Icon type='bars' size='large'/>
                    </div>
                ),
                key: 'actions',
                render: (text, record, index) => this.getRecordActions(record, index)
            }
        );

        return columns;
    };

    registerDoctor = (user_id, code, _module) => {
        message.info(`Fill required information`);
        this.props.setUser({id: user_id});
        this.props.history.push({pathname: `/${_module}/add/general`, state: {id: user_id}});
    };

    serviceProviderMenu = (user_id, roles) => {
        let jsx = null;
        let menus = [];

        if (roles && roles.indexOf('doctor') < 0) {
            menus.push({code: 'doctor', text: 'Register as Doctor', module: 'doctors'});
        }

        if (menus && menus.length) {
            let menuJsx = (
                <Menu>
                    {menus.map(menu => {
                        return (
                            <Menu.Item key={menu.code}>
                                <a className='hover' onClick={() => {
                                    this.registerDoctor(user_id, menu.code, menu.module)
                                }}>{menu.text}</a>
                            </Menu.Item>
                        );
                    })}
                </Menu>
            );

            jsx = (
                <Dropdown overlay={menuJsx}>
                    <a className="ant-dropdown-link hover" style={{paddingRight: '12px', paddingLeft: '12px'}}>
                        More actions
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
            let {props} = this;
            return (
                <div>
                    {(props.showSuperActions && !(props.location && props.location.state && props.location.state.organization_id))
                    &&
                    this.serviceProviderMenu(record.id, record['role_codes'])}

                    {aclAllowed('/users/edit') && this.editUserMenu(record, iconStyle)}

                    {aclAllowed('/users/delete') && this.deleteUserMenu(record, iconStyle)}
                </div>
            );
        } else {
            return null;
        }
    };

    deleteUserMenu = (record, iconStyle) => {
        if (this.props.user_status === 'Pending') {
            let _iconStyle = {...iconStyle};
            _iconStyle.fontSize = 24;
            _iconStyle.color = 'red';

            return (
                <a className="hover" onClick={() => this.showDeleteConfirm(record.id)}>
                    <Icon type="close" title={this.state.organization_id ? 'Unlink' : 'Decline'} style={_iconStyle}/>
                </a>
            );
        }
        else {
            return (
                <a className="hover" onClick={() => this.showDeleteConfirm(record.id)}>
                    <Icon type="delete" title={this.state.organization_id ? 'Unlink' : 'Delete'} style={iconStyle}/>
                </a>
            );
        }
    };


    editUserMenu = (record, iconStyle) => {
        if (this.props.user_status === 'Pending') {
            let _iconStyle = {...iconStyle};
            _iconStyle.fontSize = 24;
            _iconStyle.color = 'darkgreen';
            return (
                <Link to={{
                    pathname: this.props.location.state && this.props.location.state.organization_id ? '/organizations/users/edit' : '/users/review',
                    state: {...this.props.location.state, id: record.id, pendingUser: true}
                }}>
                    <Icon type="check" title='Review' style={_iconStyle}/>
                </Link>
            );
        } else {
            return (
                <Link to={{
                    pathname: this.props.location.state && this.props.location.state.organization_id ? '/organizations/users/edit' : '/users/edit',
                    state: {...this.props.location.state, id: record.id}
                }}>
                    <Icon type="edit" title='Edit' style={iconStyle}/>
                </Link>
            );
        }
    };

    showDeleteConfirm = (id) => {
        let {props} = this;
        let _this = this;
        confirm({
            title: 'Are you sure you want to delete selected user(s) ?',
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.setState({selectedRowKeys: []}, () => {
                    props.deleteUser(id, props.location.state && props.location.state.organization_id ? props.location.state.organization_id : null);
                });
            },
            onCancel() {
            },
        });
    };

    fetchUsers = (pagination = {}) => {
        this.props.fetchUsers(pagination, this.state.searchFilters, this.state.filters, this.state.sorter);
    };

    onInputChange = (e) => {
        let filters = null;
        let searchVal = e.target.value;

        if (searchVal && searchVal.length) {
            let columns = this.columns();

            filters = {};
            columns.forEach(column => {
                if (column.dataIndex && ["created_at", "grade_title", "grade", "grade_id", "role_code", "administrative_role"].indexOf(column.dataIndex) < 0) {
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


    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.props.pagination};
        pager.current = pagination.current;
        this.props.setPagination(pager);


        if (filters && !filters.organization_id) {
            filters.organization_id = this.extractOrganizationId(this.props);
        }

        if (sorter || filters) {
            this.setState({
                    filters: filters || [],
                    sorter: sorter ? {field: sorter.field, order: sorter.order} : {}
                },
                () => {
                    this.fetchUsers({...pager});
                });
        }
        else {
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

    componentDidUpdate(prevProps, prevState, prevContext) {
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
                           dataSource={this.props.users}
                    />
                </div>
            );
        }
    };

    expandedView = (record) => {
        return (
            <div>
                <p style={{margin: 0}}>{`${record['first_name']} ${record['last_name']}, ${record.address}`}</p>
            </div>
        );
    };

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    };

    deleteAll = () => {
        if (this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0) {
            if (!aclAllowed('/users/delete-all')) {
                return null;
            }

            return (
                <Button className='shadow' type="danger"
                        onClick={() => this.showDeleteConfirm(this.state.selectedRowKeys)}> <Icon
                    type='delete' style={{
                    fontSize: 16, color: 'red'
                }}/> {this.state.organization_id ? "Unlink" : "Delete"} Selected</Button>
            );
        } else {
            if (!aclAllowed('/users/delete') || this.props.user_status === 'Pending') {
                return null;
            }
            let locState = {...this.props.location.state};
            if (locState && locState.id) {
                delete locState.id;
            }
            return (
                <Button className='shadow' style={{fontWeight: 'bold'}} onClick={() => this.props.history.push({
                    pathname: this.props.location.state && this.props.location.state.organization_id ? '/organizations/users/add' : '/users/add',
                    state: locState
                })}> <Icon type='plus' style={{
                    fontSize: 16
                }}/> Add {this.props.showSuperActions ? 'Users' : 'Employee'}</Button>
            );
        }
    };

    uploadFile = (file, api) => {
        this.setState({fileUploading: true});
        uploadImportFile(file, api)
            .then((resp) => {
                this.setState({fileUploading: false});
            });
    };

    bulkImport = () => {
        // return null;

        if (this.props.showSuperActions || !aclAllowed('/users/bulk-import')) {
            return null;
        }

        let inputFile = <input type={'file'} hidden ref={input => this.bulkImportElement = input} accept=".xls,.xlsx"
                               onChange={(e) => {
                                   let {files} = e.target;
                                   if (!files || !files.length) {
                                       message.error('Invalid file provided');
                                   }
                                   else {
                                       let file = files[0];
                                       if (validImportFile(file)) {
                                           this.uploadFile(file);
                                       }
                                   }
                               }}/>;

        if (this.state.fileUploading) {
            return <Spin/>
        }
        else {
            return (
                <div>
                    {inputFile}
                    <Button className='shadow' style={{fontWeight: 'bold', marginLeft: '60px'}}
                            onClick={() => {
                                this.bulkImportElement.click();
                            }}>
                        <Icon type='plus' style={{fontSize: 16}}/>
                        Import Employees
                    </Button>
                </div>
            );
        }
    };

    bulkImportDependents = () => {
        return null;
        if (this.props.showSuperActions || !aclAllowed('/users/bulk-import')) {
            return null;
        }

        let inputFile = <input type={'file'} hidden ref={input => this.bulkImportDependentsElement = input}
                               accept=".xls,.xlsx"
                               onChange={(e) => {
                                   let {files} = e.target;
                                   if (!files || !files.length) {
                                       message.error('Invalid file provided');
                                   }
                                   else {
                                       let file = files[0];
                                       if (validImportFile(file)) {
                                           this.uploadFile(file, 'import-dependents');
                                       }
                                   }
                               }}/>;

        if (this.state.fileUploading) {
            return <Spin/>
        }
        else {
            return (
                <div>
                    {inputFile}
                    <Button className='shadow' style={{fontWeight: 'bold'}}
                            onClick={() => {
                                this.bulkImportDependentsElement.click();
                            }}>
                        <Icon type='plus' style={{fontSize: 16}}/>
                        Import Dependents
                    </Button>
                </div>
            );
        }
    };

    header = () => {
        if (this.props.location && this.props.location.state && this.props.location.state.organization_id) {
            let {organization} = this.props.location.state;
            return (
                <Col span={24} className='shadow' style={{marginBottom: 24}}>
                    <Row type="flex" justify="space-around" align="middle">
                        <Col span={11} style={{textAlign: 'left', paddingLeft: 36}}>
                            <Icon style={{color: 'blue', fontSize: 52, marginRight: 10}} type='appstore'/>
                            <span style={{fontSize: 48}}>
                                <Link to={{
                                    pathname: `/organizations/details`,
                                    state: {
                                        ...this.props.location.state,
                                        id: organization.id,
                                        backUrl: '/organizations/users/all',
                                        backText: organization.name
                                    }
                                }}>
                                {organization.name}
                            </Link>
                                </span>
                        </Col>

                        <Col span={12}>
                            <Row type="flex" justify="space-around" align="middle" gutter={24}>
                                {[
                                    {value: organization['organization_type_name'], type: 'Industry'},
                                    {value: organization['contact_number'], type: 'UAN #'},
                                    {value: organization.email, type: 'Email'},
                                    {value: organization['ntn_number'], type: 'NTN #'},
                                ]
                                    .map((prop => {
                                        return (
                                            <Col span={12} key={prop.type}>
                                                <span style={{fontSize: 24}}>
                                                    {prop.value}
                                                </span>
                                                <span style={{fontSize: 16, display: 'block'}}>
                                                    {prop.type}
                                                </span>
                                            </Col>
                                        );
                                    }))}
                            </Row>
                        </Col>

                        <Col span={1}>
                            <Link to={{
                                pathname: `/organizations/edit`,
                                state: {
                                    ...this.props.location.state,
                                    id: organization.id,
                                    backUrl: '/organizations/users/all',
                                    backText: organization.name
                                }
                            }}>
                                <Icon type="edit" title='Edit'/>
                            </Link>
                        </Col>

                    </Row>
                </Col>
            );
        }
        else {
            return (
                <Col span={23} offset={1}>
                    <h3 className='text-left' style={{
                        fontSize: '36px',
                        fontWeight: 900
                    }}>
                        {this.props.showSuperActions ? 'Users' : `${this.props.employee_status || ''} Employees`}
                    </h3>
                </Col>
            );
        }
    };

    onReportDownload = (report) => {
        let {filters, searchFilters} = {...this.state};
        return fetchUsers({filters, searchFilters, report})
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
                    {this.header()}
                </Row>
                <Row gutter={32} className='' style={{padding: 12}}>
                    <Col span={24}>
                        <Row>
                            <Col span={3}>
                                {this.deleteAll()}
                            </Col>

                            <Col span={6}>
                                {this.state.fileUploading && <Spin />}
                                {!this.state.fileUploading &&
                                <Row>
                                    <Col span={12}>
                                        {this.bulkImport()}
                                    </Col>

                                    <Col span={12}>
                                        {this.bulkImportDependents()}
                                    </Col>
                                </Row>
                                }
                            </Col>

                            <Col span={15}>
                                <Row>
                                    <Col span={10} offset={4}>
                                        <ReportButton headers={this.getReportHeaders()} filename={"users.csv"}
                                                      onDownload={this.onReportDownload}/>
                                    </Col>
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
        chartData: state.user.chartData,
        pagination: state.user.tablePagination,
        showSuperActions: !state.auth.organization_id,
        acl: state.auth.acl,
        error: state.user.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUsers: (pagination, searchFilters, filters, sorter) => {
            dispatch(actions.getUsers({pagination, searchFilters, filters, sorter}))
        },
        deleteUser: (id, organization_id) => {
            dispatch(actions.deleteUser(id, organization_id))
        },
        setPagination: (pagination) => {
            dispatch(actions.setPagination(pagination))
        },
        setProcessing: (processing) => {
            dispatch(actions._setProcessing(processing))
        },
        setUser: (user) => {
            dispatch(actions._setUser(user))
        },
        resetReduxState: () => {
            dispatch(actions._reset())
        }
    }
};

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(UsersView);

export default withRouter(_connectedComponent);