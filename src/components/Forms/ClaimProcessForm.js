import React from 'react';
import {Row, Col} from 'antd';
import {fetchOrganizationRoles} from '../../utils/data-fetcher';
import {Select, Button, Icon, message, Timeline} from 'antd';
import SubmitButton from '../Buttons/SubmitButton';

const Option = Select.Option;

class ClaimProcessForm extends React.Component {

    state = {
        roles: [],
        process: []
    };

    counter = 0;

    componentDidMount() {
        this.counter = 0;

        let {initialData} = this.props;
        if (initialData && initialData.length) {
            this.createRow(initialData);
        }

        fetchOrganizationRoles().then(roles => {
            this.setState({roles}, () => {
                if (!initialData || !initialData.length) {
                    this.createRow();
                }
            });
        }).catch(err => {
            // do nothing
        });
    }

    getCounterIndex = (counter) => {
        let index = -1;

        for (let i = 0; i < this.state.process.length; i++) {
            let item = this.state.process[i];
            if (item.counter === counter) {
                return i;
            }
        }

        return index;
    };

    handleChange = (counter, param, value) => {
        const index = this.getCounterIndex(counter);

        if (index > -1) {
            let process = [...this.state.process];
            let processItem = process[index];
            delete processItem.error;
            processItem[param] = value;
            this.setState({process})
        }
    };

    getValue = (counter, param) => {
        const index = this.getCounterIndex(counter);
        if (index < 0) {
            return param === 'role_id' ? "0" : "";
        }
        else {
            let value = this.state.process[index][param];
            if (!value && param === 'error') {
                value = '';
            }

            return value;
        }
    };


    getRowJsx = (counter) => {
        return (
            <Row>
                <Col span={10} offset={2}>
                    <Select value={this.getValue(counter, 'role_id')}
                            style={{width: '100%', color: this.getValue(counter, 'error')}}
                            placeholder="Select Role"
                            onChange={(value) => this.handleChange(counter, 'role_id', value)}>
                        <Option value="0">Select Role</Option>
                        {this.state.roles && this.state.roles.map(role => {
                            return <Option key={role.id} value={role.id}>
                                {role.name}
                            </Option>
                        })}
                    </Select>
                </Col>
                <Col span={2} className='text-right'>
                    <Button shape='circle' type='danger' onClick={() => this.deleteRow(counter)}>
                        <Icon type="close"/>
                    </Button>
                </Col>
            </Row>
        );
    };

    deleteRow = (counter) => {
        const index = this.getCounterIndex(counter);
        if (index > -1) {
            let process = [...this.state.process];
            process.splice(index, 1);
            this.setState({process});
        }
    };

    createRow = (initialData = null) => {
        let process = [];
        if (initialData && initialData.length) {
            initialData.forEach(data => {
                let counter = ++this.counter;
                let obj = {};
                obj.counter = counter;
                obj.role_id = data.role_id || "0";
                obj.description = data.description || "";
                process.push(obj);
            });
        } else {
            let counter = ++this.counter;
            let obj = {counter, role_id: "0", description: ''};
            process = [...this.state.process];
            process.push(obj);
        }

        this.setState({process}, () => {
            console.log('setState', this.state);
        });
    };

    onFormSubmit = () => {
        let process = [...this.state.process];
        let formData = [];

        let error = null;
        for (let index = 0; index < process.length; index++) {
            let obj = process[index];
            if (obj.role_id === '0') {
                error = 'Role not defined in defined flow';
                obj.error = 'red';
                this.setState({process});
                break;
            } else {
                formData.push(obj);
            }
        }

        if (error) {
            message.error(error);
        } else {
            console.log('onFormSubmit', formData);
            this.props.onSubmit(formData);
        }
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={16} offset={4}>
                        <Timeline>
                            {
                                this.state.process.map(item => {
                                    return <Timeline.Item
                                        key={item.counter}>{this.getRowJsx(item.counter)}</Timeline.Item>
                                })
                            }
                        </Timeline>
                    </Col>
                </Row>
                <Row>
                    <Col span={16} offset={4}>
                        <Row>
                            <Col offset={12} span={2} className='text-right'>
                                <Button shape='circle' style={{color: 'green', borderColor: 'green'}}
                                        onClick={() => this.createRow()}>
                                    <Icon type="plus"/>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span={4} offset={4} className='text-left'>
                        <SubmitButton type='primary' onClick={(e) => {
                            e.preventDefault();
                            this.onFormSubmit()
                        }}>
                            Submit
                        </SubmitButton>
                    </Col>
                </Row>
            </div>
        );
    }

}

export default ClaimProcessForm;