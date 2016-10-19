import React from 'react'
import { loggedIn } from 'utilities/auth'
import NavigationBar from 'components/navigation-bar'
import { connect } from 'react-redux';
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
    let {user, title} = this.props
    if (loggedIn()){
      navbar = <NavigationBar user={user} applicationTitle={title} menuItems={this.state.menuItems}/>
    }
    return (
      <div className={styles.app}>
        {navbar }
        {this.props.children}
      </div>
    )
  }
}

function mapStateToProps(state, props){
  return({title:state.app.title, user:state.user})
}

export default connect(mapStateToProps)(App)
