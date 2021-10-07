import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Row, Col, Table, Input, Spin} from 'antd';
import moment from 'moment';
import * as actions from '../../../store/claim/claim-actions';
import {idToName} from '../../../utils/common-utils';


let timeOutRef = null;

class ClaimsViewAll extends React.Component {

    componentWillMount() {
        this.props.setProcessing(true);
    }

    componentDidMount() {
        this.props.resetReduxState();
        if (this.props.location.state && this.props.location.state.filter) {
            this.setState({filters: {status: this.props.location.state.filter}}, () => {
                this.fetchClaims();
            })
        }
        else {
            this.fetchClaims();
        }
    }

    state = {
        searchFilters: {},
        filters: {},
        sorter: {},
        activeId: -1,
        selectedRowKeys: [],
        expandedRowKeys: [],
        claimTypeFilters: [
            {text: 'In-Patient', value: '1'},
            {text: 'Out-Patient', value: '2'},
            {text: 'Maternity', value: '3'}
        ],
        claimStatusFilters: [
            {text: 'Pending', value: 'Pending'},
            {text: 'On Hold', value: 'On Hold'},
            {text: 'Declined', value: 'Decline'},
            {text: 'Approved', value: 'Approved'}
        ]
    };

    columns = () => {
        return [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                sorter: true,
                sortOrder: this.state.sorter.field === 'id' && this.state.sorter.order,
                render: (text, record) => (
                    <a className="ant-dropdown-link hover"
                       onClick={() => this.props.history.push({
                           pathname: '/claims/view',
                           state: {id: record.id}
                       })}>
                        {record['serial_no'] ? record['serial_no'] : text}
                    </a>
                ),
            },
            {
                title: 'Title',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Type',
                dataIndex: 'claim_type_id',
                key: 'claim_type_id',
                filters: this.state.claimTypeFilters,
                filteredValue: this.state.filters.claim_type_id || [],
                render: (text) => <span>{idToName(text)}</span>
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                filters: this.state.claimStatusFilters,
                filteredValue: this.state.filters.status || []
            },
            {
                title: 'Amount Requested',
                dataIndex: 'claim_amount',
                key: 'claim_amount'
            },
            {
                title: 'Employee Code',
                dataIndex: 'employee_code',
                key: 'employee_code'
            },
            {
                title: 'Employee Name',
                dataIndex: 'employee_name',
                key: 'employee_name'
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
            }
        ];
    };

    handleTableChange = (pagination, filters, sorter) => {
        console.log('filters', filters);

        const pager = {...this.props.pagination};
        pager.current = pagination.current;
        this.props.setPagination(pager);

        if (filters || sorter) {
            this.setState({
                filters: filters || [],
                sorter: sorter ? {field: sorter.field, order: sorter.order} : {}
            }, () => {
                this.fetchClaims({...pager});
            });
        } else {
            this.fetchClaims({...pager});
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
            return (
                <div>
                    {/*{this.props.error ? (*/}
                    {/*<Alert message={"Error"} description={this.props.error} type="error" showIcon/>) : null}*/}

                    {/*{(this.props.location.state && this.props.location.state.message && (this.props.location.state.messagerRender = true)) ? (*/}
                    {/*<Alert message={"Success"} description={this.props.location.state.message} type="success"*/}
                    {/*showIcon/>) : null}*/}

                    <Table rowKey='id'
                           className='thead-black shadow'
                           pagination={this.props.pagination}
                           loading={this.props.processing}
                           columns={this.columns()}
                           onChange={this.handleTableChange}
                           dataSource={this.state.data && this.state.data.length ? this.state.data : this.props.claims}
                    />
                </div>
            );
        }
    };

    fetchClaims = (pagination = {}) => {
        this.props.fetchClaims(pagination, this.state.searchFilters, this.state.filters, this.state.sorter);
    };

    onInputChange = (e) => {
        let filters = null;
        let searchVal = e.target.value;

        if (searchVal && searchVal.length) {
            let columns = this.columns();

            filters = {};
            columns.forEach(column => {
                if (column.dataIndex &&
                    ["id","created_at", 'employee_code', 'status', 'claim_type_id'].indexOf(column.dataIndex) < 0) {
                    filters['serial_no'] = searchVal;
                    filters[column.dataIndex] = searchVal;
                }
            });
        }

        clearTimeout(timeOutRef);
        timeOutRef = setTimeout(() => {
            this.setState({searchFilters: filters}, () => {
                this.fetchClaims();
            });
        }, 1000);

    };

    render() {
        return (
            <div>
                <Row type="flex" justify="space-around" align="middle" gutter={32}>
                    <Col span={23} offset={1}>
                        <h3 className='text-left' style={{fontSize: '36px', fontWeight: 900}}>Claims</h3>
                    </Col>
                </Row>
                <Row gutter={32} className='' style={{padding: 12}}>
                    <Col span={24}>
                        <Row>
                            <Col span={8} offset={16}>
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
        claims: state.claim.claims,
        processing: state.claim.processing,
        chartData: state.claim.chartData,
        pagination: state.claim.tablePagination,
        error: state.claim.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchClaims: (pagination, searchFilters, filters, sorter) => {
            dispatch(actions.getAllClaims({pagination, searchFilters, filters, sorter}))
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

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ClaimsViewAll);
export default withRouter(_connectedComponent);