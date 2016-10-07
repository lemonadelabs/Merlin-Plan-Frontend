import React, {Component} from 'react';
import {postData} from 'utilities/api-interaction'
import { withRouter } from 'react-router'

class ConfirmEmail extends Component {
  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this)
  }
  confirm(email, code){
    console.log(this.props);
    let emailConfimPromise = postData("user/confirm",{email:email, code:code})
    .then((result)=>{
      this.props.router.push({
        pathname: '/confirm/password',
        query: { email:email, code:code}
      })
    })
    .catch((e)=>{
      console.error(e);
    })
  }
  render() {
    console.log(this.props);
    let {email, code} = this.props.location.query
    return (
      <div>
        <button onClick={()=>{this.confirm(email, code)}}>Confirm Email</button>
      </div>
    );
  }
}

export default withRouter(ConfirmEmail);