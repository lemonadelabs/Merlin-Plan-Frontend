import { createStore } from 'redux'
import merlinApp from 'reducers'

export default createStore(merlinApp, window.devToolsExtension && window.devToolsExtension())
