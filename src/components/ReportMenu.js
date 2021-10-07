import React from 'react';
import {Popover, DatePicker, Button, Row, Col, Icon, Spin, message} from 'antd';
import {CSVLink} from 'react-csv';

class ReportMenu extends React.Component {

    state = {
        visible: false,
        start_date: null,
        end_date: null,
        reportDownloading: false
    };

    hide = () => {
        this.setState({visible: false});
    };

    csvLink = () => {
        if (this.state.data && this.state.data.length) {
            const {data} = this.state;
            return (
                <CSVLink className="btn btn-light shadow" filename={this.props.filename} data={data}
                         headers={this.props.headers}
                         onClick={() => {
                             this.setState({data : null}); // 👍🏻 Your click handling logic
                         }}>
                    Download Report
                </CSVLink>
            );
        }
        return null;
    };

    content = () => {
        return (
            <div>
                <DatePicker placeholder='Start Date' onChange={(date) => {
                    this.setState({start_date: date})
                }}/>

                <DatePicker placeholder='End Date' onChange={(date) => {
                    this.setState({end_date: date})
                }}/>

                <Button style={{marginLeft : '10px'}} type="primary" onClick={() => {
                    let params = {};
                    if (this.state.start_date) {
                        params.start_date = this.state.start_date.format('YYYY-MM-DD');
                    }

                    if (this.state.end_date) {
                        params.end_date = this.state.end_date.format('YYYY-MM-DD');
                    }

                    if (this.props.onDownload) {
                        this.setState({reportDownloading: true});
                        this.props.onDownload(params)
                            .then(result => {

                                if(!result.data || !result.data.length){
                                    message.error('No data found');
                                }

                                this.setState({data: result.data, reportDownloading: false}, () => {
                                    console.log(this.state);
                                });
                            })
                            .catch(() => {
                                this.setState({reportDownloading: false, data : null});
                            });
                    }

                    this.setState({visible: false});
                }}
                        disabled={this.state.start_date && this.state.end_date && this.state.start_date.isAfter(this.state.end_date)}
                >
                    Download
                </Button>
            </div>
        );
    };

    popOver = () => {
        if (this.state.visible)
            return (
                <Popover content={this.content()} placement="right"
                         title={
                             <Row>
                                 <Col span={12} className='text-left'>
                                     Extract Report
                                 </Col>
                                 <Col span={12} className='text-right'>
                                     <Icon type="close" className='hover' onClick={this.hide}/>
                                 </Col>
                             </Row>
                         }
                         visible={true}
                />
            );
        return null;
    };

    render() {
        return (
            <Row type="flex" justify="space-around" align="middle">
                <Col span={4}>
                    {this.csvLink()}
                </Col>
                <Col span={8}>
                    {this.popOver()}
                </Col>
                <Col span={12}>
                    {this.state.reportDownloading ? <Spin/> :
                        <button className="btn btn-light shadow" style={{fontSize : 'bold'}} onClick={() => this.setState({visible: !this.state.visible})}>
                            Extract Report
                        </button>}
                </Col>
            </Row>
        );
    }

}

export default ReportMenu;