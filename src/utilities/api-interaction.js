import {size, forEach, map} from 'lodash';

/**Will make GET request to `/api/${endpoint}` if you pass a query object it will convert the javascript object into a url query
 * @returns a promise*/
function getData(endpoint, query = {}){
  let url = `/api/${endpoint}`
  if(size(query)){
   url += queryStringFromObject(query)
  }
  let headers = createHeaders()
  let request = createRequest({headers:headers, method:"GET", url:url})
  return( fetchRequest(request) )
}

/**Will make POST request to `/api/${endpoint}` and returns a promise*/
function postData(endpoint, body, contentType){
  let headers = createHeaders(contentType)
  let request = createRequest(
    { headers:headers,
      method:"POST",
      url:`/api/${endpoint}`,
      requestBody:body
    })
  return( fetchRequest(request) )
}

/**Will make PUT request to `/api/${endpoint}` and returns a promise*/
function putData(endpoint, body){
  let headers = createHeaders()
  let request = createRequest(
  { headers:headers,
    method:"PUT",
    url:`/api/${endpoint}`,
    requestBody:body
  })
  return( fetchRequest(request) )
}

/**Will make DELETE request to `/api/${endpoint}/${id}` with an optional Id parameter being optional and returns a promise*/
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
  }
  let request = createRequest( requestParams )
  return( fetchRequest(request) )
}

export {getData, postData, putData, deleteData}

/**If passed an object it will use the keys and values of the object to generate a url query string*/
function queryStringFromObject(query){
  let queryString ='?'
  let currentQuery=0
  forEach(query, (value, key) => {
    let seperator = currentQuery > 0 ? '&' : ""
    queryString += `${seperator}${key}=${value}`
    currentQuery++
  })
  return queryString
}

function fetchRequest(request){
   let promise = fetch(request)
    .then( response => {
      switch (response.status) {
        case 200:
          return response.text()
        default:{
          let error = new Error(`${response.status} ${response.statusText}`)
          promise.reject(error)
        }
      }
    })
    .then( responseText => {
      return(responseText ? JSON.parse(responseText) : responseText)
    })
    return promise
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
    let contentType = headers.get('Content-Type')
    switch (contentType) {
      case 'application/json':
        requestObject.body = JSON.stringify(requestBody)
        break;
      case 'application/x-www-form-urlencoded':
        requestObject.body = toQueryString(requestBody)
        break;
      default:
        requestObject.body = requestBody
        break;
    }
  }
  let request = new Request(url, requestObject)
  return request
}

//taken from http://stackoverflow.com/a/26148931
function toQueryString(obj) {
  return map(obj,function(v,k){
    return encodeURIComponent(k) + '=' + encodeURIComponent(v);
  }).join('&');
}