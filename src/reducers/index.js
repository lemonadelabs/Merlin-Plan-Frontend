import { combineReducers } from 'redux'
import { combineForms } from 'react-redux-form';
import organisation from 'reducers/organisation';
import user from 'reducers/user'
import app from 'reducers/app'
import resources from 'reducers/resources'
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
  'description':"",
  'members':[]
}

const initialResourceScenarioState = {
  "name": "",
  'group': 0
}

const initialFinancialResourceState = {
   "name" : "",
  "startDate" : "",
  "endDate" : "",
  "recurring": false,
  "defaultPartitionValue": 0
}

const merlinApp = combineReducers(
  {
    app,
    user,
    organisation,
    resources,
    modal,
    adminUsers,
    forms: combineForms(
      {
        user: initialUserState,
        group: initialGroupState,
        resourceScenario: initialResourceScenarioState,
        financialResource: initialFinancialResourceState
      },'forms')
  }
)


export default merlinApp
