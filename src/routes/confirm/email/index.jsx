import React, {Component, Proptypes} from 'react';
import {postData} from 'utilities/api-interaction'
import { withRouter } from 'react-router'

class ConfirmEmail extends Component {
  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this)
  }
  confirm(email, code){
    postData("user/confirm",{email:email, code:code})
    .then( result =>{
      this.props.router.push({
        pathname: '/confirm/password',
        query: { email:email, code:code}
      })
    })
    .catch(e=>{
      console.error(e);
    })
  }
  render() {
    let {email, code} = this.props.location.query
    return (
      <div>
        <button onClick={ () => { this.confirm(email, code) } }>Confirm Email</button>
      </div>
    );
  }
}

ConfirmEmail.propTypes = {
  router: Proptypes.any,
  location: Proptypes.any
}

export default withRouter(ConfirmEmail);