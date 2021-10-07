import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Row, Col, Table, Spin, Input} from 'antd';
import * as actions from '../../../store/care-service/careservice-actions';
import {fetchCareTypes} from "../../../utils/data-fetcher";
import {fetchCareServices} from "../../../utils/report-fetcher";
import ReportButton from '../../../components/ReportMenu';

const headers = [
    {label: 'ID', key: 'id'},
    {label: 'Type', key: 'care_services_type'},
    {label: 'Requester', key: 'name'},
    {label: 'Gender', key: 'gender'},
    {label: 'Contact', key: 'contact_number'},
    {label: 'Email', key: 'email'},
    {label: 'Description', key: 'description'},
    {label: 'Preference', key: 'preference'},
    {label: 'Reservation Date', key: 'start_date'},
    {label: 'Reservation Time', key: 'start_time'},
    {label: 'Status', key: 'status'},
    {label: 'Feedback', key: 'feedback'}
];

let timeOutRef = null;

class CareServiceView extends React.Component {

    componentWillMount() {
        this.props.setProcessing(true);
    }

    componentDidMount() {
        this.props.resetReduxState();
        fetchCareTypes()
            .then(careserviceTypeFilters => {
                let filters = [];

                careserviceTypeFilters.forEach(type => {
                    filters.push({text: type.name, value: type.id});
                });

                let newState = {...this.state};

                newState.careserviceTypeFilters = filters;

                if (this.props.showHistory) {
                    newState.statusFilters = [
                        {text: 'Approved', value: 'Approved'},
                        //        {text: 'Pending', value: 'Pending'},
                        {text: 'Declined', value: 'Declined'}
                    ];

                    if (this.props.location && this.props.location.state && this.props.location.state.filter) {
                        newState.filters = {status: this.props.location.state.filter};
                    }
                }

                this.setState(newState, () => {
                    this.fetchCareservices();
                });

            }).catch(err => console.log(err));
    }

    state = {
        searchFilters: {},
        filters: {},
        sorter: {},
        activeId: -1,
        selectedRowKeys: [],
        expandedRowKeys: [],
        careserviceTypeFilters: []
    };


    columns = () => {
        return [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                sorter: (a, b) => a.id.length - b.id.length,
                sortOrder: this.state.sorter.field === 'id' && this.state.sorter.order,
                render: (text, record) => (
                    <a className="ant-dropdown-link hover"
                       onClick={() => this.props.history.push({
                           pathname: '/care-services/process',
                           state: {
                               id: record.id,
                               backUrl: this.props.showHistory ? '/care-services/history' : '/care-services/pending'
                           }
                       })}>
                        {text}
                    </a>
                )
            },
            {
                title: 'Requester Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                filters: this.state.statusFilters,
                filteredValue: this.state.filters.status || undefined
            },
            {
                title: 'Care Service',
                dataIndex: 'care_services_type',
                key: 'care_services_type_id',
                filters: this.state.careserviceTypeFilters,
                filteredValue: this.state.filters.care_services_type_id || undefined
            },
            {
                title: 'Preference',
                dataIndex: 'preference',
                key: 'preference'
            },
            {
                title: 'Last Changed',
                dataIndex: 'updated_at',
                key: 'updated_at'
            }
        ];
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
                this.fetchCareservices({...pager});
            });
        } else {
            this.fetchCareservices({...pager});
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
                    <Table className='thead-black shadow'
                           rowKey='id'
                           onChange={this.handleTableChange}
                           pagination={this.props.pagination}
                           loading={this.props.processing}
                           columns={this.columns()}
                           dataSource={this.state.data && this.state.data.length ? this.state.data : this.props.careservices}
                    />
                </div>
            );
        }
    };


    fetchCareservices = (pagination = {}) => {
        let filters = {...this.state.filters};
        if (this.props.showHistory) {
            filters.history = true;
        }

        this.props.fetchCareservices(pagination, this.state.searchFilters, filters, this.state.sorter);
    };


    onInputChange = (e) => {
        let filters = null;
        let searchVal = e.target.value;

        if (searchVal && searchVal.length) {
            let columns = this.columns();

            filters = {};
            columns.forEach(column => {
                if (column.dataIndex && ["created_at", "care_services_type", "updated_at"].indexOf(column.dataIndex) < 0) {
                    filters[column.dataIndex] = searchVal;
                }
            });
        }

        clearTimeout(timeOutRef);
        timeOutRef = setTimeout(() => {
            this.setState({searchFilters: filters}, () => {
                this.fetchCareservices();
            });
        }, 1000);

    };


    onReportDownload = (report) => {
        let {filters, searchFilters} = {...this.state};

        if (this.props.showHistory) {
            filters.history = true;
        }

        return fetchCareServices({filters, searchFilters, report})
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
                        <h3 className='text-left' style={{fontSize: '36px', fontWeight: 900}}>Care Service Requests</h3>
                    </Col>
                </Row>
                <Row gutter={32} className='' style={{padding: 12}}>
                    <Col span={24}>
                        <Row>
                            <Col span={14} offset={10}>
                                <Row>
                                    <Col span={11} offset={3}>
                                        <ReportButton headers={headers} filename={`care-service-requests.csv`}
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
        careservices: state.careservice.careservices,
        processing: state.careservice.processing,
        chartData: state.careservice.chartData,
        pagination: state.careservice.tablePagination,
        error: state.careservice.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchCareservices: (pagination, searchFilters, filters, sorter) => {
            dispatch(actions.getCareservices({pagination, searchFilters, filters, sorter}))
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

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(CareServiceView);

export default withRouter(_connectedComponent);
