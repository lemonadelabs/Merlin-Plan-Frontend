import { combineReducers } from 'redux'
import { combineForms } from 'react-redux-form';
import organisation from 'reducers/organisation';
import user from 'reducers/user'
import modal from 'reducers/modal'
import adminUsers from 'reducers/admin/users'

const initialUserState = {
  "userName": "",
  "email": "",
  "employeeId": "",
  "firstName": "",
  "lastName": "",
  "nickName": "",
  "roles": [],
  "groups": []
}

const initialGroupState = {
  "name": "",
  'description':""
}

const merlinApp = combineReducers(
  {
    user,
    organisation,
    modal,
    adminUsers,
    forms: combineForms(
      {
        user: initialUserState,
        group: initialGroupState
      },'forms')
  }
)


export default merlinApp
