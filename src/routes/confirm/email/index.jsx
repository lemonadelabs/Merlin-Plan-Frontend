import React, {Component} from 'react';
import {postData} from 'utilities/api-interaction'

class ConfirmEmail extends Component {
  confirm(email, code){
    postData("user/confirm",{email:email,code:code})
  }
  render() {
    console.log(this.props.params);
    let {email, code} = this.props.params
    return (
      <div>
        <button onClick={()=>{this.confirm(email, code)}}>Confirm Email</button>
      </div>
    );
  }
}

export default ConfirmEmail;