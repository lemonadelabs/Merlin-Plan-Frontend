import React, {Component} from 'react';
import PasswordForm from 'components/forms/password'
import { postData } from 'utilities/api-interaction';

class ConfimSetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailCode:''
    }
    this.handleChangeSuccess=this.handleChangeSuccess.bind(this)
  }
  handleChangeSuccess(){
    console.log('Password set')
  }
  componentDidMount(){
    let email = this.props.location.query.email
    postData('user/passwordreset',{email:email,sendEmail:false})
      .then((result)=>{
        let decodedCode = decodeURIComponent(result.code)
        this.setState({emailCode:decodedCode})
      })
  }
  render() {
    let email = this.props.location.query.email
    console.log(this.state);
    return (
      <div>
        <PasswordForm email={email} code={this.state.emailCode} handleChangeSuccess={this.handleChangeSuccess}/>
      </div>
    );
  }
}

export default ConfimSetPassword;