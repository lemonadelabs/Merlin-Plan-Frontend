import React, {Component} from 'react';
import { Control, Form, Errors, actions } from 'react-redux-form';
import generatePassword from 'password-generator'
import { getData, postData } from 'utilities/api-interaction'
import { connect } from 'react-redux'
import { debounce } from 'lodash/debounce'
import { required } from 'components/forms/validators';
import EmailField from 'components/forms/fields/email'
import UserDetails from 'components/forms/fields/user-details'
import { forEach } from 'lodash';

const roles = ["Staff", "Project Admin", "Planner", "Approver", "Tracker", "Manager"]

class NewUserForm extends Component {
  
  handleSubmit(userInfo){
    let {dispatch} = this.props
    let groups = this.parseGroupJSON(userInfo.groups)
    let newUserPayload = this.createNewUserPayload(userInfo)
    postData('user', newUserPayload).then(
      (user) => {
        if (user.succeeded === false){
          return
        }
        let groupsAdded = this.addUserToGroups(groups, user.id)
        Promise.all(groupsAdded).then( ( ) => {
          user.groups = groups
          dispatch({type: 'NEW_ORG_USER', user: user})
          dispatch({type: 'HIDE_MODAL'})
          dispatch(actions.reset('forms.user'))
        })
      }
    )
  }
  parseGroupJSON(groups){
    let parsedGroups = []
    forEach(groups, (groupJSON) => {
      parsedGroups.push(JSON.parse(groupJSON))
    })
    return parsedGroups
  }
  addUserToGroups(groups, userId){
    let groupPromises = []
    forEach(groups, (group) => {
      console.log(group);
      groupPromises.push(
        postData( `group/${group.id}/user`, { users : [ userId ] } )
      )
    })
    return groupPromises
  }
  createNewUserPayload(userInfo){
    let newUserPayload = {userDetails:{}, password:""}
    newUserPayload.userDetails = Object.assign({},userInfo)
    newUserPayload.userDetails.organisationId = this.props.organisationId
    newUserPayload.userDetails.userName = newUserPayload.userDetails.email
    delete newUserPayload.userDetails.groups
    newUserPayload.password = generatePassword()
    return newUserPayload
  }
  componentDidMount(){
    let {organisationId,dispatch} = this.props
    getData(`organisation/${organisationId}/group`)
      .then((groups)=>{
        let newGroupAction = {type:'SET_ORG_GROUPS', groups}
        console.log('groups motherfuckers',groups);
        dispatch(newGroupAction)
      })
  }
  render() {
    console.log(this.props);
    let organisationGroups = this.props.organisationGroups || []
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
        <Control.select            
          validators={{
            required
          }}
          multiple={true} 
          model=".groups">
          {
            organisationGroups.map((group)=>{
              let groupStringified = JSON.stringify(group)
              return(<option key={group.id} value={groupStringified}> {group.name}</option>)
            })
          }
        </Control.select>
        <button type="submit">Add User</button>
      </Form>
    );
  }
}

function propsToState(state, props) {
  return(
    {
      organisationId:state.user.organisationId,
      organisationGroups:state.orginisation.groups
    }
  )
}

export default connect(propsToState)(NewUserForm);