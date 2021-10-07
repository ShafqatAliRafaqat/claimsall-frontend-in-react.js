import React from 'react';
import {Col, Row, Input, Button, message} from 'antd';
import TableCard from '../../TableCard/TableCard';
import TextCard from '../../TextCard/TextCard';
import serverConfig from '../../../config/config';
import LightBox from '../../../components/Gallery/Gallery';

const {TextArea} = Input;

class FormClass extends React.Component {

    state = {
        comments: ''
    };

    onChange = (e) => {
        this.setState({comments: e.target.value});
    };

    submit = (status) => {
        this.props.onSubmit(this.state.comments, status);
    };

    render() {
        return (
            <Row>
                <Col span={2}/>
                <Col span={20}>
                    <Row type="flex" justify="space-around" align="middle"
                         style={{marginBottom: 12}}>
                        <Col span={24}>
                            <span style={{fontSize: '24px', fontWeight: 'bold'}}>Comments</span>
                        </Col>
                    </Row>
                    <Row gutter={8} style={{marginBottom: 12}}>
                        <Col span={12} offset={6}>
                            <TextArea value={this.props.readOnly ? this.props.comments : this.state.comments}
                                      onChange={this.onChange}
                                      disabled={this.props.readOnly}/>
                        </Col>
                    </Row>
                    {!this.props.readOnly &&
                    <Row gutter={8}>
                        <Col span={10}/>
                        <Col span={2}>
                            <Button type="primary" onClick={() => this.submit('Approved')}>Approve</Button>
                        </Col>
                        <Col span={2}>
                            <Button type="danger" onClick={() => this.submit('Declined')}>Decline</Button>
                        </Col>
                        <Col span={10}/>
                    </Row>
                    }
                </Col>
                <Col span={2}/>
            </Row>
        );
    }
}

const getCarousel = (props) => {
    const supportedFileTypes = ['jpg', 'jpeg', 'png'];

    if (props.documents && props.documents.length) {
        let images = props.documents.filter(document => {
            let fileExtension = document.url.split('.').pop().toLowerCase();
            return supportedFileTypes.indexOf(fileExtension) > -1;
        }).map(document => {
            return {
                src: `${serverConfig.url}${document.url}`,
                thumbnail: `${serverConfig.url}${document.url}`,
                caption: document.notes
            };
        });

        return (
            <LightBox images={images} heading={"Documents"} showThumbnails={true}/>
        );
    }
    else {
        return null;
    }
};

const getUploadedFileLIs = (files) => {
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

const getAttachmentSections = (props) => {
    const supportedFileTypes = ['xls', 'xlsx', 'doc', 'docx', 'pdf', 'txt'];
    if (props.documents && props.documents.length) {
        let {documents} = props;

        if (documents && documents.length) {
            let files = documents.filter(document => {
                let fileExtension = document.url.split('.').pop().toLowerCase();
                return supportedFileTypes.indexOf(fileExtension) > -1;
            }).map(document => {
                let split = document.url.split('.');
                let extension = split.pop();
                let fileName = split.join('').split('/').pop().split('_');
                fileName.pop();
                fileName = fileName.join('') + '.' + extension;
                return {
                    name : fileName,
                    url : document.url
                };
            });

            return (
                <ul>
                    {getUploadedFileLIs(files)}
                </ul>
            );
        }
    }
    else {
        return null;
    }
};

const getRequestInfo = (props) => {
    let data = {};

    data.header = 'Service Details';

    data.records = [
        {
            title: 'Service Type',
            value: props.care_services_type
        },
        {
            title: 'Preference',
            value: props.preference
        },

        {
            title: 'Date Submitted',
            value: props.created_at
        },

        {
            title: 'Reservation Date',
            value: props.start_date
        },

        {
            title: 'Reservation Time',
            value: props.start_time
        },

        {
            title: 'Status',
            value: props.status
        }
    ];

    return <TableCard {...data} />
};

const getUserInfo = (props) => {
    let data = {};

    data.header = 'User Details';

    data.records = [
        {
            title: 'Name',
            value: props.name
        },
        {
            title: 'Email',
            value: props.email
        },

        {
            title: 'Contact #',
            value: props.contact_number
        },

        {
            title: 'Address',
            value: props.address
        }
    ];

    return <TableCard {...data} />
};


const getNotesInfo = (props) => {
    return <TextCard header='Notes' text={props.description}/>
};

const onSubmit = (id, comment, status,
                  callback = () => {
                      console.log('No call back provided')
                  }) => {

    console.log('comment', comment);
    if (!comment || !comment.length) {
        message.error('Comments cannot be empty');
    }
    else {
        callback({id, feedback: comment, status});
    }

};

const careServiceDetail = (props) => {
    let {data} = props;
    return (
        <div>
            <Row type="flex" justify="space-around" align="middle" gutter={16}>
                <Col span={12} style={{marginBottom: 12}}>
                    {getRequestInfo(data)}
                </Col>
                <Col span={12} style={{marginBottom: 12}}>
                    {getUserInfo(data)}
                </Col>
                <Col span={12} style={{marginBottom: 12}}>
                    {getNotesInfo(data)}
                </Col>
                <Col span={12} style={{marginBottom: 6}}>
                    {getCarousel(data)}
                </Col>
                <Col span={5} offset={8} style={{marginBottom: 12}}>
                    {getAttachmentSections(data)}
                </Col>
            </Row>

            <FormClass readOnly={data.status !== 'Pending'} comments={data.feedback} onSubmit={(comment, status) => {
                onSubmit(data.id, comment, status, props.onSubmit)
            }}/>
        </div>
    );
};


export default careServiceDetail;