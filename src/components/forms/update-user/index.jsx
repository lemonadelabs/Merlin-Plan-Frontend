import React, {Component, PropTypes} from 'react';
import { Form, actions } from 'react-redux-form';
import { connect } from 'react-redux';
import UserDetails from 'components/forms/fields/user-details'
import UserGroupField from 'components/forms/fields/user-group'
import { difference } from 'lodash';
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
      .then( groups => {
        let newGroupAction = {type:'SET_ORG_GROUPS', groups}
        dispatch(newGroupAction)
      })
    if(modelToLoad){
      dispatch(actions.merge('forms.user', modelToLoad))
    }
  }
  handleSubmit(user){
    let {dispatch, handleDataUpdate, modelToLoad} = this.props
    let {groupsToAdd, groupsToRemove} = findGroupsToAddAndRemove(user.groups, modelToLoad.groups)
    let updateUserPromises = [putData(`user/${user.id}`,user), ...addUserToGroups(groupsToAdd, user.id), ...removeUserFromGroups(groupsToRemove, user.id)]

    Promise.all(updateUserPromises)
    .then(
      () => {
        handleDataUpdate(user)
        dispatch({type:'HIDE_MODAL'})
      }
    )
  }

  render() {
    let {organisationGroups} = this.props
    return (
      <Form model="forms.user" onSubmit={userInfo => { this.handleSubmit(userInfo) }}>
        <UserDetails/>
        <UserGroupField organisationGroups={organisationGroups}/>
        <button type="submit">Update Details</button>
      </Form>
    );
  }
}

UpdateUserForm.propTypes = {
  organisationId: PropTypes.number.isRequired,
  organisationGroups: PropTypes.array.isRequired,
  handleDataUpdate: PropTypes.func.isRequired,
  modelToLoad: PropTypes.object.isRequired,
  dispatch:PropTypes.func
}

function findGroupsToAddAndRemove(newGroups,oldGroups){
  let groupsToAdd = difference(newGroups, oldGroups)
  let groupsToRemove = difference(oldGroups, newGroups)
  return {groupsToAdd, groupsToRemove}
}

function propsToState(state) {
  return(
    {
      organisationId:state.user.organisationId,
      organisationGroups:state.organisation.groups
    }
  )
}

export default connect(propsToState)(UpdateUserForm);