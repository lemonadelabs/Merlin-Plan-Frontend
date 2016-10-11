import React, {Component} from 'react';
import PasswordForm from 'components/forms/password'
import { postData } from 'utilities/api-interaction';
import { login } from 'utilities/auth'
import { getUserInfoAndSetUserState } from 'utilities/user'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

class ConfimSetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailCode:'',
      password:'',
      passwordSet:false
    }
    this.handlePasswordSet=this.handlePasswordSet.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }
  handleClick(e){
    let email = this.props.location.query.email
    let password = this.state.password
    login(email,password)
      .then(this.handleLogin)
  }
  handleLogin({loginSucceed, loginPayload}){
    getUserInfoAndSetUserState(loginPayload.sub, this.props.dispatch)
    .then(()=>{
      this.props.router.push('/confirm/details')
    })
  }
  handlePasswordSet(password){
    let {email, code} = this.props.location.query
    postData("user/confirm", {email:email, code:code, password:password})
      .then(
        this.setState( { passwordSet:true, password:password } )
      )
  }
  render() {
    let passwordSet = this.state.passwordSet
    let nextButton
    if(passwordSet){
      nextButton = <button onClick={this.handleClick}>Next</button>
    }
    return (
      <div>
        <PasswordForm handlePasswordSet={this.handlePasswordSet}/>
        {nextButton}
      </div>
    );
  }
}

export default withRouter(
  connect()(ConfimSetPassword)
);