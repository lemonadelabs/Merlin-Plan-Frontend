import React,{Component, PropTypes} from 'react'
import { login } from 'utilities/auth'
import { getUserInfoAndSetUserState } from 'utilities/user'
import { Link, withRouter} from 'react-router'
import { connect } from 'react-redux'
import styles from './index.css'

class Login extends Component {
  constructor(...args){
    super(...args)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this)
    this.handleLoginFailure = this.handleLoginFailure.bind(this)
    this.handleLoginFailAnimationEnd = this.handleLoginFailAnimationEnd.bind(this)
    this.state={
      loginFailed:false,
      playAnimation:false
    }
  }
  componentDidMount(){
    let loginForm = this.refs.loginForm
    loginForm.addEventListener('animationend', this.handleLoginFailAnimationEnd)
  }
  handleLoginFailAnimationEnd(){
    this.setState({playAnimation:false})
  }
  handleSubmit(e){
    e.preventDefault();
    let username = this.refs.username.value
    let password = this.refs.password.value
    login(username, password)
      .then(this.handleLoginSuccess)
      .catch(this.handleLoginFailure)
  }
  handleLoginSuccess({loginPayload}){
    let nextRoute = this.props.location.state ? this.props.location.state.nextPathname : "/"
    getUserInfoAndSetUserState(loginPayload.sub, this.props.dispatch)
    .then( this.props.router.push(nextRoute) )
  }
  handleLoginFailure(error){
    this.setState({loginFailed:true, playAnimation:true})
  }
  render(){

    let message = this.state.loginFailed ? <p>Login unsuccessful, check that your username and password are correct.</p> : <p>Login to Merlin: Plan</p>
    let loginFormClassnames = this.state.playAnimation ? `${styles.loginForm} ${styles.loginFailAnimation}`: styles.loginForm

    return(
      <div className={styles.container}>
        {message}
        <form ref="loginForm"
          className={loginFormClassnames}
          onSubmit={this.handleSubmit}>
          <input ref="username" type="text" placeholder="Username"/>
          <input ref="password" type="password" placeholder="Password"/>
          <button type="submit">Login</button>
        </form>
        <Link to={'/login/forgot'}>Forgot password</Link>
      </div>
    )
  }
}
Login.propTypes = {
  dispatch:PropTypes.func.isRequired,
  location:PropTypes.object.isRequired,
  router:PropTypes.object.isRequired
}
export default withRouter(
  connect()(Login)
)
