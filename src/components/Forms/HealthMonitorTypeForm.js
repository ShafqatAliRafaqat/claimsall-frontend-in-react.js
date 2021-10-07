import React from 'react';
import SubmitButton from '../Buttons/SubmitButton';

class HealthMonitorTypeForm extends React.Component {

    state = {
        icon: null,
        name: '',
        unit: '',
        errors: {}
    };

    onInputChange = (e) => {
        if (e.target.name) {
            let newObj = {};

            if (e.target.type === 'file') {
                newObj[e.target.name] = e.target.files[0];
            }
            else {
                newObj[e.target.name] = e.target.value;
            }

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
                               value={this.state[name]}
                               onChange={this.onInputChange}/>
                        {this.state.errors[name] && <span className="errorMsg">{this.state.errors[name]}</span>}
                    </div>
                </div>
            );
        }
    };

    getFileField = (name, label, placeholder, required = false, type = 'file') => {
        if (name && label) {
            return (
                <div className="form-group">
                    <label htmlFor={name} className='col-sm-2 control-label'>
                        {label} {required && <span className='font-red'>*</span>}
                    </label>
                    <div className='col-sm-5'>
                        <input
                            type={type}
                            id={name}
                            name={name}
                            required={required}
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

            if (element && element.type === 'number' && element.value <= 0) {
                errors[element.name] = 'Must be greater than 0';
            }
        }

        this.setState({errors});

        if (!errors || !errors.length) {
            let _formData = {...this.state};

            let formData = new FormData();

            formData.append('name', _formData.name);
            formData.append('unit', _formData.unit);

            if (_formData.icon && _formData.icon.name) {
                formData.append('icon', _formData.icon, _formData.icon.name);
            }

            this.props.onSubmit && this.props.onSubmit(formData);
        }
    };

    render() {
        return (
            <form onSubmit={this.onFormSubmit} className='form-horizontal'>
                {this.getInputField('name', 'Name', 'Name', true)}

                {this.getInputField('unit', 'Unit', 'Unit', true)}

                {this.getFileField('icon', 'Icon', 'Icon', true, 'file')}

                <div className='col-sm-2 col-sm-offset-1' style={{marginBottom: 12}}>
                    <SubmitButton>Save</SubmitButton>
                </div>
            </form>
        );
    };
}

export default HealthMonitorTypeForm;