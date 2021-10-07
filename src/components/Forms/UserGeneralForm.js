import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {
    required,
    email,
    pakistanCnic,
    pakistanPhone,
    alpha,
    mapPoint,
    number,
    minLength6,
} from '../../utils/validations';
import InputField from '../../components/Fields/InputField';
import SelectField from '../../components/Fields/SelectField';
import {fetchOrganizationRoles, fetchOrganizationGrades} from '../../utils/data-fetcher'
import moment from 'moment';

import SubmitButton from '../Buttons/SubmitButton';


const getSalary = (_salary) => {
    let salary = _salary.toString();
    if (salary.includes('.')) {
        salary = salary.split('.')[0];
    }

    return salary;
};

const salaryMaxLength = (input) => input && getSalary(input).length > 8 ? 'Must be 8 digits or less' : undefined;

const salaryMinLength = (input) => input && getSalary(input).length < 4 ? 'Must be 4 digits or more' : undefined;

const limitMinLength = (input) => input && getSalary(input).length < 1 ? 'Must be 1 digits or more' : undefined;


const employeeCode = value => /^[a-zA-Z0-9 ,.'-]+$/i.test(value) ? undefined : 'Only Alphanumeric , - . allowed';

class UserGeneralForm extends React.Component {

    state = {
        organizationRoles: [],
        organizationGrades: [],
        organizationId: null
    };

    fetchingRoles = false;
    fetchingGrades = false;

    genders = () => {
        return [
            {
                id: "Male",
                name: "Male"
            },
            {
                id: "Female",
                name: "Female"
            },
            {
                id: "Other",
                name: "Other"
            }
        ];
    };

    getOrganizationIdField = (props) => {
        if (!props.orgTypes || !props.orgTypes.length || props.serviceProviderForm) {
            return null;
        } else {
            return <Field name="organization_id" component={SelectField} label="Organization"
                          placeholder="Organization" values={props.orgTypes}
                          disabled={props.readOnly || (props.initialValues && props.initialValues.organization_id)}/>
        }
    };

    getEmployeeIdField = (props) => {
        if (!props.serviceProviderForm && props.hasOrganizationId && props.isOrgAdmin) {
            return (
                <Field name="employee_code" component={InputField} type="text" label="Employee Code" required={true}
                       placeholder="Employee Code" validate={[required, employeeCode]} disabled={props.readOnly}/>
            );
        }

        return null;
    };

    getEmployeeGradeField = (props) => {
        if (!props.serviceProviderForm && props.hasOrganizationId && props.isOrgAdmin) {
            if ((!this.state.organizationGrades || this.state.organizationGrades.length === 0) || props.hasOrganizationId !== this.state.organizationId) {
                if (!this.fetchingGrades) {
                    this.fetchingGrades = true;
                    fetchOrganizationGrades(props.hasOrganizationId)
                        .then(organizationGrades => this.setState({
                            organizationGrades
                        }, () => {
                            this.fetchingGrades = false;
                        }))
                        .catch(err => console.log(err));
                }
            }
            return (
                <Field name="grade_id" component={SelectField} label="Grade"
                       values={this.state.organizationGrades}
                    // required={true}
                    // validate={[required]}
                       disabled={props.readOnly}/>
            );
        }

        return null;
    };


    getEmployeeRoleField = (props) => {
        if (!props.serviceProviderForm && props.hasOrganizationId) {
            if ((!this.state.organizationRoles || this.state.organizationRoles.length === 0) || props.hasOrganizationId !== this.state.organizationId) {
                if (!this.fetchingRoles) {
                    this.fetchingRoles = true;
                    fetchOrganizationRoles(props.hasOrganizationId)
                        .then(organizationRoles => this.setState({
                            organizationRoles,
                            organizationId: props.hasOrganizationId
                        }, () => {
                            this.fetchingRoles = false;
                        }))
                        .catch(err => {
                            console.log(err);
                            // this.fetchingRoles = false;
                        });
                }
            }
            return (
                <Field name="role_id" component={SelectField} label="Administrative Role"
                       values={this.state.organizationRoles}
                       disabled={props.readOnly}/>
            );
        }

        return null;
    };

    getEmployeeFields = (props) => {
        if (!props.serviceProviderForm && props.hasOrganizationId && props.isOrgAdmin) {
            let jsx = [];

            jsx.push(
                <Field key={jsx.length} name="basic_salary" component={InputField}
                       validate={[number, salaryMaxLength, salaryMinLength]}
                       type="text" label="Salary (Basic)"
                       placeholder="Salary (Basic)"
                       disabled={props.readOnly}/>
            );

            jsx.push(
                <Field key={jsx.length} name="gross_salary" component={InputField}
                       validate={[number, salaryMaxLength, salaryMinLength]}
                       type="text" label="Salary (Gross)"
                       placeholder="Salary (Gross)"
                       disabled={props.readOnly}/>
            );

            jsx.push(
                <Field key={jsx.length} name="date_joining" component={InputField} type="date" label="Joining Date"
                       placeholder="Joining Date" disabled={props.readOnly}/>
            );

            jsx.push(
                <Field key={jsx.length} name="date_confirmation" component={InputField} type="date"
                       label="Confirmation Date"
                       placeholder="Confirmation Date"
                       disabled={props.readOnly}/>
            );

            jsx.push(
                <Field key={jsx.length} name="team" component={InputField} type="text" label="Team"
                       placeholder="Team" disabled={props.readOnly}/>
            );

            // jsx.push(
            //     <Field key={jsx.length} name="ipd_limit" component={InputField}
            //            validate={[number, salaryMaxLength, limitMinLength]}
            //            type="text" label="IPD Limit"
            //            placeholder="In-Patient Limit"
            //            disabled={props.readOnly}/>
            // );

            jsx.push(
                <Field key={jsx.length} name="opd_limit" component={InputField}
                       validate={[number, salaryMaxLength, limitMinLength]}
                       type="text" label="OPD Limit"
                       placeholder="Out-Patient Limit"
                       disabled={props.readOnly}/>
            );

            // jsx.push(
            //     <Field key={jsx.length} name="maternity_limit" component={InputField}
            //            validate={[number, salaryMaxLength, limitMinLength]}
            //            type="text" label="Maternity Limit"
            //            placeholder="Maternity Limit"
            //            disabled={props.readOnly}/>
            // );
            //
            // jsx.push(
            //     <Field key={jsx.length} name="maternity_csection_limit" component={InputField}
            //            validate={[number, salaryMaxLength, limitMinLength]}
            //            type="text" label="Maternity S-Section Limit"
            //            placeholder="Maternity S-Section Limit"
            //            disabled={props.readOnly}/>
            // );
            //
            // jsx.push(
            //     <Field key={jsx.length} name="maternity_room_limit" component={InputField}
            //            validate={[number, salaryMaxLength, limitMinLength]}
            //            type="text" label="Maternity Room Limit"
            //            placeholder="Maternity Room Limit"
            //            disabled={props.readOnly}/>
            // );

            return jsx;
        }

        return null;
    };


    getBusinessFields = (props) => {
        let jsx = null;

        if (props.serviceProviderForm) {
            jsx = [];

            jsx.push(<Field key={jsx.length} name="medical_council_no" component={InputField} type="text"
                            label="Medical Registration #"
                            required={true} validate={[required]}
                            placeholder="Medical Registration No"
                            disabled={props.readOnly}/>);

            jsx.push(<Field key={jsx.length} name="business_address" component={InputField} type="text"
                            label="Business Address"
                            required={true} validate={[required]}
                            placeholder="Business Address"
                            disabled={props.readOnly}/>);

            jsx.push(<Field key={jsx.length} name="latlng" component={InputField} type="text"
                            label="Coordinates"
                            required={true}
                            placeholder="Latitude,Longitude" validate={[mapPoint]}
                            disabled={props.readOnly}/>);

            jsx.push(<Field key={jsx.length} name="business_timing" component={InputField} type="text"
                            label="Business Timing"
                            placeholder="Monday : 13:30-16:30, Tuesday 10:00-14:00"
                            disabled={props.readOnly}
            />);
        }

        return jsx;
    };

    render() {
        const {handleSubmit, submitting, readOnly} = this.props;

        return (
            <form onSubmit={handleSubmit} className='form-horizontal'>
                <Field name="id" type="hidden" component="input"/>

                <Field name="first_name" component={InputField} type="text" label="First Name" required={true}
                       placeholder="First Name" validate={[required, alpha]} disabled={readOnly}/>

                <Field name="last_name" component={InputField} type="text" label="Last Name" required={true}
                       placeholder="Last Name" validate={[required, alpha]} disabled={readOnly}/>

                <Field name="dob" component={InputField} type="date" label="Date of Birth"
                       placeholder="Date of Birth" disabled={readOnly}/>

                <Field name="gender" component={SelectField} validate={[required]} label="Gender" required={true}
                       values={this.genders()} disabled={readOnly}/>

                <Field name="contact_number" component={InputField} type="text" label="Contact#" required={true}
                       placeholder="Contact # e.g +923451234567" validate={[required, pakistanPhone]}
                       disabled={readOnly}/>

                <Field name="email" component={InputField} type="text" label="Email" required={true}
                       placeholder="Email" validate={[required, email]} disabled={readOnly}/>

                <Field name="password" component={InputField}
                       validate={[minLength6]}
                       type="password"
                       label="Password"
                       placeholder="Password" disabled={readOnly}/>

                <Field name="cnic" component={InputField} type="text" label="CNIC" required={true}
                       placeholder="CNIC" validate={[required, pakistanCnic]} disabled={readOnly}/>

                {this.getOrganizationIdField(this.props)}
                {this.getEmployeeIdField(this.props)}
                {this.getEmployeeGradeField(this.props)}
                {this.getEmployeeFields(this.props)}
                {this.getEmployeeRoleField(this.props)}

                <Field name="address" component={InputField} label="Address"
                       placeholder="Address" disabled={readOnly}/>

                {this.getBusinessFields(this.props)}

                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-1">
                        {!readOnly && <SubmitButton disabled={submitting}>
                            {this.props.initialValues && this.props.initialValues.id ?
                                (this.props.pendingUser ? 'Approve' : 'Update') : 'Save'}
                        </SubmitButton>}
                    </div>
                </div>
            </form>
        );
    }
}


const validate = (values) => {
    let errors = {};

    let {date_joining, date_confirmation, dob} = values;

    if (date_joining && date_confirmation) {
        let dateJoining = moment(date_joining);
        let dateConfirmation = moment(date_confirmation);
        if (dateConfirmation.isBefore(dateJoining)) {
            errors.date_confirmation = {_error: 'Confirmation date must be after Joining Date'};
        }
    }
    else if (date_confirmation) {
        errors.date_joining = {_error: 'Joining date must be specified'};
    }

    if (dob) {
        let dateOfBirth = moment(dob);
        if (moment().isBefore(dateOfBirth)) {
            errors.dob = {_error: 'This must be a past date'};
        }
    }

    return errors;
};


const _form = reduxForm({form: 'userGeneralForm', validate})(UserGeneralForm);

// Decorate with connect to read form values
const selector = formValueSelector('userGeneralForm');
export default connect(
    state => {
        const organization_id = selector(state, 'organization_id');

        return {
            hasOrganizationId: organization_id
        }
    }
)(_form);
