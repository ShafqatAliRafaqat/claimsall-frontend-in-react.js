import React from 'react';
import {number} from '../../utils/validations';
import SubmitButton from '../Buttons/SubmitButton';

class PolicyForm extends React.Component {

    getMaternityRelation = () => {
        let relations = [];

        if (this.props.coveredTypes && this.props.coveredTypes.length) {
            this.props.coveredTypes.forEach(type => {
                if (type.name === 'Self' || type.name === 'Spouse') {
                    relations.push(type.id);
                }
            });
        }

        return relations;
    };

    indoorPolicy = {
        relationship_type_ids: [],
        indoor_limit: 0,
        indoor_room_limit: 0
    };

    outdoorPolicy = {
        relationship_type_ids: [],
        outdoor_amount: 0
    };

    maternityPolicy = {
        relationship_type_ids: [],
        maternity_room_limit: 0,
        maternity_normal_case_limit: 0,
        maternity_csection_case_limit: 0
    };


    initState = {
        name: '',
        description: '',
        short_code: '',
        policy_type: 'organization',
        type: 'Fixed',
        policy_level: 'organization',
        grade_id: undefined,
        errors: {}
    };

    state = this.initState;

    componentDidMount() {
        this.setPolicy(this.props.initialValues);
    }

    setPolicy = (_policy) => {
        if (_policy && _policy.name) {
            this.setState(_policy);
        } else {
            this.setState(this.initState);
        }
    };

    onInputChange = (e) => {
        if (e.target.name) {
            let newObj = {};
            newObj[e.target.name] = e.target.value;

            let errors = {...this.state.errors};
            errors[e.target.name] = null;

            newObj.errors = errors;

            this.setState(newObj);
        }
    };

    onSubInputChange = (e, id) => {
        if (e.target.name) {
            let errors = {...this.state.errors};
            let newObj = {...this.state[id]};
            let newState = {...this.state};

            const name = e.target.name;
            const value = e.target.value;

            if (e.target.type === 'number') {
                let error = number(value);
                if (error) {
                    errors[name] = error;
                    newState.errors = errors;
                } else {
                    newObj[name] = value;
                    errors[name] = null;
                    newState.errors = errors;
                }
            } else {
                newObj[name] = value;
                errors[name] = null;
                newState.errors = errors;
            }

            newState[id] = newObj;
            this.setState(newState);
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


        if (this.state.policy_type === 'maternity') {

            if (this.state.type === 'Fixed' && +this.state['3'].maternity_csection_case_limit > 10000000) {
                errors.maternity_csection_case_limit = 'Cannot be greater than 10000000.00';
            }

            if (this.state.type === 'Percentage' && +this.state['3'].maternity_csection_case_limit > 100) {
                errors.maternity_csection_case_limit = 'Cannot be greater than 100%';
            }

            if (+this.state['3'].maternity_csection_case_limit < +this.state['3'].maternity_normal_case_limit) {
                errors.maternity_csection_case_limit = 'C-Section limit must be greater than or equal to normal limit';
            }

            if (+this.state['3'].maternity_room_limit > +this.state['3'].maternity_normal_case_limit) {
                errors.maternity_room_limit = 'Room Limit must be a sub-limit of Normal Limit';
            }
        }
        else if (this.state.policy_type === 'in_patient') {
            if (this.state.type === 'Fixed' && +this.state['1'].indoor_limit > 10000000) {
                errors.indoor_limit = 'Cannot be greater than 10000000.00';
            }

            if (this.state.type === 'Percentage' && +this.state['1'].indoor_limit > 100) {
                errors.indoor_limit = 'Cannot be greater than 100%';
            }

            if (+this.state['1'].indoor_room_limit > +this.state['1'].indoor_limit) {
                errors.indoor_room_limit = 'Room Limit must be a sub-limit of Total Limit';
            }
        }
        else if (this.state.policy_type === 'out_patient') {
            if (this.state.type === 'Fixed' && +this.state['2'].outdoor_amount > 10000000) {
                errors.outdoor_amount = 'Cannot be greater than 10000000.00';
            }

            if (this.state.type === 'Percentage' && +this.state['2'].outdoor_amount > 100) {
                errors.outdoor_amount = 'Cannot be greater than 100%';
            }
        }

        console.log('errors', errors);

        this.setState({errors});

        if (!errors || (Object.keys(errors).length === 0)) {
            let formData = {...this.state};

            if (this.state.policy_type === 'maternity') {
                formData['3']['relationship_type_ids'] = this.getMaternityRelation();
            }
            else {
                let selfTypeId = null;
                this.props.coveredTypes.forEach(type => {
                    if (type.name === 'Self') {
                        selfTypeId = type.id;
                    }
                });

                formData['1']['relationship_type_ids'].indexOf(selfTypeId) < 0 && formData['1']['relationship_type_ids'].push(selfTypeId);
                formData['2']['relationship_type_ids'].indexOf(selfTypeId) < 0 && formData['2']['relationship_type_ids'].push(selfTypeId);
            }

            this.props.onSubmit && this.props.onSubmit(formData);
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
                               onChange={this.onInputChange}
                               disabled={this.props.readOnly}/>
                        {this.state.errors[name] && <span className="errorMsg">{this.state.errors[name]}</span>}
                    </div>
                </div>
            );
        }
    };

    getSubInputField = (id, name, label, required = false, type = 'text') => {
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
                               placeholder={label}
                               value={this.state[id][name]}
                               onChange={(e) => this.onSubInputChange(e, id)}
                               disabled={this.props.readOnly}/>
                        {this.state.errors[name] && <span className="errorMsg">{this.state.errors[name]}</span>}
                    </div>
                </div>
            );
        }
    };

    getPolicyTypeField = () => {
        return (
            <div className="form-group">
                <label htmlFor={'policy_type'} className='col-sm-2 control-label'>
                    Policy Type <span className='font-red'>*</span>
                </label>
                <div className='col-sm-5'>
                    <select disabled={this.state.id} className='form-control' id='policy_type'
                            value={this.state.policy_type} onChange={(e) => {
                        this.setState({
                            policy_type: e.target.value,
                            policy_level: 'organization',
                            type: 'Fixed',
                            1: this.indoorPolicy,
                            2: this.outdoorPolicy,
                            3: this.maternityPolicy
                        })
                    }}>
                        <option/>
                        <option value={'in_patient'}>In-Patient</option>
                        <option value={'out_patient'}>Out-Patient</option>
                        <option value={'maternity'}>Maternity</option>
                    </select>
                </div>
            </div>
        );
    };

    getPolicyLevelField = () => {
        return (
            <div className="form-group">
                <label htmlFor={'policy_level'} className='col-sm-2 control-label'>
                    Policy Level <span className='font-red'>*</span>
                </label>
                <div className='col-sm-5'>
                    <select disabled={this.state.id} className='form-control' id='policy_level'
                            value={this.state.policy_level} onChange={(e) => {
                        this.setState({policy_level: e.target.value})
                    }}>
                        <option value={'organization'}>Organization</option>
                        <option value={'grade'}>Grade</option>
                        {this.state.policy_type ==='out_patient' && <option value={'user'}>User</option>}
                    </select>
                </div>
            </div>
        );
    };

    getGradeField = () => {
        if (this.state.policy_level === 'grade') {
            return (
                <div className="form-group">
                    <label htmlFor={'grade_id'} className='col-sm-2 control-label'>
                        Grade <span className='font-red'>*</span>
                    </label>
                    <div className='col-sm-5'>
                        <select disabled={this.state.id} required={true} className='form-control'
                                value={this.state.grade_id}
                                onChange={(e) => this.setState({grade_id: e.target.value})}>
                            <option/>
                            {this.props.grades && this.props.grades.map(grade => {
                                return <option key={grade.id} value={grade.id}>{grade.name}</option>;
                            })}

                        </select>
                    </div>
                </div>
            );
        }

        return null;
    };

    handleCheckboxClick = (id, target) => {
        let relationship_type_ids = [...this.state[id].relationship_type_ids];

        const index = relationship_type_ids.indexOf(target.value);

        if (!target.checked && index > -1) {
            relationship_type_ids.splice(index, 1);
        } else if (target.checked && index < 0) {
            relationship_type_ids.push(target.value);
        }

        let newData = {...this.state};
        newData[id].relationship_type_ids = relationship_type_ids;
        this.setState(newData);
    };

    checkBoxChecked = (id, val) => {
        const {relationship_type_ids} = this.state[id];
        return relationship_type_ids && relationship_type_ids.length && relationship_type_ids.indexOf(val + '') > -1;
    };

    getCoveredTypesField = (id, coveredTypes) => {
        if (coveredTypes && coveredTypes.length) {
            let jsx = coveredTypes.map(coveredType => {
                let htmlId = 'coveredType' + id + coveredType.id;
                return (
                    <div className="form-check col-sm-2" key={htmlId}>
                        <input type="checkbox"
                               className="form-check-input"
                               id={htmlId}
                               name={coveredType.name}
                               onChange={(e) => this.handleCheckboxClick(id, e.target)}
                               value={coveredType.id}
                               checked={coveredType.name === 'Self' || this.checkBoxChecked(id, coveredType.id)}
                               disabled={coveredType.name === 'Self' || this.props.readOnly}
                        />
                        <label className="form-check-label" htmlFor={htmlId}>{coveredType.name}</label>
                    </div>
                )
            });

            return (
                <div className='container'>
                    <div style={{fontSize: 16, fontWeight: 'bold', textAlign: 'left'}}>
                        Covered Persons <span className='font-red'>*</span>
                    </div>
                    <div className='form-row'>
                        {jsx}
                    </div>
                </div>
            );
        }

        return null;
    };


    inPatientForm = () => {
        if (this.state.policy_type === 'in_patient') {
            return (
                <div>
                    <hr/>

                    <div className='col-sm-offset-1'>
                        <h2 className='text-left'>In-Patient | IPD</h2>
                    </div>

                    {this.getCoveredTypesField(1, this.props.coveredTypes)}

                    {this.state.policy_level !== 'user' && this.getSubInputField('1', 'indoor_limit', 'Indoor Limit', true, 'number')}

                    {/*{this.getSubInputField('1', 'indoor_room_limit', 'Indoor Room Limit', true, 'number')}*/}
                </div>
            );
        }
        return null;
    };

    outPatientForm = () => {
        if (this.state.policy_type === 'out_patient') {
            return (
                <div>
                    <hr/>

                    <div className='col-sm-offset-1'>
                        <h2 className='text-left'>Out-Patient | OPD</h2>
                    </div>

                    {this.getCoveredTypesField(2, this.props.coveredTypes)}

                    {this.state.policy_level !== 'user' && this.getSubInputField('2', 'outdoor_amount', 'Outdoor Limit', true, 'number')}
                </div>
            );
        }
        return null;
    };

    maternityForm = () => {
        if (this.state.policy_type === 'maternity' && this.state.policy_level !== 'user') {
            return (
                <div>
                    <hr/>

                    <div className='col-sm-offset-1'>
                        <h2 className='text-left'>Maternity</h2>
                    </div>

                    {this.getSubInputField('3', 'maternity_normal_case_limit', 'Normal Limit', true, 'number')}
                    {this.getSubInputField('3', 'maternity_csection_case_limit', 'C-Section Limit', true, 'number')}
                    {this.getSubInputField('3', 'maternity_room_limit', 'Room Sub-Limit', true, 'number')}
                </div>
            );
        }
        return null;
    };


    getAmountTypeField = () => {
        return (
            <div className="form-group">
                <label htmlFor={'type'} className='col-sm-2 control-label'>
                    Limit Type <span className='font-red'>*</span>
                </label>
                <div className='col-sm-5'>
                    <select disabled={this.state.id} className='form-control' id='type'
                            value={this.state.type} onChange={(e) => {
                        this.setState({type: e.target.value})
                    }}>
                        <option value={'Fixed'}>Fixed</option>
                        {this.state.policy_level !== 'user' && <option value={'Percentage'}>Percentage</option>}
                    </select>
                </div>
            </div>
        );
    };

    render() {
        return (
            <form onSubmit={this.onFormSubmit} className='form-horizontal'>
                <div className='col-sm-offset-1'>
                    <h2 className='text-left'>General Info</h2>
                </div>

                {this.getInputField('name', 'Name', 'Policy Name', true)}

                {this.getInputField('description', 'Description', 'Description', true)}

                {this.getInputField('short_code', 'Short Code', 'Short Code')}

                {this.getPolicyTypeField()}

                {this.getPolicyLevelField()}

                {/*{this.getAmountTypeField()}*/}

                {this.getGradeField()}

                {this.inPatientForm()}

                {this.outPatientForm()}

                {this.maternityForm()}

                <div className='col-sm-2 col-sm-offset-1' style={{marginBottom: 12}}>
                    {!this.props.readOnly &&
                    <SubmitButton>{this.state.id ? 'Update' : 'Save'}</SubmitButton>}
                </div>

            </form>
        );
    }
}

export default PolicyForm;