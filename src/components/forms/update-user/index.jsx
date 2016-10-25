import React, {Component} from 'react';
import { Control, Form, Errors, actions } from 'react-redux-form';
import { connect } from 'react-redux';
import UserDetails from 'components/forms/fields/user-details'
import UserGroupField from 'components/forms/fields/user-group'
import { forEach, findIndex, concat } from 'lodash';
import { addUserToGroups, removeUserFromGroups } from 'utilities/user';
import { getData, putData } from 'utilities/api-interaction';

class UpdateUserForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount(){
    let {organisationId, modelToLoad, dispatch} = this.props
    getData(`organisation/${organisationId}/group`)
      .then((groups)=>{
        let newGroupAction = {type:'SET_ORG_GROUPS', groups}
        dispatch(newGroupAction)
      })
    if(modelToLoad){
      dispatch(actions.merge('forms.user', modelToLoad))
    }
  }
  handleSubmit(user){
    let {dispatch, handleDataUpdate, modelToLoad} = this.props
    let {groupsToAdd, groupsToRemove} = this.findGroupsToAddAndRemove(user.groups, modelToLoad.groups)
    let groupAdditionRemovingPromises = concat(addUserToGroups(groupsToAdd, user.id), removeUserFromGroups(groupsToRemove, user.id))

    putData(`user/${user.id}`,user)
    .then((resp)=>{
      Promise.all(groupAdditionRemovingPromises)
        .then(
          ()=>{
            handleDataUpdate(user)
            dispatch({type:'HIDE_MODAL'})
        })
    })
  }
  findGroupsToAddAndRemove(newGroups,oldGroups){
    let groupsToAdd = []
    let groupsToRemove = []
    forEach(newGroups, newGroup => {
      if(findIndex(oldGroups, oldGroup => ( newGroup.id === oldGroup.id )) === -1){
        groupsToAdd.push(newGroup)
      }
    })
    forEach(oldGroups, oldGroup => {
      if(findIndex(newGroups, newGroup => ( newGroup.id === oldGroup.id )) === -1){
        groupsToRemove.push(oldGroup)
      }
    })
    return {groupsToAdd, groupsToRemove}
  }
  render() {
    let {organisationGroups} = this.props
    return (
      <Form model="forms.user" onSubmit={(userInfo)=>{this.handleSubmit(userInfo)}}>
        <UserDetails/>
        <UserGroupField organisationGroups={organisationGroups}/>
        <button type="submit">Update Details</button>
      </Form>
    );
  }
}

function propsToState(state, props) {
  return(
    {
      organisationId:state.user.organisationId,
      organisationGroups:state.organisation.groups
    }
  )
}

export default connect(propsToState)(UpdateUserForm);