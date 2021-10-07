import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {required, email, website, mapPoint} from '../../utils/validations';
import InputField from '../../components/Fields/InputField';

class InsuranceCompanyGeneralForm extends React.Component {

    getLocationFields = (props) => {
        let jsx = null;

        if (!props.disableLocationInfo) {
            jsx = [];
            jsx.push(<Field key={jsx.length} name="latlng" component={InputField} type="text"
                            label="Coordinates" required={true} disabled={props.readOnly}
                            placeholder="Latitude,Longitude" validate={[mapPoint, required]}/>);

            jsx.push(<Field key={jsx.length} name="address" component={InputField} type="text"
                            label="Address" required={true} disabled={props.readOnly}
                            placeholder="Address" validate={[required]}/>);

            jsx.push(<Field key={jsx.length} name="timing" component={InputField} type="text"
                            label="Timing" disabled={props.readOnly}
                            placeholder="Monday : 13:30-16:30, Tuesday 10:00-14:00"/>);
        }

        return jsx;
    };

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

                <Field name="description" component={InputField} type="text" label="Description"
                       placeholder="Description" disabled={readOnly}/>

                <Field name="contact_number" component={InputField} type="text" label="UAN#" required={true}
                       placeholder="UAN #" validate={[required]} disabled={readOnly}/>

                <Field name="email" component={InputField} type="email" label="Email" required={true}
                       placeholder="Email" validate={[required, email]} disabled={readOnly}/>

                <Field name="website" component={InputField} type="text" label="Website"
                       placeholder="Website" validate={[website]} disabled={readOnly}/>

                {this.getLocationFields(this.props)}

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
    console.log(values);
    return errors;
};

const _form = reduxForm({form: 'insuranceCompanyGeneralForm', validate})(InsuranceCompanyGeneralForm);
export default _form;