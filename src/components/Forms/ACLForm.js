import React from 'react';
import {Select} from 'antd';
import SubmitButton from '../Buttons/SubmitButton';

const Option = Select.Option;

class ACLForm extends React.Component {

    state = {
        role: {
            title: '',
            description: ''
        },
        modules: [],
        errors: {}
    };

    componentDidMount() {
        this.setACL(this.props.initialValues);
    }

    fetchViewPermission = (id) => {
        let permissions = [];
        const {modules} = this.props;
        if (modules && id) {
            for (let i = 0; i < modules.length; i++) {
                const module = modules[i];
                if (module.id.toString() === id.toString() && module.children) {
                    console.log('module.children', module.children);
                    const {children} = module;
                    for (let j = 0; j < children.length; j++) {
                        const child = children[j];
                        if (child['view_route'] === '1') {
                            permissions.push(child.id);
                        }
                    }
                }
            }
        }

        return permissions;
    };

    setACL = (_acl) => {
        if (_acl && _acl.role && _acl.role.title) {
            let acl = {..._acl};
            acl.errors = {};
            console.log('setACL', acl);
            this.setState(acl);
        }
    };

    onInputChange = (e) => {
        if (e.target.name) {
            let newObj = {...this.state};
            newObj.role[e.target.name] = e.target.value;

            let errors = {...this.state.errors};
            errors[e.target.name] = null;

            newObj.errors = errors;

            this.setState(newObj);
        }
    };

    getInputField = (name, label, placeholder, required = false, type = 'text') => {
        if (name && label) {
            return (
                <div className="form-group">
                    <label htmlFor={name} className='col-sm-2 control-label'>
                        {label} {required && <span className='font-red'>*</span>}
                    </label>
                    <div className='col-sm-5'>
                        <input className="form-control"
                               type={type}
                               id={name}
                               name={name}
                               required={required}
                               placeholder={placeholder}
                               value={this.state.role[name]}
                               disabled={this.props.readOnly}
                               onChange={this.onInputChange}/>
                        {this.state.errors[name] && <span className="errorMsg">{this.state.errors[name]}</span>}
                    </div>
                </div>
            );
        }
    };

    onFormSubmit = (e) => {
        e.preventDefault();

        let errors = {};
        let {elements} = e.target;
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            if (element && element.name && element.required && (!element.value || !element.value.length)) {
                errors[element.name] = 'Required';
            }
        }

        if (!this.state.modules || !this.state.modules.length) {
            errors.modules = 'Kindly select at least 1 module'
        } else {
            this.state.modules.forEach(module => {
                if (!module.children || !module.children.length) {
                    errors[module.id + 'permission'] = 'Select Permissions';
                }
            });
        }

        this.setState({errors});

        if (Object.keys(errors).length === 0 && errors.constructor === Object) {
            let formData = {...this.state};
            delete formData.errors;
            this.props.onSubmit && this.props.onSubmit(formData);
        }
    };

    handleCheckboxClick = (target) => {
        const modules = [...this.state.modules];
        const index = this.getModuleIndex(target.value);

        if (!target.checked && index > -1) {
            modules.splice(index, 1);
        } else if (target.checked && index < 0) {
            let children = this.fetchViewPermission(target.value);
            console.log('children', children);
            modules.push({id: target.value, children});
        }

        let newData = {...this.state};
        newData.modules = modules;
        this.setState(newData);
    };

    checkBoxChecked = (val) => {
        return this.getModuleIndex(val) > -1;
    };

    getModuleIndex = (val) => {
        const {modules} = this.state;
        if (modules && modules.length) {
            for (let i = 0; i < modules.length; i++) {
                let module = modules[i];

                if (val.toString() === module.id.toString()) {
                    return i;
                }
            }
        }

        return -1;
    };

    handleChange = (id, value) => {
        const index = this.getModuleIndex(id);

        let modules = [...this.state.modules];
        modules[index].children = value;

        let errors = {...this.state.errors};
        errors[id + 'permission'] = null;

        this.setState({modules, errors});
    };

    moduleDefaultValue = (id) => {
        const index = this.getModuleIndex(id);
        if (index > -1) {
            return this.state.modules[index].children;
        }

        return [];
    };

    getModulesField = (modules) => {
        if (modules && modules.length) {
            let jsx = modules.map(module => {
                let htmlId = 'module-' + module.id;
                return (
                    <div className='col-sm-12' key={htmlId} style={{marginBottom: 5}}>
                        <div className='row'>
                            <div className="form-check col-sm-4 text-left">
                                <input type="checkbox"
                                       className="form-check-input"
                                       id={htmlId}
                                       name={module.name}
                                       onChange={(e) => this.handleCheckboxClick(e.target)}
                                       value={module.id}
                                       disabled={this.props.readOnly}
                                       checked={this.checkBoxChecked(module.id)}
                                />
                                <label className="form-check-label" htmlFor={htmlId}>{module.name}</label>
                            </div>
                            <div className='col-sm-6 text-left'>
                                {this.checkBoxChecked(module.id)
                                &&
                                <Select value={this.moduleDefaultValue(module.id)}
                                        placeholder="Select Permissions"
                                        mode="multiple"
                                        disabled={this.props.readOnly}
                                        onChange={(value) => this.handleChange(module.id, value)}>
                                    {this.getPermissions(module.id, module.children)}
                                </Select>
                                }
                                <div className="errorMsg text-left col-sm-offset-1">
                                    {this.state.errors[module.id + 'permission']}
                                </div>

                            </div>
                        </div>
                    </div>
                )
            });

            return (
                <div className='form-group'>
                    <label className='col-sm-2 control-label'>
                        Modules<span className='font-red'>*</span>
                    </label>
                    <div className='form-row col-sm-10'>
                        {jsx}
                    </div>
                    {this.state.errors.modules &&
                    <div className="errorMsg text-left col-sm-offset-1">{this.state.errors.modules}</div>}
                </div>
            );
        }

        return null;
    };

    getPermissions = (id, permissions) => {
        const jsx = permissions.map(permission => {
            return (
                <Option key={permission.id} value={permission.id}
                        disabled={permission.view_route === '1'}>{permission.name}</Option>
            );
        });

        return jsx;
    };

    render() {
        console.log('state', this.state);

        return (
            <form onSubmit={this.onFormSubmit} className='form-horizontal'>
                {this.getInputField('title', 'Title', 'Title', true)}

                {this.getInputField('description', 'Description', 'Description', true)}

                {this.getModulesField(this.props.modules)}

                {
                    !this.props.readOnly
                    &&
                    <div className='col-sm-2 col-sm-offset-1' style={{marginBottom: 12, marginTop: 12}}>
                        <SubmitButton>{this.state.role.id ? 'Update' : 'Submit'}</SubmitButton>
                    </div>
                }

            </form>
        );
    };
}

export default ACLForm;