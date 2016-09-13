import React from 'react'
import { login } from '../utilities/auth'
import { withRouter } from 'react-router'

class Login extends React.Component {
  constructor(...args){
    super(...args)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    }
  handleSubmit(e){
    e.preventDefault();
    let username = this.refs.username.value
    let password = this.refs.password.value
    login(username, password)
      .then(this.handleLogin)
  }
  handleLogin(success){
    if(success){
      this.props.router.push("/");
    }
    else{
      alert("username or password incorrect")
      return;
    }
  }
  render(){
    return(
      <div>
        <form className="loginForm" onSubmit={this.handleSubmit}>
          <input ref='username' type='text' placeholder="Username"/>
          <input ref='password' type='password' placeholder="Password"/>
          <button type='submit'>Login</button>
        </form>
      </div>
    )
  }
}

export default withRouter(Login)
