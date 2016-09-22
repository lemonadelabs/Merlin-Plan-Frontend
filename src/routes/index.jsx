import React from 'react'
import { loggedIn } from 'utilities/auth'
import {Route, IndexRoute} from 'react-router'
import App from 'routes/app';
import Login from 'routes/login';
import Home from 'routes/home';
import Budget from 'routes/budget';
import Track from 'routes/track';
import Portfolio from 'routes/portfolio';
import Projects from 'routes/projects';
import Admin from 'routes/admin';
import AdminUsers from 'routes/admin/users';

function requireAuth(nextState, replace) {
  if(!loggedIn()){
    replace({
      pathname: 'login',
      state: { nextPathname: nextState.location.pathname }
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
    <Route path="login" component={Login} onEnter={requireLoggedOut}/>
    <Route path="portfolio" component={Portfolio} onEnter={requireAuth}/>
    <Route path="projects" component={Projects} onEnter={requireAuth}/>
    <Route path="track" component={Track} onEnter={requireAuth}/>
    <Route path="budget" component={Budget} onEnter={requireAuth}/>
    <Route path="admin" component={Admin} onEnter={requireAuth}/>
    <Route path="admin/users" component={AdminUsers} onEnter={requireAuth}/>
  </Route>
)
