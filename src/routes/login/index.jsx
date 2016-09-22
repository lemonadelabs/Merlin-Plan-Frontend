import React from 'react'
import { login } from 'utilities/auth'
import { getData } from 'utilities/api-interaction'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

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
  handleLogin({loginSucceed, loginPayload}){
    let nextRoute = "/"
    if(this.props.location.state){
      nextRoute = this.props.location.state.nextPathname
    }
    if(loginSucceed){
      getData(`user/${loginPayload.sub}`)
      .then((userData) => {
        this.props.setOrganisationId(userData.organisationId)
        this.props.setUserData(userData)
        this.props.router.push(nextRoute)
      })
    }
    else{
      //TODO:Replace alert with a better solution
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

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setOrganisationId: (organisationId) => {
      dispatch({type:'SET_ORG_ID',"id":organisationId})
    },
    setUserData: (userData) => {
      dispatch({type:'SET_USER',"userData":userData})
    }
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Login)
)
