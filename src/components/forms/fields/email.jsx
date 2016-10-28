import React, {PropTypes} from 'react';
import { Control, Errors } from 'react-redux-form';
import { required, validEmail } from 'components/forms/validators';
import { getData } from 'utilities/api-interaction'
import { connect } from 'react-redux';

function checkAvailability(email) {
  //THIS NEEDS TO BE DEBOUNCED!!!
  return getData('user/validate',{'email':email})
}

const EmailField = props => {
  let firstName = props.firstName
  return (
    <div>
      <label>Email</label>
      <Errors
        model=".email"
        show="touched"
        messages={{
          validEmail: val => (val.length > 0 ? `Sorry ${val} is not a valid email.` : ''),
          available: val => `${val} is already taken, ${firstName ? firstName:'this person'} might already have an account.`,
          required: 'Please provide an email address.'
        }}
      />
      <Control.text model=".email"
        validators={{
          required,
          validEmail
        }}
        validateOn="change"
        asyncValidators={{
        available: (val, done) => checkAvailability(val)
          .then(res => done(res.valid))
        }}
        asyncValidateOn="change"/>
    </div>
  );
};

EmailField.propTypes = {
  firstName: PropTypes.string
};

function mapStateToProps(state) {
  let firstName = state.forms.user.firstName
  return({firstName:firstName})
}

export default connect(mapStateToProps)(EmailField);