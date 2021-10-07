import React from 'react';
import {Row, Col, Select, Input, Button, message, Modal, Spin} from 'antd';
import PolicyLimits from './PolicyLimits';
import {connect} from 'react-redux';
import axios from '../../../utils/axios';
import serverConfig from '../../../config/config.json';
import MagicDropzone from 'react-magic-dropzone';
import {withRouter} from 'react-router-dom';
import TextCard from './EmployeeDetails';
import BigBoldSpan from './BigBoldSpan';
import {formatAmount} from '../../../utils/common-utils';

const {Option} = Select;
const {TextArea} = Input;
const {confirm} = Modal;

class ClaimStatus extends React.Component {

    state = {
        action: 'On Hold',
        amount: 0,
        comments: '',
        opd_amount: 0,
        ipd_amount: 0,
        mat_amount: 0,
        specialLimit: 0,
        mode: 'basic',
        policyLimits: {},
        files: 0,
        acceptedFiles: []
    };

    onDrop = (accepted) => {
        console.log('accepted', accepted);
        this.setState({files: this.state.files + accepted.length});
        let {props} = this;
        accepted.forEach(file => {
            let formData = new FormData();
            formData.append('document', file, file.name);

            let url = `${serverConfig.serverUrl}/upload-careservice-document`;
            let headers = {headers: {'Authorization': `Bearer ${props.jwt}`}};
            axios.post(url, formData, headers)
                .then(resp => {
                    let acceptedFiles = [...this.state.acceptedFiles];
                    acceptedFiles.push({name: file.name, url: resp.data.data.path});

                    console.log('acceptedFiles', acceptedFiles);

                    this.setState({acceptedFiles, files: this.state.files - 1});

                    console.log('file upload resp', resp);
                })
                .catch(err => console.log(err.response));
        });
    };

    uploadSpinners = () => {
        let jsx = [];

        for (let index = 0; index < this.state.files; index++) {
            jsx.push(
                <li key={index + 'spinner'}>
                    <div>
                        <Spin/>
                    </div>
                </li>
            );
        }

        return jsx;
    };

    getUploadedFileLIs = (files) => {
        return files && files.map((file, index) => {
            return (
                <li key={index}>
                    <a target='_blank' href={`${serverConfig.url}${file.url}`}>
                        {file.name}
                    </a>
                </li>
            )
        });
    };

    dropZone = () => {
        return (
            <MagicDropzone className='Dropzone'
                           accept="image/jpeg, image/png, .jpg, .jpeg, .png"
                           onDrop={this.onDrop}>
                <div className="Dropzone-content">
                    <ul>
                        {this.uploadSpinners()}
                        {this.getUploadedFileLIs(this.state.acceptedFiles)}
                    </ul>
                </div>
                <div className="Dropzone-content">
                    Drop some files on me !
                </div>
            </MagicDropzone>
        );
    };

    setPolicyLimits = (policyLimits) => {
        this.setState({policyLimits});
    };

    handleChange = (action) => {
        let newState = {
            ...this.state,
            amount: 0,
            comments: '',
            opd_amount: 0,
            ipd_amount: 0,
            mat_amount: 0,
            specialLimit: 0,
            mode: 'basic',
            action: action
        };

        this.setState(newState);
    };

    handleComments = (e) => {
        this.setState({comments: e.target.value});
    };

    changeMode = (mode) => {
        this.setState({
            mode,
            opd_amount: 0,
            ipd_amount: 0,
            mat_amount: 0,
            specialLimit: 0
        })
    };

    getStatusSection = () => {
        if (this.props.claim.readOnly) {
            return (
                <div>
                    <Row type="flex" justify="middle" gutter={32} style={{marginBottom: 12}}>
                        <Col span={4} offset={1}>
                            <BigBoldSpan text='Action :'/>
                        </Col>
                        <Col span={4}>
                            <Select defaultValue={this.props.claim.orgClaim['action']}
                                    style={{width: '100%'}}
                                    disabled={true}
                                    onChange={this.handleChange}>
                                <Option value="Approved">Approve</Option>
                                <Option value="Decline">Decline</Option>
                                <Option value="On Hold">Hold</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>
            );
        }
        else {
            return (
                <div>
                    <Row type="flex" justify="middle" gutter={32} style={{marginBottom: 12}}>
                        <Col span={4} offset={1}>
                            Action :
                        </Col>
                        <Col span={4}>
                            <Select defaultValue={this.state.action} style={{width: '100%'}}
                                    onChange={this.handleChange}>
                                <Option value="Approved">Approve</Option>
                                <Option value="Decline">Decline</Option>
                                <Option value="On Hold">Hold</Option>
                            </Select>
                        </Col>
                        <Col span={4}>
                            {this.state.mode === 'basic' && this.state.action === 'Approved' &&
                            <a className='hover' onClick={() => this.changeMode('advance')}>Advance Mode</a>}
                            {this.state.mode === 'advance' && this.state.action === 'Approved' &&
                            <a className='hover' onClick={() => this.changeMode('basic')}>Basic Mode</a>}
                        </Col>
                    </Row>
                </div>
            );
        }
    };

    getCommentsSection = () => {
        if (this.props.claim.readOnly) {
            return (
                <div>
                    <Row type="flex" justify="middle" gutter={32} style={{marginBottom: 12}}>
                        <Col span={4} offset={1}>
                            Remarks :
                        </Col>
                        <Col span={12}>
                        <TextArea
                            disabled={true}
                            value={this.props.claim.orgClaim['comments']}
                            autosize={{minRows: 2, maxRows: 6}}/>
                        </Col>
                    </Row>
                </div>
            );
        } else {
            return (
                <div>
                    <Row type="flex" justify="middle" gutter={32} style={{marginBottom: 12}}>
                        <Col span={4} offset={1}>
                            Remarks :
                        </Col>
                        <Col span={12}>
                        <TextArea placeholder="Remarks"
                                  onChange={this.handleComments}
                                  autosize={{minRows: 2, maxRows: 6}}/>

                        </Col>
                        <Col span={6}>
                            {this.dropZone()}
                        </Col>
                    </Row>
                </div>
            );
        }
    };

    isAdvanceMode = () => 'advance' === this.state.mode;

    getIpdAmount = () => {
        let {orgClaim} = this.props.claim;
        if (orgClaim['medical_claim_type'] === 'in_patient' || this.isAdvanceMode()) {
            return (
                <Row type="flex" justify="middle" gutter={32} style={{marginBottom: 12}}>
                    <Col span={4} offset={1}>
                        {this.isAdvanceMode() ? 'IPD Amount' : 'Amount'}
                    </Col>

                    <Col span={4}>
                        <Input type="number" value={this.state.ipd_amount}
                               onChange={(e) => this.setState({ipd_amount: e.target.value})}/>
                    </Col>
                </Row>
            );
        }

        return null;
    };

    getOpdAmount = () => {
        let {orgClaim} = this.props.claim;
        if (orgClaim['medical_claim_type'] === 'out_patient' || this.isAdvanceMode()) {
            return (
                <Row type="flex" justify="middle" gutter={32} style={{marginBottom: 12}}>
                    <Col span={4} offset={1}>
                        {this.isAdvanceMode() ? 'OPD Amount' : 'Amount'}
                    </Col>

                    <Col span={4}>
                        <Input type="number" value={this.state.opd_amount}
                               onChange={(e) => this.setState({opd_amount: e.target.value})}/>
                    </Col>
                </Row>
            );
        }

        return null;
    };

    getMatAmount = () => {
        let {orgClaim} = this.props.claim;
        if (orgClaim['medical_claim_type'] === 'maternity' || this.isAdvanceMode()) {
            return (
                <Row type="flex" justify="middle" gutter={32} style={{marginBottom: 12}}>
                    <Col span={4} offset={1}>
                        {this.isAdvanceMode() ? 'Maternity Amount' : 'Amount'}
                    </Col>

                    <Col span={4}>
                        <Input type="number" value={this.state.mat_amount}
                               onChange={(e) => this.setState({mat_amount: e.target.value})}/>
                    </Col>
                </Row>
            );
        }

        return null;
    };

    getSpecialAmount = () => {
        if (this.state.allowSpecialLimit || this.isAdvanceMode()) {
            return (
                <Row type="flex" justify="middle" gutter={32} style={{marginBottom: 12}}>
                    <Col span={4} offset={1}>
                        Special Limit
                    </Col>

                    <Col span={4}>
                        <Input type="number" value={this.state.specialLimit}
                               onChange={(e) => this.setState({specialLimit: e.target.value})}/>
                    </Col>
                </Row>
            );
        }
        else {
            return (
                <Row type="flex" justify="middle" gutter={32} style={{marginBottom: 12}}>
                    <Col span={4} offset={5}>
                        <Button onClick={() => this.setState({allowSpecialLimit: true})}>Add Special Limit</Button>
                    </Col>
                </Row>
            );

        }
    };


    getApprovalSection = () => {
        if (this.props.claim.readOnly) {
            let {orgClaim} = this.props.claim;
            let data = [
                {
                    name: 'Approved Amount (Total)',
                    value: formatAmount(+orgClaim['ipd_approved_amount'] + +orgClaim['maternity_approved_amount'] + +orgClaim['opd_approved_amount'] + +orgClaim['special_approved_amount'])
                },
                {name: 'Approved Amount (OPD)', value: formatAmount(orgClaim['opd_approved_amount'])},
                {name: 'Approved Amount (IPD)', value: formatAmount(orgClaim['ipd_approved_amount'])},
                {name: 'Approved Amount (Maternity)', value: formatAmount(orgClaim['maternity_approved_amount'])},
                {name: 'Approved Amount (Special)', value: formatAmount(orgClaim['special_approved_amount'])},
            ];
            return (
                <TextCard data={data}/>
            );
        }
        else if ('Approved' === this.state.action) {
            return (
                <div>
                    {this.getOpdAmount()}
                    {this.getIpdAmount()}
                    {this.getMatAmount()}
                    {this.getSpecialAmount()}

                    <Row type="flex" justify="middle" gutter={32} style={{marginBottom: 12}}>
                        <Col span={4} offset={1}>
                            Total Amount
                        </Col>
                        <Col span={4}>
                            {formatAmount(this.getTotalAmount())}
                        </Col>
                    </Row>
                </div>
            );
        }

        return null;
    };

    getTotalAmount = () => +this.state.opd_amount + +this.state.ipd_amount + +this.state.mat_amount + +this.state.specialLimit;

    validateApprovedAmounts = () => {
        let valid = true;

        if (+this.state.ipd_amount > 0 && +this.state.policyLimits['In-Patient']['Remaining'] < +this.state.ipd_amount) {
            valid = false;
        }
        else if (+this.state.opd_amount > 0 && +this.state.policyLimits['Out-Patient']['Remaining'] < +this.state.opd_amount) {
            valid = false;
        }
        else if (+this.state.mat_amount > 0 && +this.state.policyLimits['Maternity (C-Section)']['Remaining'] < +this.state.mat_amount) {
            valid = false;
        }

        return valid;
    };

    processClaim = () => {
        const {state, props} = this;
        const {claim} = props;
        const totalAmount = +this.getTotalAmount();
        const isApprove = state.action === 'Approved';

        if (isApprove && totalAmount > +claim.claimDetails['claim_amount']) {
            message.error('Total amount cannot exceed requested claim amount');
        }
        else if (isApprove && totalAmount <= 0) {
            message.error('You cannot approve 0 or negative amount claim');
        }
        else if (!this.validateApprovedAmounts()) {
            message.error('Approved amount cannot be more than remaining limit');
        }
        else {
            let formData = {
                "parent_transaction_id": claim.transactionId,
                "action": state.action,
                "ipd_approved_amount": state.ipd_amount,
                "opd_approved_amount": state.opd_amount,
                "maternity_approved_amount": state.mat_amount,
                "special_approved_amount": state.specialLimit,
                "ipd_consumed_amount": state.policyLimits['In-Patient']['Consumed'],
                "opd_consumed_amount": state.policyLimits['Out-Patient']['Consumed'],
                "maternity_consumed_amount": state.policyLimits['Maternity (C-Section)']['Consumed'],
                "special_consumed_amount": state.policyLimits['Special']['Consumed'],
                "comments": state.comments,
                "special_limit_comments": "special comments",
                "attachments": this.state.acceptedFiles
            };

            confirm({
                title: `Update this claim as : ${state.action} ?`,
                content: '',
                okText: 'Yes',
                cancelText: 'No',
                onOk() {
                    console.log('formData', formData);

                    let url = `${serverConfig.serverUrl}/process-claim`;
                    let headers = {headers: {'Authorization': `Bearer ${props.jwt}`}};
                    axios.post(url, formData, headers)
                        .then(resp => {
                            props.history.push({pathname: '/claims/pending', state: {message: resp.data.message}});
                        })
                        .catch(err => {
                            message.error(err.response.data.message);
                            console.log(err.response)
                        });
                },
                onCancel() {
                },
            });
        }
    };

    getAttachmentsSection = () => {
        if (this.props.claim.readOnly) {
            return (
                <div>
                    <Row type="flex" justify="start" style={{marginTop: 24}}>
                        <Col span={2} offset={1} className='text-left'>
                            <BigBoldSpan text='Attachments'/>
                        </Col>
                    </Row>
                    <Row className='text-left'>
                        <Col span={8} offset={1}>
                            <ul>
                                {this.getUploadedFileLIs(this.props.claim.orgClaim['attachments'])}
                            </ul>
                        </Col>
                    </Row>
                </div>

            );
        }

        return null;
    };

    render() {
        return (
            <div className='font-quicksand'>
                <PolicyLimits {...this.props.claim} setPolicyLimits={this.setPolicyLimits}/>
                <hr/>
                {this.getStatusSection()}
                {this.getApprovalSection()}
                {this.getAttachmentsSection()}
                {this.getCommentsSection()}

                {!this.props.claim.readOnly &&
                <Button type="primary"
                        style={{marginTop: '24px', marginBottom: '24px'}}
                        onClick={this.processClaim}>
                    Process
                </Button>}

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        jwt: state.auth.token
    };
};


const connectedComponents = connect(mapStateToProps)(ClaimStatus);
export default withRouter(connectedComponents);