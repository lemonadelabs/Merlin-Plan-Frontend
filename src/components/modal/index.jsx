import React, {Component,PropTypes} from 'react';
import styles from './styles.css'
import { connect } from 'react-redux';

//NOTE: Complex way that might be good to look at if this doesn't scale well http://stackoverflow.com/a/35641680
class Modal extends Component {
  constructor(props) {
    super(props);
    this.hideModal = this.hideModal.bind(this)
  }
  hideModal(){
    this.props.dispatch({type:'HIDE_MODAL'})
  }
  render() {
    let modal = <div></div>
    let modalHeader = this.props.title ? <h2>{this.props.title}</h2> : ''

    if(this.props.show){
      modal = <div className={styles.shade} onClick={this.hideModal}>
        
        <div className={styles.modal } onClick={ e => { e.stopPropagation() } }>
          {modalHeader}
          {this.props.children}
        </div>
      </div>
    }
    return modal;
  }
}

Modal.propTypes = {
  children:PropTypes.element.isRequired,
  show:PropTypes.bool.isRequired,
  title: PropTypes.string,
  dispatch:PropTypes.func
}

function mapStateToProps(state) {
  return({show:state.modal.visability})
}

export default connect(mapStateToProps)(Modal);