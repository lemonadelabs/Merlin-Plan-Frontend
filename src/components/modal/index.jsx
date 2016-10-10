import React, {Component} from 'react';
import styles from './styles.css'
import { connect } from 'react-redux';

//NOTE: Complex way that might be good to look at if this doesn't scale well http://stackoverflow.com/a/35641680
class Modal extends Component {
  constructor(props) {
    super(props);
    this.hideModal = this.hideModal.bind(this)
  }
  hideModal(){
    console.log('bubble');
    this.props.dispatch({type:'HIDE_MODAL'})
  }
  render() {
    let modal = <div></div>
    if(this.props.show){
      modal = <div className={styles.shade} onClick={this.hideModal}>
        <div className={styles.modal } onClick={ (e) => {e.stopPropagation()} }>
          {this.props.children}
        </div>
      </div>
    }
    return modal;
  }
}

export default connect()(Modal);