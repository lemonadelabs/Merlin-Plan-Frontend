import React,{Component, PropTypes} from 'react'
import { withRouter } from 'react-router'
import { loggedIn } from 'utilities/auth'
import NavigationBar from 'components/navigation-bar'
import { connect } from 'react-redux';
import styles from './app.css'
import { size } from 'lodash';

class App extends Component {
  constructor() {
    super()
    this.state={
      'menuItems':[
        {label:'Portfolios','route':'/portfolio'},
        {label:'Projects','route':'/projects'},
        {label:'Resources','route':'/resources'},
        {label:'Track','route':'/track'},
        {label:'Admin','route':'/admin'}
      ]
    }
  }
  get appReady(){
    let {user} = this.props
    return (loggedIn() && size(user)>0)
  }
  render(){
    let {user, title, children, location} = this.props
    if( location.pathname === '/login' ){
      return (<div className={styles.app}>{children}</div>)
    }
    if(this.appReady){
      return(<div className={styles.app}><NavigationBar user={user} applicationTitle={title} menuItems={this.state.menuItems}/> {children}</div>)
    }
    return(<div className={styles.app}></div>)
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

export default withRouter(connect(mapStateToProps)(App))
