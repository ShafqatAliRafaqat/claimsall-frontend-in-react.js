import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {required} from '../../utils/validations';
import InputField from '../../components/Fields/InputField';

class GradeGeneralForm extends React.Component {

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

                <Field name="title" component={InputField} type="text" label="Title" required={true}
                       placeholder="Title" validate={[required]} disabled={readOnly}/>

                <Field name="description" component={InputField} type="text" label="Description"
                       placeholder="Description" disabled={readOnly}/>

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

const _form = reduxForm({form: 'gradeGeneralForm'})(GradeGeneralForm);
export default _form;