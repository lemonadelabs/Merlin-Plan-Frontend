import React from 'react';
import { Control, Errors } from 'react-redux-form';
import { required } from 'components/forms/validators';

function UserDetailsFields(){
  return (
    <div>
      <label>First name</label>
        <Errors
          model=".firstName"
          show="touched"
          messages={{
            required: 'Please provide an first name.'
          }}
        />
        <Control.text model=".firstName" 
          validators={{
            required
          }}/>
        <Errors
          model=".lastName"
          show="touched"
          messages={{
            required: 'Please provide an last name.'
          }}
        />
        <label>Last name</label>        
        <Control.text model=".lastName" 
          validators={{
              required
          }}
          />
        <label>Employee Id Number</label>        
        <Control.text model=".employeeId" />
    </div>
  );
}

export default UserDetailsFields;