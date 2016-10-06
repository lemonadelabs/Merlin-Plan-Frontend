import React, {Component} from 'react';
import {postData} from 'utilities/api-interaction'
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(e){
    e.preventDefault();
    let email = this.refs.email.value
    postData('user/passwordreset', {email:email, sendEmail:true})
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Email Address</label>
          <input ref="email" placeholder={'Email'}/>
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

export default ForgotPassword;