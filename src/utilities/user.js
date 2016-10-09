import { getData } from 'utilities/api-interaction'

function getUserInfoAndSetUserState(userId, dispatch){
  return getData(`user/${userId}`)
  .then((userData) => {
    dispatch({type:'SET_USER',"userData":userData})
  })
}

export {getUserInfoAndSetUserState}