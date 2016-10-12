import React, {Component} from 'react';
import { getData } from 'utilities/api-interaction'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import UserCard from 'components/user-card';
import Modal from 'components/modal'
import UpdateUserForm from 'components/forms/update-user'
class ConfirmDetails extends Component {
  constructor(args) {
    super(args)
    this.correctDetails = this.correctDetails.bind(this)
    this.incorrectDetails = this.incorrectDetails.bind(this)
    this.updateUserDetails = this.updateUserDetails.bind(this)
    this.state = {
      showModal:false
    }
  }
  updateUserDetails(user){
    this.props.dispatch({type:'SET_USER',userData:user})
  }
  correctDetails(){
    this.props.router.push('/')
  }
  incorrectDetails(){
    this.props.dispatch({type:'SHOW_MODAL'})
  }
  render() {
    return (
      <div>
        Confirm Details
        <p>Are your details correct?</p>
        <UserCard user={this.props.user}/>
        <button onClick={this.incorrectDetails}>No</button>
        <button onClick={this.correctDetails}>Yes</button>
        <Modal show={this.props.showModal}> <UpdateUserForm handleDataUpdate={this.updateUserDetails} modelToLoad={this.props.user}/> </Modal>
      </div>
    );
  }
}

function mapStateToProps(state,ownProps){
  return({user : state.user, showModal: state.modal.visability})
}

export default withRouter(
  connect(mapStateToProps)(ConfirmDetails)
);