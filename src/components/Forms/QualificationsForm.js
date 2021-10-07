import React from 'react';
import {reduxForm, FieldArray} from 'redux-form';
import MultiField from '../../components/Fields/MultiField';

class QualificationsForm extends React.Component {

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
                <FieldArray component={MultiField} name={this.props.name} label={this.props.label} disabled={readOnly}/>

                <div className="form-group">
                    <div className="col-sm-offset-1 col-sm-1">
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

export default reduxForm({form: 'qualificationsForm'})(QualificationsForm);
