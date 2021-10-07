import React from 'react';
import {Field, reduxForm, FieldArray} from 'redux-form';
import {required, email, website, fixLength3} from '../../utils/validations';
import InputField from '../../components/Fields/InputField';
import SelectField from '../../components/Fields/SelectField';
import AddressField from '../../components/Fields/AddressField';

class OrganizationGeneralForm extends React.Component {

    render() {
        const {handleSubmit, pristine, submitting, readOnly} = this.props;

        const buttonStyle = {
            backgroundColor: '#000',
            color: 'white',
            borderRadius: 0,
            fontSize: 16
        };

        return (
            <form onSubmit={handleSubmit} className='form-horizontal'>
                <Field name="id" type="hidden" component="input"/>

                <Field name="name" component={InputField} type="text" label="Name" required={true}
                       placeholder="Name" validate={[required]} disabled={readOnly}/>

                <Field name="short_code" component={InputField} type="text" label="Short Code" required={true}
                       placeholder="Short Code 3-Characters" validate={[required, fixLength3]} disabled={readOnly}/>

                <Field name="organization_type_id" component={SelectField} label="Industry" required={true}
                       placeholder="Industry" validate={[required]} values={this.props.organizationTypes}
                       disabled={readOnly}/>

                <Field name="description" component={InputField} type="text" label="Description"
                       placeholder="Description" disabled={readOnly}/>

                <Field name="ntn_number" component={InputField} type="text" label="NTN#"
                       placeholder="NTN #" disabled={readOnly}/>

                <Field name="contact_number" component={InputField} type="text" label="UAN#" required={true}
                       placeholder="UAN #" validate={[required]} disabled={readOnly}/>

                <Field name="email" component={InputField} type="text" label="Email" required={true}
                       placeholder="Email" validate={[required, email]} disabled={readOnly}/>

                <Field name="website" component={InputField} type="text" label="Website"
                       placeholder="Website" validate={[website]} disabled={readOnly}/>

                <FieldArray name="address" component={AddressField} type="number" label="Address" required={true}
                            placeholder="Employees" disabled={readOnly}/>

                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-1">
                        {!readOnly &&
                        <button style={buttonStyle} className="btn" type="submit" disabled={pristine || submitting}>
                            {this.props.initialValues && this.props.initialValues.id ? 'Update' : 'Save'}
                        </button>}
                    </div>
                </div>
            </form>
        );
    }
}

const validate = (values) => {
    let errors = {};

    let addressEntered = false;
    if (values.address && values.address.length) {
        addressEntered = values.address.filter(val => val && val.length).length > 0;
    }

    if (!addressEntered) {
        errors.address = {_error: 'At least one address must be entered'}
    }

    return errors;
};

const _form = reduxForm({form: 'organizationGeneralForm', validate})(OrganizationGeneralForm);
export default _form;