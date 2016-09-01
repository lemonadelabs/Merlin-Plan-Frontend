import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as Webfont from 'webfontloader'

let WebFontConfig = {
  /*Don't render the app till the font is loaded because canvas doesn't like not having the font not already there.
    this could be done in a more elegant way so that the rest of the app isn't waiting on the font but for now this works.*/
  active: () => ReactDOM.render(<App />, document.getElementById('app')),
  google: {
    families: ['Roboto', 'Roboto Condensed']
  },
  timeout: 2000
}

Webfont.load(WebFontConfig)
