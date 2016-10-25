import { getData, putData } from 'utilities/api-interaction'
import {forEach} from 'lodash'

function getUserInfoAndSetUserState(userId, dispatch){
  return getData(`user/${userId}`)
  .then((userData) => {
    dispatch({type:'SET_USER',"userData":userData})
  })
}
/**Looks in the store and sees if there is user.id in the getState return */
function checkStoreForUserDetails(store){
  let hasUserId = store.getState().user.id ? true : false
  return(hasUserId)
}

/**given an array of groups and an userId it will add the user to the group.id and return an array of promises */
function addUserToGroups(groups, userId){
  console.assert(userId, 'No userId supplied')
  let groupPromises = []
  forEach(groups, (group) => {
    groupPromises.push(
      putData( `group/${group.id}/adduser`, { users : [ userId ] } )
    )
  })
  return groupPromises
}

/**given an array of groups and an userId it will remove the user to the group.id and return an array of promises */
function removeUserFromGroups(groups, userId){
  console.assert(userId, 'No userId supplied')
  let groupPromises = []
  forEach(groups, (group) => {
    groupPromises.push(
      putData( `group/${group.id}/removeuser`, { users : [ userId ] } )
    )
  })
  return groupPromises
}

export {getUserInfoAndSetUserState, checkStoreForUserDetails, addUserToGroups, removeUserFromGroups}