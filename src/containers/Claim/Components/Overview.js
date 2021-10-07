import React from 'react';
import BigBoldSpan from './BigBoldSpan';
import BoldSpan from './BoldSpan';
import LightBox from '../../../components/Gallery/Gallery';
import serverConfig from '../../../config/config';
import {Row, Col, Select} from 'antd';
import {formatAmount} from '../../../utils/common-utils';

const {Option} = Select;

class OverviewTab extends React.Component {

    state = {
        attachments: 'invoices'
    };


    handleChange = (attachments) => {
        this.setState({attachments});
        console.log('handleChange', attachments);
    };

    getCarousel = () => {
        const supportedFileTypes = ['jpg', 'jpeg', 'png'];
        if (this.props.data) {
            let documents = this.props.data.attachments[this.state.attachments];
            if (documents && documents.length) {
                let images = documents.filter(document => {
                    let fileExtension = document.url.split('.').pop().toLowerCase();
                    return supportedFileTypes.indexOf(fileExtension) > -1;
                }).map(document => {
                    const href = `${serverConfig.url}${document.url}`;
                    let caption = '';
                    if (+document.price > 0) {
                        caption += `Amount : ${formatAmount(document.price)} `;
                    }
                    caption += `Notes : ${document.notes || ''} `;
                    return {
                        src: href,
                        thumbnail: href,
                        caption
                    };
                });

                console.log('images', images);

                return (
                    <LightBox images={images} heading={""} showThumbnails={true}/>
                );
            }
        }
        else {
            return null;
        }
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

    getAttachmentSections = () => {
        const supportedFileTypes = ['xls', 'xlsx', 'doc', 'docx', 'pdf', 'txt'];
        if (this.props.data) {
            let documents = this.props.data.attachments[this.state.attachments];
            if (documents && documents.length) {
                let files = documents.filter(document => {
                    let fileExtension = document.url.split('.').pop().toLowerCase();
                    return supportedFileTypes.indexOf(fileExtension) > -1;
                }).map(document => {
                    let split = document.url.split('.');
                    let extension = split.pop();
                    console.log('split', split);
                    let fileName = split.join('').split('/').pop().split('_');
                    fileName.pop();
                    fileName = fileName.join('') + '.' + extension;
                    console.log('fileName', fileName);
                    return {
                        name : fileName,
                        url : document.url
                    };
                });

                console.log('files', files);

                return (
                    <ul>
                        {this.getUploadedFileLIs(files)}
                    </ul>
                );
            }
        }
        else {
            return null;
        }
    };

    render() {
        let {data} = this.props;
        return (
            <div className='font-quicksand'>
                <Row type="flex" justify="start" style={{marginBottom: 24}}>
                    <Col span={2} offset={1} className='text-left'>
                        <BigBoldSpan text='General'/>
                    </Col>
                </Row>

                {data && data.general.map(entry => {
                    return (
                        <Row key={entry.name} type="flex" justify="start" style={{marginBottom: 12}}>
                            <Col span={3} offset={1} className='text-left'>
                                <BoldSpan text={entry.name}/>
                            </Col>
                            <Col span={10} offset={1} className='text-left'>
                                {entry.value}
                            </Col>
                        </Row>
                    );
                })}

                <hr/>

                <Row type="flex" justify="start" style={{marginBottom: 24}}>
                    <Col span={2} offset={1} className='text-left'>
                        <BigBoldSpan text='Notes'/>
                    </Col>
                </Row>

                <Row type="flex" justify="start" style={{marginBottom: 24}}>
                    <Col span={24} offset={1} className='text-left'>
                        <p>
                            {data && data.notes}
                        </p>
                    </Col>
                </Row>

                <hr/>

                <Row type="flex" justify="start" style={{marginBottom: 24}}>
                    <Col span={2} offset={1} className='text-left'>
                        <BigBoldSpan text='Attachments'/>
                    </Col>
                </Row>

                <Row type="flex" justify="start" style={{marginBottom: 12}}>
                    <Col span={4} offset={1} className='text-left'>
                        <Select defaultValue="invoices" style={{width: '100%'}} onChange={this.handleChange}>
                            <Option value="reports">Lab Reports</Option>
                            <Option value="prescriptions">Prescriptions</Option>
                            <Option value="invoices">Invoices</Option>
                        </Select>
                    </Col>
                </Row>

                <Row type="flex" justify="start" style={{marginBottom: 12}}>
                    <Col span={11} offset={1} className='text-left'>
                        {this.getCarousel()}
                    </Col>
                    <Col span={12} className='text-left'>
                        {this.getAttachmentSections()}
                    </Col>
                </Row>

            </div>
        );
    };
}

export default OverviewTab;