import moment from 'moment'
function login(username, password){
  let headers = createLoginHeaders();
  let request = createLoginRequest({headers, username, password})
  return(fetchToken(request));
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
    .then( (response) => {
      return loginSuccessful(response);
    })
    .catch(function(error) {
      console.error(error);
    });
}

function loginSuccessful(response){
  if(response.error){
    return false;
  }
  else{
    let expiryDate = moment().add(response.expires_in, "seconds").toISOString()
    sessionStorage.setItem('token', response.access_token);
    sessionStorage.setItem('expiryDate', expiryDate);
    return true;
  }
}

function createLoginRequest({headers, username, password}){
  let requestBody = {
    'username': username,
    'password': password,
    'grant_type': 'password',
    'resource': 'http://localhost:5000/',
    'scope': 'offline_access, roles'
  }
  let requestObject = {
    method:'POST',
    headers: headers,
    body: toQueryString(requestBody)
  }
  let request = new Request('api/auth/token', requestObject)
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

export {login, logout, loggedIn}//, canAccess}
