import React, {Component} from 'react';
import { postData } from 'utilities/api-interaction';
class PasswordForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(e){
    e.preventDefault();
    if(this.passwordsMatch()){
      let {email, code, handleChangeSuccess} = this.props
      let password = this.refs.password.value
      postData('user/password',{email,code,password})
      .then(()=>{
        handleChangeSuccess();
      })
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