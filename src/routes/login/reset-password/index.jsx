import React, {Component} from 'react';
import PasswordForm from 'components/forms/password'
import { Link } from 'react-router';
import { postData } from 'utilities/api-interaction';

class ResetPassword extends Component {
  constructor(params) {
    super(params)
    this.state = {
      changeSucceded:false
    }
    this.handlePasswordSet = this.handlePasswordSet.bind(this)
  }
  handlePasswordSet(password){
    let {email, code} = this.props.location.query;    
    postData('user/password',{email,code,password})
    .then(()=>{
      this.setState({changeSucceded:true})
    })
  }
  render() {
    let changeSuccededMessage
    if(this.state.changeSucceded){
      changeSuccededMessage = <p>Password Change succeded, <Link to={'/login'}> return to login</Link></p>
    }
    return (
      <div>
        {changeSuccededMessage}
        <PasswordForm handlePasswordSet={this.handlePasswordSet}/>
      </div>
    );
  }
}

export default ResetPassword;