import React from 'react'
import { loggedIn } from './utilities/auth'
import NavigationBar from './components/navigation-bar'

class App extends React.Component {
  constructor() {
    super()
    this.state={
      'menuItems':[
        {label:'Portfolio','route':'portfolio'},
        {label:'Projects','route':'projects'},
        {label:'Budget','route':'budget'},
        {label:'Track','route':'track'},
        {label:'Admin','route':'admin'}
      ]
    }
  }

  render() {
    let navbar
    if (loggedIn()){
      navbar = <NavigationBar menuItems={this.state.menuItems}/>
    }
    return (
      <div>
        {navbar }
        {this.props.children}
      </div>
    )
  }
}

export default App
