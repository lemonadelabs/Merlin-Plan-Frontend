
function getData(endpoint){
  let headers = createHeaders()
  let request = createRequest({headers:headers, method:"GET", url:`/api/${endpoint}`})
  return( fetchReqest(request) )
}

function postData(endpoint, body){
  let headers = createHeaders()
  let request = createRequest(
    { headers:headers,
      method:"POST",
      url:`/api/${endpoint}`,
      requestBody:body
    })
  return( fetchReqest(request) )
}

function putData(){

}

function deleteData({endPoint, id, body, contentType=''}){
  let headers = createHeaders(contentType)
  let url = `/api/${endPoint}`
  if(id){
    url+= `/${id}`
  }
  let requestParams = { 
      headers:headers,
      method:"DELETE",
      url: url
    }
  if(body){
    requestParams.requestBody = body
    console.log(body);
  }
  let request = createRequest( requestParams )
  return( fetchReqest(request) )
}

export {getData, postData, deleteData}

function fetchReqest(request){
  return fetch(request)
    .then( (response) => {
      switch (response.status) {
        case 200:
          return response.text()
        default:
          throw new Error('Something went wrong on api server!');
      }
    })
    .then((responseText)=>{
      return(responseText ? JSON.parse(responseText) : responseText)
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
    requestObject.body = JSON.stringify(requestBody)
  }
  let request = new Request(url, requestObject)
  return request
}
