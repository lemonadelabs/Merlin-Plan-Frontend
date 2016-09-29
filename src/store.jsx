import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import merlinApp from 'reducers'


const store = createStore(merlinApp, applyMiddleware(thunk), window.devToolsExtension && window.devToolsExtension())

export default store
