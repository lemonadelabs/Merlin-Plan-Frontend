import moment from 'moment'

function login(username, password){
  let headers = createLoginHeaders();
  let request = createLoginRequest({headers, username, password})
  return fetchToken(request)
       .then( (response) => {
          saveSessionInfo(response)
          let loginSucceed = loginSuccessful(response)
          let loginPayload
          if(loginSucceed){
            loginPayload = decodePayload(response.access_token)
          }
          return ({'loginSucceed':loginSucceed,'loginPayload':loginPayload})
       })
}

function loggedIn(){
  let token = sessionStorage.getItem('token');
  let expiryDate = sessionStorage.getItem('expiryDate');
  let expired = moment().isSameOrAfter(expiryDate);
  return(token && !expired);
}

function logout(){
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('expiryDate');
}

export {login, logout, loggedIn}//, canAccess}

////Private Functions////
function fetchToken(request){
  return fetch(request)
    .then( (response) => {
      switch (response.status) {
        case 200:
        case 400:
          return response.json()
          break;
        default:
          throw new Error('Something went wrong on api server!');
      }
    })
    .catch(function(error) {
      console.error(error);
    });
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
  sessionStorage.setItem('expiryDate', expiryDate);
}

function decodePayload(token){
  let tokenFragments = splitToken(token)
  let payloadB64 = tokenFragments[1]
  let payloadJSON = window.atob(payloadB64) //TODO: There is an issue with non unicode strings and atob, see: https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_.22Unicode_Problem.22
  let payload = JSON.parse(payloadJSON)
  return payload
}

function splitToken(token){
  return(token.split('.'))
}

function createLoginRequest({headers, username, password}){
  let requestBody = {
    'username': username,
    'password': password,
    'grant_type': 'password',
    'resource': 'http://localhost:5000/',
    'scope': 'offline_access roles'
  }
  let requestObject = {
    method:'POST',
    headers: headers,
    body: toQueryString(requestBody)
  }
  let request = new Request('/api/auth/token', requestObject)
  return request
}

function createLoginHeaders(){
  let headers = new Headers()
  headers.append('Content-Type', 'application/x-www-form-urlencoded')
  return headers
}

//taken from http://stackoverflow.com/a/26148931
function toQueryString(obj) {
  return _.map(obj,function(v,k){
    return encodeURIComponent(k) + '=' + encodeURIComponent(v);
  }).join('&');
};
