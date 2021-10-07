import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { email, required } from '../../utils/validations';
import InputField from '../../components/Fields/InputFieldFill';

class LoginForm extends React.Component {

    render() {
        const { handleSubmit, submitting } = this.props;

        const buttonStyle = {
            width: '100%',
            backgroundColor: '#333',
            color: 'white',
        };

        return (
            <form onSubmit={handleSubmit} className='form-horizontal'>
                <Field name="email" component={InputField} type="email"
                    placeholder="Email"validate={[required, email]} />

                <Field name="password" component={InputField} type="password"
                    placeholder="Password" validate={[required]} />

                <button className="btn btn-primary btn-lg" style={buttonStyle} type="submit" disabled={submitting}>Login</button>
            </form>
        );
    }
}

const _form = reduxForm({ form: 'loginForm' })(LoginForm);
export default _form;