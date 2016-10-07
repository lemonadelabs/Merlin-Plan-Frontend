import React, {Component} from 'react';
import PasswordForm from 'components/forms/password'
import { postData } from 'utilities/api-interaction';
import { login } from 'utilities/auth'
import { withRouter } from 'react-router'
class ConfimSetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailCode:'',
      password:'',
      passwordSet:false
    }
    this.handleChangeSuccess=this.handleChangeSuccess.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(e){
    let email = this.props.location.query.email
    let password = this.state.password
    login(email,password)
    .then(()=>{
      this.props.router.push('/confirm/details')
    })
  }
  handleChangeSuccess(password){
    console.log('Password set')
    
    this.setState({passwordSet:true,password:password})
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
    let passwordSet = this.state.passwordSet
    let nextButton
    if(passwordSet){
      nextButton = <button onClick={this.handleClick}>Next</button>
    }
    return (
      <div>
        <PasswordForm email={email} code={this.state.emailCode} handleChangeSuccess={this.handleChangeSuccess}/>
        {nextButton}
      </div>
    );
  }
}

export default withRouter(ConfimSetPassword);