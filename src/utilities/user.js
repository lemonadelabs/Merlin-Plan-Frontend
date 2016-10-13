import { getData } from 'utilities/api-interaction'

function getUserInfoAndSetUserState(userId, dispatch){
  return getData(`user/${userId}`)
  .then((userData) => {
    dispatch({type:'SET_USER',"userData":userData})
  })
}

function checkStoreForUserDetails(store){
  let hasUserId = store.getState().user.id ? true : false
  return(hasUserId)
}

export {getUserInfoAndSetUserState, checkStoreForUserDetails}