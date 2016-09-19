import React from 'react'
import { loggedIn } from '../../utilities/auth'
import NavigationBar from '../../components/navigation-bar/navigation-bar.jsx'
import styles from './app.css'

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
      navbar = <NavigationBar applicationTitle={'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'} menuItems={this.state.menuItems}/>
    }
    return (
      <div className={styles.app}>
        {navbar }
        {this.props.children}
      </div>
    )
  }
}

export default App
