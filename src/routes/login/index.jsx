import React from 'react'
import { login } from 'utilities/auth'
import { getData } from 'utilities/api-interaction'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import styles from './index.css'

class Login extends React.Component {
  constructor(...args){
    super(...args)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLoginFailAnimationEnd = this.handleLoginFailAnimationEnd.bind(this)
    this.state={
      loginFailed:false,
      playAnimation:false,
    }
  }
  componentDidMount(){
    let loginForm = this.refs.loginForm
    loginForm.addEventListener('animationend', this.handleLoginFailAnimationEnd)
  }
  handleLoginFailAnimationEnd(){
    this.setState({playAnimation:false})
    console.log(this.state);
  }
  handleSubmit(e){
    e.preventDefault();
    let username = this.refs.username.value
    let password = this.refs.password.value
    login(username, password)
      .then(this.handleLogin)
  }
  handleLogin({loginSucceed, loginPayload}){
    let nextRoute = "/"
    if(this.props.location.state){
      nextRoute = this.props.location.state.nextPathname
    }
    if(loginSucceed){
      getData(`user/${loginPayload.sub}`)
      .then((userData) => {
        this.props.dispatch({type:'SET_USER',"userData":userData})
        this.props.router.push(nextRoute)
      })
    }
    else{
      //TODO:Replace alert with a better solution
      this.setState({loginFailed:true, playAnimation:true})
      
      return;
    }
  }
  render(){

    let message = this.state.loginFailed ? 
      <p>Login unsuccessful, check that your username and password are correct.</p> :
      <p>Login to Merlin: Plan</p>
    let loginFormClassnames = this.state.playAnimation ? `${styles.loginForm} ${styles.loginFailAnimation}`: styles.loginForm

    return(
      <div className={styles.container}>
        {message}
        <form ref='loginForm' 
          className={loginFormClassnames}
          onSubmit={this.handleSubmit}>
          <input ref='username' type='text' placeholder="Username"/>
          <input ref='password' type='password' placeholder="Password"/>
          <button type='submit'>Login</button>
        </form>
      </div>
    )
  }
}

export default withRouter(
  connect()(Login)
)
