import React from 'react'
import {Route, IndexRoute} from 'react-router'
import { loggedIn, decodePayload } from 'utilities/auth'
import { getData } from 'utilities/api-interaction'
import store from 'store'
import App from 'routes/app';
import Login from 'routes/login';
import ResetPassword from 'routes/login/reset-password';
import Home from 'routes/home';
import Budget from 'routes/budget';
import Track from 'routes/track';
import Portfolio from 'routes/portfolio';
import Confirm from 'routes/confirm'
import ConfirmEmail from 'routes/confirm/email';
import Projects from 'routes/projects';
import Admin from 'routes/admin';
import AdminUsers from 'routes/admin/users';

function checkStoreForUserDetails(){
  let hasUserId = store.getState().user.id ? true : false
  return(hasUserId)
}

function requireAuth(nextState, replace) {
  if(!loggedIn()){
    replace({
      pathname: 'login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
  else if(!checkStoreForUserDetails()){
    let token = sessionStorage.getItem('token');
    let loginPayload = decodePayload(token)
    getData(`user/${loginPayload.sub}`)
    .then((userData) => {
      store.dispatch({type:'SET_USER',"userData":userData})
    })
  }
}

function requireLoggedOut(nextState, replace) {
  if(loggedIn()){
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} onEnter={requireAuth}/>
    <Route path="confirm" component={Confirm}>
      <Route path="email/:email/:code" component={ConfirmEmail}/>
    </Route>
    <Route path="login" component={Login} onEnter={requireLoggedOut}>
      <Route path="resetpassword" component={ResetPassword} onEnter={requireLoggedOut}/>
    </Route>
    <Route path="portfolio" component={Portfolio} onEnter={requireAuth}/>
    <Route path="projects" component={Projects} onEnter={requireAuth}/>
    <Route path="track" component={Track} onEnter={requireAuth}/>
    <Route path="budget" component={Budget} onEnter={requireAuth}/>
    <Route path="admin" component={Admin} onEnter={requireAuth}/>
    <Route path="admin/users" component={AdminUsers} onEnter={requireAuth}/>
  </Route>
)
