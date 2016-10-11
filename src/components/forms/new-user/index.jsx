import React, {Component} from 'react';
import { Control, Form, Errors, actions } from 'react-redux-form';
import generatePassword from 'password-generator'
import { getData, postData } from 'utilities/api-interaction'
import { connect } from 'react-redux'
import { debounce } from 'lodash/debounce'
import { required } from 'components/forms/validators';
import EmailField from 'components/forms/fields/email'
import UserDetails from 'components/forms/fields/user-details'

const roles = ["Staff", "Project Admin", "Planner", "Approver", "Tracker", "Manager"]

class NewUserForm extends Component {
  
  handleSubmit(userInfo){
    let {dispatch} = this.props
    let newUserPayload = {userDetails:{}, password:""}
    newUserPayload.userDetails = Object.assign({},userInfo)
    newUserPayload.userDetails.organisationId = this.props.organisationId
    newUserPayload.userDetails.userName = newUserPayload.userDetails.email
    newUserPayload.password = generatePassword()
    postData('user', newUserPayload).then(
      (user) => {
        console.log(user,actions);
        if (user.succeeded === false){
          return
        }
        dispatch({type: 'NEW_ORG_USER', user: user})
        dispatch({type: 'HIDE_MODAL'})
        dispatch(actions.reset('forms.user'))

      }
    )
  }
  render() {
    return (
      <Form autoComplete={"off"} model="forms.user" onSubmit={(userInfo)=>{this.handleSubmit(userInfo)}}>
        <UserDetails/>
        <EmailField/>
        <Control.select            
          validators={{
            required
          }}
          multiple={true} 
          model=".roles">
          {
            roles.map((role)=>{
              return(<option key={role} value={role}>{role}</option>)
            })
          }
        </Control.select>
        <button type="submit">Add User</button>
      </Form>
    );
  }
}

export default connect()(NewUserForm);