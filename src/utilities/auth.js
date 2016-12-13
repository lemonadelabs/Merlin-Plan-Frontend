import moment from 'moment'
import { postData } from 'utilities/api-interaction';

/**Make a postData call to 'auth/token' to request a token Returns a promise with the parameters of if the login was successful and the payload from the server*/
function login(username, password){
  let loginBody = createLoginRequestBody({username, password})
  return postData('auth/token', loginBody, 'application/x-www-form-urlencoded')
          .then(handleLoginResponse)
}

/** Checks sessionStorage for the JWT stored with the key 'token' and gets the expiryDate of the JWT and checks to see if it is expired*/
function loggedIn(){
  let token = sessionStorage.getItem('token');
  let expiryDate = sessionStorage.getItem('expiryDate');
  let expired = moment().isSameOrAfter(expiryDate);
  return(token && !expired);
}

/** Removes the token and expiry date from session storage*/
function logout(){
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('expiryDate');
}

/** Decodeds the JWT and returns the payload encoded in the token*/
function decodePayload(token){
  let tokenFragments = splitToken(token)
  let payloadB64 = tokenFragments[1]
  let payloadJSON = window.atob(payloadB64) //TODO: There is an issue with non unicode strings and atob, see: https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_.22Unicode_Problem.22
  let payload = JSON.parse(payloadJSON)
  return payload
}

export {login, logout, loggedIn, decodePayload}//, canAccess}

////Private Functions////

function createLoginRequestBody({username, password}){
  let requestBody = {
    'username': username,
    'password': password,
    'grant_type': 'password',
    'resource': 'http://localhost:5000/',
    'scope': 'offline_access roles'
  }
  return (requestBody)
}

function handleLoginResponse(response) {
  saveSessionInfo(response)
  let loginSucceed = loginSuccessful(response)
  let loginPayload
  if(loginSucceed){
    loginPayload = decodePayload(response.access_token)
  }
  return ({'loginSucceed':loginSucceed,'loginPayload':loginPayload})
}

function loginSuccessful({error}){
  if(error){
    return false;
  }
  else{
    return true;
  }
}

function saveSessionInfo({access_token, expires_in, refresh_token}){
  let expiryDate = moment().add(expires_in, "seconds").toISOString()
  sessionStorage.setItem('token', access_token);
  sessionStorage.setItem('refreshToken', refresh_token);
  sessionStorage.setItem('expiryDate', expiryDate);
}

function splitToken(token){
  return(token.split('.'))
}

