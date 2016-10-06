import React, {Component} from 'react';
import PasswordForm from 'components/forms/password'
import { Link } from 'react-router';
class ResetPassword extends Component {
  constructor(params) {
    super(params)
    this.state = {
      changeSucceded:false
    }
    this.handleChangeSuccess = this.handleChangeSuccess.bind(this)
  }
  handleChangeSuccess(){
    this.setState({changeSucceded:true})
  }
  render() {
    let {email, code} = this.props.location.query;
    let changeSuccededMessage
    if(this.state.changeSucceded){
      changeSuccededMessage = <p>Password Change succeded, <Link to={'/login'}> return to login</Link></p>
    }
    return (
      <div>
        {changeSuccededMessage}
        <PasswordForm email={email} code={code} handleChangeSuccess={this.handleChangeSuccess}/>
      </div>
    );
  }
}

export default ResetPassword;