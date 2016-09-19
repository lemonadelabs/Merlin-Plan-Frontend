import React from 'react';
import { render } from 'react-dom'
import { loggedIn } from './utilities/auth'
import App from './routes/app/';
import Login from './routes/login';
import Home from './routes/home';
import Budget from './routes/budget';
import Track from './routes/track';
import Portfolio from './routes/portfolio';
import Projects from './routes/projects';
import Admin from './routes/admin/';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import * as Webfont from 'webfontloader'

let WebFontConfig = {
  /*Don't render the app till the font is loaded because canvas doesn't like not having the font not already there.
    this could be done in a more elegant way so that the rest of the app isn't waiting on the font but for now this works.*/
  active: renderRouter(),
  google: {
    families: ['Roboto', 'Roboto Condensed']
  },
  timeout: 2000
}
function requireAuth(nextState, replace) {
  if(!loggedIn()){
    replace({
      pathname: '/login',
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

function renderRouter() {
  render((
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} onEnter={requireAuth}/>
        <Route path="login" component={Login} onEnter={requireLoggedOut}/>
        <Route path="portfolio" component={Portfolio} onEnter={requireAuth}/>
        <Route path="projects" component={Projects} onEnter={requireAuth}/>
        <Route path="track" component={Track} onEnter={requireAuth}/>
        <Route path="budget" component={Budget} onEnter={requireAuth}/>
        <Route path="admin" component={Admin} onEnter={requireAuth}/>
      </Route>
    </Router>
  ), document.getElementById('appContainer'))
}

Webfont.load(WebFontConfig)
