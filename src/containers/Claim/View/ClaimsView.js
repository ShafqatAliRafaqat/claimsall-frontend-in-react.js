import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Row, Col, Table, Input, Spin} from 'antd';
import moment from 'moment';
import * as actions from '../../../store/claim/claim-actions';
import {toDisplayPolicyType} from '../../../utils/common-utils';

let timeOutRef = null;

class ClaimsView extends React.Component {

    componentWillMount() {
        this.props.setProcessing(true);
    }

    componentDidMount() {
        this.props.resetReduxState();
        this.fetchClaims();
    }

    state = {
        searchFilters: {},
        filters: {},
        sorter: {},
        activeId: -1,
        selectedRowKeys: [],
        expandedRowKeys: [],
        claimTypeFilters: [
            {text: 'In-Patient', value: 'in_patient'},
            {text: 'Out-Patient', value: 'out_patient'},
            {text: 'Maternity', value: 'maternity_patient'}]
    };

    columns = () => {
        return [
            {
                title: 'ID',
                dataIndex: 'medical_claim_serial_no',
                key: 'medical_claim_serial_no',
                sorter: true,
                sortOrder: this.state.sorter.field === 'medical_claim_id' && this.state.sorter.order,
                render: (text, record) => (
                    <a className="ant-dropdown-link hover"
                       onClick={() => this.props.history.push({
                           pathname: '/claims/view',
                           state: {id: record.medical_claim_id}
                       })}>
                        {text ? text : record.medical_claim_id}
                    </a>
                ),
            },
            {
                title: 'Title',
                dataIndex: 'medical_claim_title',
                key: 'medical_claim_title'
            },
            {
                title: 'Type',
                dataIndex: 'medical_claim_type',
                key: 'medical_claim_type',
                filters: this.state.claimTypeFilters,
                filteredValue: this.state.filters.medical_claim_type || [],
                render: (text) => <span>{toDisplayPolicyType(text)}</span>
            },
            {
                title: 'Amount Requested',
                dataIndex: 'claimed_amount',
                key: 'claimed_amount'
            },
            {
                title: 'Employee Code',
                dataIndex: 'claimed_by_employee_code',
                key: 'claimed_by_employee_code'
            },
            {
                title: 'Employee Name',
                dataIndex: 'claimed_by_name',
                key: 'claimed_by_name'
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

                    <Table rowKey='medical_claim_id'
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
                    ["id", "created_at", 'employee_code', 'status', 'claim_type_id'].indexOf(column.dataIndex) < 0) {
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
            dispatch(actions.getClaims({pagination, searchFilters, filters, sorter}))
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

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ClaimsView);
export default withRouter(_connectedComponent);