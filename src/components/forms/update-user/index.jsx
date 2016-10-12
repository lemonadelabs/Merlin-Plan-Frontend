import React, {Component} from 'react';
import { Control, Form, Errors, actions } from 'react-redux-form';
import { connect } from 'react-redux';
import UserDetails from 'components/forms/fields/user-details'
import { putData } from 'utilities/api-interaction';

class UpdateUserForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  
  componentDidMount(){
    let {modelToLoad, dispatch} = this.props
    if(modelToLoad){
      dispatch(actions.merge('forms.user', modelToLoad))
    }
  }
  handleSubmit(user){
    let {dispatch, handleDataUpdate} = this.props
    console.log('user',user);
    putData(`user/${user.id}`,user)
    .then((resp)=>{
      handleDataUpdate(user)
      dispatch({type:'HIDE_MODAL'})
    })
  }
  render() {
    return (
      <Form model="forms.user" onSubmit={(userInfo)=>{this.handleSubmit(userInfo)}}>
        <UserDetails/>
        <button type="submit">Update Details</button>
      </Form>
    );
  }
}

export default connect()(UpdateUserForm);