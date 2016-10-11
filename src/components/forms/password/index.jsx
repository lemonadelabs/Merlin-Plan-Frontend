import React, {Component} from 'react';

class PasswordForm extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(e){
    e.preventDefault();
    let password = this.refs.password.value
    if(this.passwordsMatch()){
      this.props.handlePasswordSet(password)
    }
  }
  passwordsMatch(){
    let {password, passwordConfimation} = this.refs
    if(password.value !== passwordConfimation.value){
     return false
    }
    return true
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Password</label>
        <input ref="password"/>
        <label>Confim Password</label>
        <input ref="passwordConfimation"/>
        <button type={'submit'}>Change Password</button>
      </form>
    );
  }
}

export default PasswordForm;