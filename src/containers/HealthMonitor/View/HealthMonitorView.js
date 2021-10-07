import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Alert, Button, Col, Icon, Modal, Row, Spin, Table} from 'antd';
import * as actions from '../../../store/healthmonitor/healthmonitor-actions';
import serverConfig from '../../../config/config.json';

const confirm = Modal.confirm;

class HealthMonitorView extends React.Component {

    componentWillMount() {
        this.props.setProcessing(true);
    }

    componentDidMount() {
        this.props.resetReduxState();
        this.fetchHealthmonitors();
    }

    state = {
        searchFilters: {},
        filters: {},
        sorter: {},
        activeId: -1,
        selectedRowKeys: [],
        expandedRowKeys: [],
        healthmonitorTypeFilters: []
    };


    columns = () => {
        return [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Unit',
                dataIndex: 'unit',
                key: 'unit'
            },
            {
                title: 'Icon',
                dataIndex: 'url',
                key: 'url',
                render: (text, record) => (
                    <div>
                        <img style={{height: '48px'}} src={`${serverConfig.url}${text}`} alt={record.icon}/>
                    </div>
                )
            },
            {
                title: 'Last Updated',
                dataIndex: 'updated_at',
                key: 'updated_at'
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
                    <a className="hover" onClick={() => this.showDeleteConfirm(record.id)}>
                        <Icon type="delete" title={'Delete'} style={iconStyle}/>
                    </a>

                    {/*<Link to={{*/}
                    {/*pathname: 'health-monitor-fields/edit',*/}
                    {/*state: {...this.props.location.state, id: record.id}*/}
                    {/*}}>*/}
                    {/*<Icon type="edit" title='Edit' style={iconStyle}/>*/}
                    {/*</Link>*/}
                </div>
            );
        } else {
            return null;
        }
    };

    showDeleteConfirm = (id) => {
        let {props} = this;
        let _this = this;
        confirm({
            title: 'Are you sure you want to delete selected type(s) ?',
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.setState({selectedRowKeys: []}, () => {
                    props.deleteHealthmonitor(id);
                });
            },
            onCancel() {
            },
        });
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
                this.fetchHealthmonitors({...pager});
            });
        } else {
            this.fetchHealthmonitors({...pager});
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

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
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
                    {this.props.error ? (
                        <Alert message={"Error"} description={this.props.error} type="error" showIcon/>) : null}

                    {(this.props.location.state && this.props.location.state.message && (this.props.location.state.messagerRender = true)) ? (
                        <Alert message={"Success"} description={this.props.location.state.message} type="success"
                               showIcon/>) : null}
                    <Table className='thead-black shadow'
                           rowKey='id'
                           rowSelection={rowSelection}
                           onChange={this.handleTableChange}
                           pagination={this.props.pagination}
                           loading={this.props.processing}
                           columns={this.columns()}
                           dataSource={this.state.data && this.state.data.length ? this.state.data : this.props.healthmonitors}
                    />
                </div>
            );
        }
    };


    fetchHealthmonitors = (pagination = {}) => {
        this.props.fetchHealthmonitors(pagination, this.state.searchFilters, this.state.filters, this.state.sorter);
    };

    deleteAll = () => {
        let locState = {...this.props.location.state};
        if (locState && locState.id) {
            delete locState.id;
        }
        return (
            <Button className='shadow' style={{fontWeight: 'bold', marginBottom: 12}}
                    onClick={() => this.props.history.push({
                        pathname: '/health-monitor-fields/add',
                        state: {locState}
                    })}> <Icon type='plus' style={{
                fontSize: 16
            }}/> Add Type</Button>
        );
    };

    render() {
        return (
            <div>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={1}/>
                    <Col span={23}>
                        <h3 className='text-left' style={{fontSize: '36px', fontWeight: 900}}>Health Monitoring
                            Types</h3>
                    </Col>
                </Row>
                <Row gutter={32} className='' style={{padding: 12}}>
                    <Col span={24}>
                        <Row>
                            <Col span={3}>
                                {this.deleteAll()}
                            </Col>

                            <Col span={8} offset={13}>
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
        healthmonitors: state.healthmonitor.healthmonitors,
        processing: state.healthmonitor.processing,
        chartData: state.healthmonitor.chartData,
        pagination: state.healthmonitor.tablePagination,
        error: state.healthmonitor.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchHealthmonitors: (pagination, searchFilters, filters, sorter) => {
            dispatch(actions.getHealthmonitors({pagination, searchFilters, filters, sorter}))
        },
        deleteHealthmonitor: (id) => {
            dispatch(actions.deleteHealthmonitor(id))
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

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(HealthMonitorView);

export default withRouter(_connectedComponent);
