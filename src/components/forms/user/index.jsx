import React, {Component} from 'react';
import { Control, Form, actions } from 'react-redux-form';

class UserForm extends Component {
  render() {
    return (
      <Form model="forms.user" >
        <label>First Name</label>
        <Control.text model="forms.user.firstName" />
        <label>Last Name</label>        
        <Control.text model="forms.user.lastName" />
        <label>Employee Id Number</label>        
        <Control.text model="forms.user.employeeId" />
        <label>Email</label>
        <Control.text model="forms.user.email" />
      </Form>
    );
  }
}

export default UserForm;