import React from 'react'
import {Route, IndexRoute} from 'react-router'
import { loggedIn, decodePayload } from 'utilities/auth'
import { getData } from 'utilities/api-interaction'
import store from 'store'
import App from 'routes/app';
import LoginRoot from 'routes/login';
import Login from 'routes/login/login';
import ResetPassword from 'routes/login/reset-password';
import ForgotPassword from 'routes/login/forgot-password';
import Home from 'routes/home';
import ResourcesRoot from 'routes/resources';
import ResourcesList from 'routes/resources/list';
import ResourcesView from 'routes/resources/view';
import Track from 'routes/track';
import Portfolio from 'routes/portfolio';
import Confirm from 'routes/confirm'
import ConfimSetPassword from 'routes/confirm/set-password';
import ConfirmDetails from 'routes/confirm/details';
import Projects from 'routes/projects';
import Admin from 'routes/admin';
import AdminUsers from 'routes/admin/users';
import AdminGroups from 'routes/admin/groups';
import {checkStoreForUserDetails} from 'utilities/user'

function requireAuth(nextState, replace) {
  if(!loggedIn()){
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
  else if(!checkStoreForUserDetails(store)){
    let token = sessionStorage.getItem('token');
    let loginPayload = decodePayload(token)
    getData(`user/${loginPayload.sub}`)
    .then(userData => {
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
      <IndexRoute component={ConfimSetPassword}/>
      <Route path="details" component={ConfirmDetails} onEnter={requireAuth}/>
    </Route>
    <Route path="login" component={LoginRoot} onEnter={requireLoggedOut}>
      <IndexRoute component={Login}/>
      <Route path="resetpassword" component={ResetPassword}/>
      <Route path="forgot" component={ForgotPassword}/>
    </Route>
    <Route path="portfolio" component={Portfolio} onEnter={requireAuth}/>
    <Route path="projects" component={Projects} onEnter={requireAuth}/>
    <Route path="track" component={Track} onEnter={requireAuth}/>
    <Route path="resources" component={ResourcesRoot} onEnter={requireAuth}>
      <IndexRoute component={ResourcesList}/>
      <Route path="view/:scenarioId" component={ResourcesView}/>
    </Route>
    <Route path="admin" component={Admin} onEnter={requireAuth}/>
    <Route path="admin/users" component={AdminUsers} onEnter={requireAuth}/>
    <Route path="admin/groups" component={AdminGroups} onEnter={requireAuth}/>
  </Route>
)
