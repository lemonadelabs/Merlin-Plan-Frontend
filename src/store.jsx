import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import merlinApp from 'reducers'


const store = createStore(merlinApp, {}, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))

export default store
