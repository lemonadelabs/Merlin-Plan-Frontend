import React, {Component} from 'react';
import { Control, Form, Errors, actions } from 'react-redux-form';
import generatePassword from 'password-generator'
import { getData, postData } from 'utilities/api-interaction'
import { connect } from 'react-redux'
import { debounce } from 'lodash/debounce'

const required = (val) => val && val.length
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val)

function checkAvailability(email) {
    //THIS NEEDS TO BE DEBOUNCED!!!
    return getData('user/validate',{'email':email})
}

const roles = ["Staff", "Project Admin", "Planner", "Approver", "Tracker", "Manager"]

class UserForm extends Component {
  handleSubmit(userInfo){
    let {dispatch} = this.props
    let newUserPayload = {userDetails:{}, password:""}
    newUserPayload.userDetails = Object.assign({},userInfo)
    newUserPayload.userDetails.organisationId = this.props.organisationId
    newUserPayload.userDetails.userName = newUserPayload.userDetails.email
    newUserPayload.password = generatePassword()
    postData('user', newUserPayload).then(
      (user) => {
        console.log(user);
        if (user.succeeded === false){
          return
        }
        dispatch({type: 'NEW_ORG_USER', user: user})
      }
    )
  }
  render() {
    let firstName = this.props.firstName
    return (
      <Form autoComplete={"off"} model="forms.user" onSubmit={(userInfo)=>{this.handleSubmit(userInfo)}}>
        <label>First name</label>
        <Errors
          model="forms.user.firstName"
          show="touched"
          messages={{
            required: 'Please provide an first name.'
          }}
        />
        <Control.text model="forms.user.firstName" 
          validators={{
            required
          }}/>
        <Errors
          model="forms.user.lastName"
          show="touched"
          messages={{
            required: 'Please provide an last name.',
          }}
        />
        <label>Last name</label>        
        <Control.text model="forms.user.lastName" 
          validators={{
              required
          }}
          />
        <label>Employee Id Number</label>        
        <Control.text model="forms.user.employeeId" />
        <label>Email</label>
        <Errors
          model="forms.user.email"
          show="touched"
          messages={{
            validEmail: (val) => (val.length > 0 ? `Sorry ${val} is not a valid email.` : ''),
            available: (val) => `${val} is already taken, ${firstName ? firstName:'this person'} might already have an account.`,
            required: 'Please provide an email address.',
          }}
        />
        <Control.text model="forms.user.email"
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
        <Control.select            
          validators={{
            required
          }}
          multiple={true} 
          model="forms.user.roles">
          {
            roles.map((role)=>{
              return(<option value={role}>{role}</option>)
            })
          }
        </Control.select>
        <button type="submit">Add User</button>
      </Form>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  let firstName = state.forms.user.firstName
  return({firstName:firstName})
}

export default connect(mapStateToProps)(UserForm);