
function getData(endpoint){
  let headers = createHeaders()
  let request = createRequest({headers:headers, method:"GET", url:`/api/${endpoint}`})
  return( fetchReqest(request) )
}

function postData(){

}

function putData(){

}

function deleteData(){

}

export {getData}

function fetchReqest(request){
  return fetch(request)
    .then( (response) => {
      switch (response.status) {
        case 200:
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

function createHeaders(contentType = 'application/json'){
  let headers = new Headers()
  headers.append('Content-Type', contentType)
  return headers
}

function createRequest({headers, method, url, requestBody}){
  let requestObject = {
    method: method,
    headers: headers
  }
  if(requestBody){
    requestObject.body = requestBody
  }
  let request = new Request(url, requestObject)
  return request
}
