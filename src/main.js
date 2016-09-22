import React from 'react';
import { render } from 'react-dom'
import {Provider} from 'react-redux'
import Routes from 'routes'
import { Router, browserHistory } from 'react-router'
import * as Webfont from 'webfontloader'
import store from 'store'


let WebFontConfig = {
  // /*Don't render the app till the font is loaded because canvas doesn't like not having the font not already there.
  //   this could be done in a more elegant way so that the rest of the app isn't waiting on the font but for now this works.*/
  // active: renderRouter(),
  google: {
    families: ['Roboto', 'Roboto Condensed']
  },
  timeout: 2000
}



// function renderRouter() {
  render((
    <Provider store={store}>
      <Router routes={Routes} history={browserHistory}/>
    </Provider>
  ), document.getElementById('appContainer'))
// }

Webfont.load(WebFontConfig)
