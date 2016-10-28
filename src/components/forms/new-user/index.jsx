import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux'
import { Control, Form, actions } from 'react-redux-form';
import generatePassword from 'password-generator'
import { required } from 'components/forms/validators';
import EmailField from 'components/forms/fields/email'
import UserDetails from 'components/forms/fields/user-details'
import UserGroupField from 'components/forms/fields/user-group'
import MultiSelectDropdown from 'components/multi-select-dropdown';
import { getData, postData } from 'utilities/api-interaction'
import { addUserToGroups } from 'utilities/user';

const roles = ["Staff", "Project Admin", "Planner", "Approver", "Tracker", "Manager"]

class NewUserForm extends Component {
  
  handleSubmit(userInfo){
    let {dispatch} = this.props
    let groups = userInfo.groups
    let newUserPayload = this.createNewUserPayload(userInfo)
    postData('user', newUserPayload).then(
      user => {
        if (user.succeeded === false){
          return
        }
        let groupsAdded = addUserToGroups(groups, user.id)
        Promise.all(groupsAdded).then( ( ) => {
          user.groups = groups
          dispatch({type: 'NEW_ORG_USER', user: user})
          dispatch({type: 'HIDE_MODAL'})
          dispatch(actions.reset('forms.user'))
        })
      }
    )
  }
  createNewUserPayload(userInfo){
    let newUserPayload = {userDetails:{}, password:""}
    newUserPayload.userDetails = Object.assign({},userInfo)
    newUserPayload.userDetails.organisationId = this.props.organisationId
    newUserPayload.userDetails.userName = newUserPayload.userDetails.email
    Reflect.deleteProperty(newUserPayload.userDetails, 'groups')
    newUserPayload.password = generatePassword()
    return newUserPayload
  }
  componentDidMount(){
    let {organisationId, dispatch} = this.props
    getData(`organisation/${organisationId}/group`)
      .then( groups => {
        let newGroupAction = {type:'SET_ORG_GROUPS', groups}
        dispatch(newGroupAction)
      })
  }
  render() {
    let organisationGroups = this.props.organisationGroups || []
    return (
      <Form autoComplete={"off"} model="forms.user" onSubmit={userInfo=>{ this.handleSubmit(userInfo) }}>
        <UserDetails/>
        <EmailField/>
        <Control.select            
          validators={{
            required
          }}
          component={MultiSelectDropdown} 
          controlProps={{options:roles, labelTemplate: role => (`${role}`), valueMapping: role => ( role ) }}
          multiple={true} 
          model=".roles"/>
          <UserGroupField  organisationGroups={organisationGroups}/>
        <button type="submit">Add User</button>
      </Form>
    );
  }
}

NewUserForm.propTypes = {
  organisationId : PropTypes.number,
  organisationGroups : PropTypes.array,
  dispatch: PropTypes.func
}

function propsToState(state) {
  return(
    {
      organisationId:state.user.organisationId,
      organisationGroups:state.organisation.groups
    }
  )
}

export default connect(propsToState)(NewUserForm);