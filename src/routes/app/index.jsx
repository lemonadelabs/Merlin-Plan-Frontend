import React,{Component, PropTypes} from 'react'
import { loggedIn } from 'utilities/auth'
import NavigationBar from 'components/navigation-bar'
import { connect } from 'react-redux';
import styles from './app.css'

class App extends Component {
  constructor() {
    super()
    this.state={
      'menuItems':[
        {label:'Portfolio','route':'/portfolio'},
        {label:'Projects','route':'/projects'},
        {label:'Budget','route':'/budget'},
        {label:'Track','route':'/track'},
        {label:'Admin','route':'/admin'}
      ]
    }
  }

  render() {
    let navbar
    let {user, title, children} = this.props
    if (loggedIn()){
      navbar = <NavigationBar user={user} applicationTitle={title} menuItems={this.state.menuItems}/>
    }
    return (
      <div className={styles.app}>
        {navbar }
        {children}
      </div>
    )
  }
}

App.propTypes = {
  user: PropTypes.object,
  title: PropTypes.string,
  children: PropTypes.element
}

function mapStateToProps(state){
  return({title:state.app.title, user:state.user})
}

export default connect(mapStateToProps)(App)
